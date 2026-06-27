import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.5";
const badge = "v3.1.5 review gate";
const previousRelease = "v3.1.4 Controlled Execution Packet Draft";
const nextGate = "Controlled execution authorization hold";

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

const packetConfig = JSON.parse(read("data/vedapath-controlled-execution-packet-draft.json"));
const samplePacketDraft = {
  schema_version: packetConfig.schema_version,
  release: packetConfig.release,
  controlled_execution_packet_draft_id: "controlled-execution-packet-draft-sample-steady-action-bg-2-48",
  packet_status: "Controlled packet draft ready",
  controlled_execution_packet_draft_ready: true,
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
  next_gate_required: "Controlled execution review gate",
  ...packetConfig.sample_packet,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-execution-review-gate-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Controlled Execution Review Gate",
  summary: "Reviews the controlled execution packet draft for source integrity, reviewer evidence, rollback, monitoring, stop conditions, expiry, and production boundary while authorization, execution, storage writes, canonical writes, migrations, accounts, secrets, public release, and production stay disabled.",
  previous_release: previousRelease,
  source: {
    controlled_execution_packet_draft_release: packetConfig.release,
    controlled_execution_packet_draft_schema: packetConfig.schema_version,
    controlled_execution_packet_draft_id: samplePacketDraft.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: samplePacketDraft.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: samplePacketDraft.promotion_execution_preflight_id,
    source_answer_id: samplePacketDraft.source_answer_id,
    source_record_id: samplePacketDraft.source_record_id,
    source_family: samplePacketDraft.source_family
  },
  review_states: [
    "Draft review",
    "Needs reviewer evidence",
    "Controlled review ready",
    "Return to packet draft",
    "Review hold",
    "Execution blocked",
    "Production forbidden",
    "Review expired"
  ],
  required_by_state: {
    "Draft review": ["controlled_execution_packet_draft_id", "source_answer_id", "review_scope"],
    "Needs reviewer evidence": ["review_question", "evidence_review"],
    "Controlled review ready": [
      "review_actor",
      "reviewer_name",
      "controlled_execution_packet_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "review_scope",
      "evidence_review",
      "boundary_review",
      "rollback_review",
      "monitoring_review",
      "stop_condition_review",
      "reviewer_decision",
      "expiry_check",
      "production_boundary"
    ],
    "Return to packet draft": ["return_reason"],
    "Review hold": ["hold_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Review expired": ["expiry_check", "hold_reason"]
  },
  review_checks: [
    {
      check: "Packet draft ready",
      rule: "Review can start only from a controlled packet draft ready object whose next gate is controlled execution review gate."
    },
    {
      check: "Review only",
      rule: "The review gate can mark review readiness only; it cannot authorize execution or source writes."
    },
    {
      check: "Evidence visible",
      rule: "Reviewer evidence, source-owner scope, rights, translation, citation, rollback, monitoring, and founder instruction remain visible."
    },
    {
      check: "Boundary repeated",
      rule: "The review must explicitly keep authorization, execution, founder grant, source promotion, storage, canonical writes, public release, and production false."
    },
    {
      check: "Stop condition",
      rule: "Any source mismatch, missing evidence, rights change, reviewer change, code change, or true authority flag blocks the review."
    },
    {
      check: "Expiry",
      rule: "Review readiness expires on material source, rights, reviewer, founder instruction, rollback, monitoring, packet draft, or code change."
    }
  ],
  sample_packet_draft: samplePacketDraft,
  sample_review: {
    review_state: "Controlled review ready",
    review_actor: "Controlled execution reviewer",
    reviewer_name: "Reviewer sample",
    controlled_execution_packet_draft_id: samplePacketDraft.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: samplePacketDraft.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: samplePacketDraft.promotion_execution_preflight_id,
    source_answer_id: samplePacketDraft.source_answer_id,
    source_record_id: samplePacketDraft.source_record_id,
    source_family: samplePacketDraft.source_family,
    review_scope: "Review the draft only for source integrity, evidence, boundaries, rollback, monitoring, stop condition, and expiry. Do not authorize, execute, promote, store, write canonical source, run migration, create account, use secrets, publish public release, or launch production.",
    evidence_review: "Confirm source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, founder instruction, preflight, and packet draft are visible.",
    boundary_review: "Controlled execution review gate only; controlled_execution_review_ready may be true, but execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    rollback_review: "Confirm rollback, replay, before_hash, failure review, stop condition, and reviewer handoff are present; no source state is written.",
    monitoring_review: "Confirm audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check are present.",
    stop_condition_review: "Stop if source ids mismatch, rights change, reviewer evidence is missing, source-owner scope is missing, founder instruction expires, rollback is missing, monitoring is missing, code changes, or any authorization, execution, storage, canonical, public release, or production flag is true.",
    reviewer_decision: "Review ready for authorization hold only; no authorization granted.",
    expiry_check: "Review expires at the next material source, rights, reviewer, founder instruction, rollback, monitoring, packet draft, or code change and must be rechecked; not permanent approval.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    controlled_execution_review_ready: false,
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

write("data/vedapath-controlled-execution-review-gate.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-controlled-execution-review-gate.css", `/* VedaPath controlled execution review gate */
.review-gate,
.review-head,
.review-layout,
.review-form,
.review-grid,
.review-list,
.review-actions,
.review-rules {
  display: grid;
  gap: 10px;
}

.review-gate { gap: 16px; }

.review-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.review-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.review-mark img {
  display: block;
  width: 100%;
}

.review-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.review-form,
.review-card,
.review-result,
.review-output,
.review-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.review-form,
.review-card,
.review-result,
.review-rule {
  padding: 12px;
}

.review-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.review-form input,
.review-form select,
.review-form textarea,
.review-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.review-form textarea,
.review-output {
  min-height: 100px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.review-grid,
.review-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.review-card,
.review-result {
  border-left: 4px solid var(--gold);
}

.review-card.ready,
.review-result[data-state="Controlled review ready"] {
  border-left-color: var(--green);
}

.review-card.blocked,
.review-result[data-state="Blocked"],
.review-result[data-state="Return to packet draft"],
.review-result[data-state="Review hold"],
.review-result[data-state="Execution blocked"],
.review-result[data-state="Production forbidden"],
.review-result[data-state="Review expired"] {
  border-left-color: var(--ochre);
}

.review-card span,
.review-card strong,
.review-rule span,
.review-rule strong {
  display: block;
}

.review-card span,
.review-rule span {
  color: var(--muted);
  font-size: 12px;
}

.review-result strong {
  display: block;
  font-size: 24px;
}

.review-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.review-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.review-list {
  max-height: 320px;
  overflow: auto;
}

.review-output {
  min-height: 260px;
}

.review-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .review-layout,
  .review-head,
  .review-grid,
  .review-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .review-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-controlled-execution-review-gate.js", `(() => {
  const storageKey = "vedapath-controlled-execution-review-gate";
  const root = document.getElementById("controlledExecutionReviewGate");
  const savedRoot = document.getElementById("reviewSaved");
  const resultCard = document.getElementById("reviewResultCard");
  const reviewOutput = document.getElementById("reviewOutput");
  const checksRoot = document.getElementById("reviewChecks");
  const scopeRoot = document.getElementById("reviewScope");

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

  function packetDraftReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-execution-packet-draft-v1" &&
      packet.packet_status === "Controlled packet draft ready" &&
      packet.controlled_execution_packet_draft_ready === true &&
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
      packet.next_gate_required === "Controlled execution review gate";
  }

  function keepsReviewBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_execution_review_ready may be true/i,
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
    const unsafe = /(execution_packet_authorized true|execution_authorized true|execution_allowed true|founder_instruction_granted true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|authorize now|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function reviewMissingForState(config, state, review = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(review[field] || "").trim());
  }

  function idMatches(review, packetDraft, key) {
    return !review[key] || !packetDraft[key] || review[key] === packetDraft[key];
  }

  function controlledExecutionReviewGate(config, packetDraft, review) {
    const state = review.review_state || "Draft review";
    const missing = reviewMissingForState(config, state, review);
    const blocked = [];

    if (!packetDraftReady(packetDraft)) blocked.push("controlled execution packet draft must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    ["controlled_execution_packet_draft_id", "founder_execution_instruction_gate_id", "promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(review, packetDraft, key)) blocked.push(key + " must match the controlled execution packet draft");
    });

    const readyCandidate = state === "Controlled review ready";
    if (readyCandidate && !hasText(review.review_scope, [["review the draft only"], ["source integrity"], ["evidence"], ["boundaries"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["do not", "authorize"], ["execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["public release"], ["production"]])) {
      blocked.push("review scope must be draft-only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(review.evidence_review, [["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"], ["preflight"], ["packet draft"], ["visible"]])) {
      blocked.push("evidence review must confirm source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, founder instruction, preflight, and packet draft are visible");
    }
    if (readyCandidate && !keepsReviewBoundary(review.boundary_review)) {
      blocked.push("boundary review must keep review readiness as the only true readiness flag and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(review.rollback_review, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["no source state"], ["written"]])) {
      blocked.push("rollback review must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, and no source state write");
    }
    if (readyCandidate && !hasText(review.monitoring_review, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"]])) {
      blocked.push("monitoring review must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check");
    }
    if (readyCandidate && !hasText(review.stop_condition_review, [["stop"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder instruction expires"], ["rollback"], ["monitoring"], ["code changes"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition review must stop on source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, or any true authority flag");
    }
    if (readyCandidate && !hasText(review.reviewer_decision, [["review ready"], ["authorization hold"], ["no authorization granted"]])) {
      blocked.push("reviewer decision must say review ready for authorization hold only and no authorization granted");
    }
    if (readyCandidate && !hasText(review.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder instruction"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that review expires and is not permanent approval");
    }
    if (readyCandidate && !keepsProductionBoundary(review.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs reviewer evidence" && !review.review_question) blocked.push("review question is required");
    if (state === "Return to packet draft" && !review.return_reason) blocked.push("return reason is required");
    if (state === "Review hold" && !review.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !review.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Review expired" && !review.hold_reason) blocked.push("hold reason is required when review expires");

    const review_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_execution_review_gate_id: "controlled-execution-review-gate-" + Date.now(),
      review_status,
      controlled_execution_review_ready: review_status === "Controlled review ready",
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
      controlled_execution_packet_draft_id: review.controlled_execution_packet_draft_id || packetDraft.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: review.founder_execution_instruction_gate_id || packetDraft.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: review.promotion_execution_preflight_id || packetDraft.promotion_execution_preflight_id || "",
      source_answer_id: review.source_answer_id || packetDraft.source_answer_id || "",
      source_record_id: review.source_record_id || packetDraft.source_record_id || "",
      source_family: review.source_family || packetDraft.source_family || "",
      review_actor: review.review_actor || "",
      reviewer_name: review.reviewer_name || "",
      review_scope: review.review_scope || "",
      evidence_review: review.evidence_review || "",
      boundary_review: review.boundary_review || "",
      rollback_review: review.rollback_review || "",
      monitoring_review: review.monitoring_review || "",
      stop_condition_review: review.stop_condition_review || "",
      reviewer_decision: review.reviewer_decision || "",
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

  function reviewSnapshot(reviews, config) {
    const byStatus = reviews.reduce((counts, review) => {
      const key = review.review_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_reviews: reviews.length,
      ready: byStatus["Controlled review ready"] || 0,
      blocked: byStatus.Blocked || 0,
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
    return '<article class="review-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(review) {
    if (!resultCard) return;
    const issues = [...(review.missing || []), ...(review.blocked || [])];
    resultCard.dataset.state = review.review_status;
    resultCard.innerHTML = '<strong>' + safe(review.review_status) + '</strong>' +
      '<p class="muted">Review ready: ' + safe(review.controlled_execution_review_ready) + ' | Authorized: ' + safe(review.execution_packet_authorized) + ' | Production: ' + safe(review.production_ready) + '</p>' +
      '<div class="review-grid">' +
        card("Packet draft", review.controlled_execution_packet_draft_id, review.controlled_execution_review_ready ? "ready" : "") +
        card("Source answer", review.source_answer_id) +
        card("Next gate", review.next_gate_required) +
        card("Execution", review.execution_allowed ? "enabled" : "false", review.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for authorization hold review. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.review_checks.map((check) =>
      '<article class="review-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Packet draft", config.source.controlled_execution_packet_draft_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parseReviewJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(reviews) {
    localStorage.setItem(storageKey, JSON.stringify(reviews.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const reviews = readSaved();
    const snapshot = reviewSnapshot(reviews, config);
    savedRoot.innerHTML = card("Saved reviews", snapshot.saved_reviews) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      reviews.slice(-4).reverse().map((review) =>
        '<article class="review-card ' + (review.controlled_execution_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(review.created_at) + '</span>' +
        '<strong>' + safe(review.review_status) + '</strong>' +
        '<span>' + safe(review.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledExecutionReviewGate = {
    controlledExecutionReviewGate,
    reviewSnapshot,
    reviewMissingForState,
    parseReviewJson,
    packetDraftReady
  };

  if (!root) return;

  fetch("data/vedapath-controlled-execution-review-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packetDraft: root.querySelector("#reviewPacketDraft"),
        state: root.querySelector("#reviewState"),
        actor: root.querySelector("#reviewActor"),
        reviewerName: root.querySelector("#reviewerName"),
        packetDraftId: root.querySelector("#reviewPacketDraftId"),
        founderGateId: root.querySelector("#reviewFounderGateId"),
        preflightId: root.querySelector("#reviewPreflightId"),
        sourceAnswer: root.querySelector("#reviewSourceAnswer"),
        sourceRecord: root.querySelector("#reviewSourceRecord"),
        sourceFamily: root.querySelector("#reviewSourceFamily"),
        scope: root.querySelector("#reviewScopeText"),
        evidence: root.querySelector("#reviewEvidence"),
        boundary: root.querySelector("#reviewBoundary"),
        rollback: root.querySelector("#reviewRollback"),
        monitoring: root.querySelector("#reviewMonitoring"),
        stop: root.querySelector("#reviewStopCondition"),
        decision: root.querySelector("#reviewDecision"),
        expiry: root.querySelector("#reviewExpiry"),
        production: root.querySelector("#reviewProductionBoundary"),
        question: root.querySelector("#reviewQuestion"),
        returnReason: root.querySelector("#reviewReturnReason"),
        holdReason: root.querySelector("#reviewHoldReason"),
        block: root.querySelector("#reviewBlockReason")
      };

      config.review_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_review;
        fields.packetDraft.value = JSON.stringify(config.sample_packet_draft, null, 2);
        fields.state.value = item.review_state;
        fields.actor.value = item.review_actor;
        fields.reviewerName.value = item.reviewer_name;
        fields.packetDraftId.value = item.controlled_execution_packet_draft_id;
        fields.founderGateId.value = item.founder_execution_instruction_gate_id;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.review_scope;
        fields.evidence.value = item.evidence_review;
        fields.boundary.value = item.boundary_review;
        fields.rollback.value = item.rollback_review;
        fields.monitoring.value = item.monitoring_review;
        fields.stop.value = item.stop_condition_review;
        fields.decision.value = item.reviewer_decision;
        fields.expiry.value = item.expiry_check;
        fields.production.value = item.production_boundary;
        fields.question.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildReview() {
        return {
          review_state: fields.state.value,
          review_actor: fields.actor.value,
          reviewer_name: fields.reviewerName.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          review_scope: fields.scope.value,
          evidence_review: fields.evidence.value,
          boundary_review: fields.boundary.value,
          rollback_review: fields.rollback.value,
          monitoring_review: fields.monitoring.value,
          stop_condition_review: fields.stop.value,
          reviewer_decision: fields.decision.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          review_question: fields.question.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const packetDraft = parseReviewJson(fields.packetDraft.value, {});
        const review = controlledExecutionReviewGate(config, packetDraft, buildReview());
        reviewOutput.value = JSON.stringify(review, null, 2);
        renderResult(review);
        return review;
      }

      root.querySelector("#runReviewGate").addEventListener("click", run);
      root.querySelector("#loadReviewSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveReviewGate").addEventListener("click", () => {
        const review = run();
        writeSaved([...readSaved(), review]);
        renderSaved(config);
      });
      root.querySelector("#clearReviewGates").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyReviewGate").addEventListener("click", async () => {
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

write("controlledexecutionreviewgate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Execution Review Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-execution-review-gate.css">
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
            <span>Controlled execution review gate</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Execution Review Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Review is not authority</span>
          <h2>Inspect the packet before authorization</h2>
          <p class="muted">This room reviews the controlled execution packet draft. It can mark review readiness only; it cannot authorize, execute, promote, store, migrate, use secrets, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Packet</strong><p>Load draft.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Evidence</strong><p>Confirm context.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Repeat false flags.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Hold</strong><p>Move to authorization hold.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledexecutionpacketdraft.html">Open Packet Draft</a>
            <a class="button safe" href="founderexecutioninstructiongate.html">Open Founder Gate</a>
          </div>
        </aside>

        <section class="panel review-gate" id="controlledExecutionReviewGate">
          <div class="review-head">
            <div>
              <span class="eyebrow">Review gate</span>
              <h1>Review the packet. Keep authority closed.</h1>
              <p class="muted">A ready review here means the packet can move to an authorization hold next. It still cannot authorize, execute, promote, store, update canonical records, run migrations, create accounts, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="review-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled execution review mark"></div>
          </div>

          <section class="review-layout">
            <div class="review-form">
              <h2>Controlled Execution Review</h2>
              <label>Packet draft<textarea id="reviewPacketDraft"></textarea></label>
              <label>Review state<select id="reviewState"></select></label>
              <label>Review actor<input id="reviewActor" type="text" placeholder="Controlled execution reviewer"></label>
              <label>Reviewer name<input id="reviewerName" type="text" placeholder="Reviewer sample"></label>
              <label>Packet draft id<input id="reviewPacketDraftId" type="text"></label>
              <label>Founder gate id<input id="reviewFounderGateId" type="text"></label>
              <label>Preflight id<input id="reviewPreflightId" type="text"></label>
              <label>Source answer id<input id="reviewSourceAnswer" type="text"></label>
              <label>Source record id<input id="reviewSourceRecord" type="text"></label>
              <label>Source family<input id="reviewSourceFamily" type="text"></label>
              <label>Review scope<textarea id="reviewScopeText"></textarea></label>
              <label>Evidence review<textarea id="reviewEvidence"></textarea></label>
              <label>Boundary review<textarea id="reviewBoundary"></textarea></label>
              <label>Rollback review<textarea id="reviewRollback"></textarea></label>
              <label>Monitoring review<textarea id="reviewMonitoring"></textarea></label>
              <label>Stop condition review<textarea id="reviewStopCondition"></textarea></label>
              <label>Reviewer decision<textarea id="reviewDecision"></textarea></label>
              <label>Expiry check<textarea id="reviewExpiry"></textarea></label>
              <label>Production boundary<textarea id="reviewProductionBoundary"></textarea></label>
              <label>Review question<textarea id="reviewQuestion"></textarea></label>
              <label>Return reason<textarea id="reviewReturnReason"></textarea></label>
              <label>Hold reason<textarea id="reviewHoldReason"></textarea></label>
              <label>Block reason<textarea id="reviewBlockReason"></textarea></label>
              <div class="review-actions">
                <button class="button primary" id="runReviewGate" type="button">Run Review</button>
                <button class="button safe" id="loadReviewSample" type="button">Load Sample</button>
                <button class="button" id="saveReviewGate" type="button">Save Local</button>
                <button class="button" id="clearReviewGates" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="review-result" id="reviewResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Review Scope</h2>
                <div class="review-list" id="reviewScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Review Checks</h2>
            <div class="review-rules" id="reviewChecks"></div>
          </section>

          <section class="review-layout">
            <div>
              <div class="review-actions">
                <button class="button safe" id="copyReviewGate" type="button">Copy Review Gate</button>
                <a class="button" href="data/vedapath-controlled-execution-review-gate.json">Open JSON</a>
              </div>
              <textarea class="review-output" id="reviewOutput" aria-label="Controlled execution review gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="review-list" id="reviewSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review is not authorization</span>
          <h2 style="margin-top: 14px;">Ready to Hold, Not Run</h2>
          <p class="muted">The review can say the packet is coherent enough for an authorization hold while every operational path stays locked.</p>
          <div class="progress" aria-label="Controlled execution review gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>8</strong></div>
            <div class="metric"><span>Authorized</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Authorization hold</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Boundary</h2>
            <p class="review-boundary">Review only. Authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares the controlled execution authorization hold. It does not execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-execution-review-gate.js"></script>
  </body>
</html>
`);

write("docs/CONTROLLED_EXECUTION_REVIEW_GATE.md", `# VedaPath AI Controlled Execution Review Gate

Release: ${release}

This release reviews the controlled execution packet draft without granting authorization or execution.

## Files

- data/vedapath-controlled-execution-review-gate.json
- controlledexecutionreviewgate.html
- assets/vedapath-controlled-execution-review-gate.css
- assets/vedapath-controlled-execution-review-gate.js

## What It Adds

The room:

- starts from a controlled packet draft ready object
- reviews source integrity, evidence, boundaries, rollback, monitoring, stop condition, expiry, and production boundary
- permits only a future controlled execution authorization hold
- keeps authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production false

## Boundary

Controlled execution review is not execution approval. It does not promote source data, run storage writes, update canonical source records, run migrations, create accounts, use secrets, publish public release state, or launch production. The next release should create a controlled execution authorization hold while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE START -->
## ${release} Controlled Execution Review Gate

This release reviews the controlled execution packet draft for source integrity, evidence, rollback, monitoring, stop conditions, expiry, and production boundary while all authorization, execution, promotion, storage, canonical-write, migration, account, secret, public-release, and production flags stay false.

- [Controlled Execution Review Gate](controlledexecutionreviewgate.html)
- [Controlled Execution Review Gate Notes](docs/CONTROLLED_EXECUTION_REVIEW_GATE.md)
- [Controlled Execution Review Gate Data](data/vedapath-controlled-execution-review-gate.json)

<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION REVIEW GATE START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT START -->", readmeBlock + "<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE NOTES START -->
## ${release} Controlled Execution Review Gate

This phase reviews a controlled execution packet draft without authorizing execution.

- Adds a controlled execution review gate room.
- Reads a controlled packet draft ready object.
- Requires source integrity, evidence, boundary, rollback, monitoring, stop condition, reviewer decision, production boundary, and expiry review.
- Keeps execution_packet_authorized, execution_authorized, execution_allowed, founder_instruction_granted, source_promotion_allowed, promotion_execution_allowed, implementation_authorized, implementation_execution_allowed, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, production_ready, production_launch_allowed, and public_release_allowed false.

<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION REVIEW GATE NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT NOTES START -->", notesBlock + "<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE BLUEPRINT START -->
### 298. Controlled Execution Review Gate

VedaPath should make every controlled execution packet pass a review gate before authorization is even considered. The review gate can mark review readiness, but it cannot authorize or execute.

Core requirements:

- start from a controlled packet draft ready object
- confirm exact packet draft id, source answer, source record, source family, founder gate, and preflight context
- review source integrity, evidence, rollback, monitoring, stop condition, reviewer decision, production boundary, and expiry
- permit only a future controlled execution authorization hold
- block authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production

Controlled Execution Review Gate should never claim execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION REVIEW GATE BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.4 packet draft<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now feels calm enough for the next functional build: founder execution instruction, execution readiness, and production memory.", "The product surface now has a controlled route: packet draft, review gate, authorization hold next, and production still closed.");
  if (!content.includes('href="controlledexecutionreviewgate.html"')) {
    content = mustReplace(content, '<a href="controlledexecutionpacketdraft.html">Packet draft <span>review</span></a>', '<a href="controlledexecutionpacketdraft.html">Packet draft <span>review</span></a>\n              <a href="controlledexecutionreviewgate.html">Review gate <span>hold</span></a>', "study map review gate link");
    content = mustReplace(content, '<a href="controlledexecutionpacketdraft.html">Packet draft <span>no-write</span></a>', '<a href="controlledexecutionpacketdraft.html">Packet draft <span>no-write</span></a>\n              <a href="controlledexecutionreviewgate.html">Review gate <span>no-authority</span></a>', "build map review gate link");
  }
  return content;
});

update("controlledexecutionpacketdraft.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.4 packet draft<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledexecutionreviewgate.html"')) {
    content = mustReplace(content, '<a class="button safe" href="promotionexecutionpreflight.html">Open Preflight</a>', '<a class="button safe" href="promotionexecutionpreflight.html">Open Preflight</a>\n            <a class="button" href="controlledexecutionreviewgate.html">Open Review Gate</a>', "packet draft review link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.4 packet draft<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.1.4</strong>\n          <p>Controlled Execution Packet Draft: founder instruction now produces a reviewable packet shape while authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.1.5</strong>\n          <p>Controlled Execution Review Gate: packet drafts now receive source, evidence, boundary, rollback, monitoring, and expiry review while authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace("<strong>96%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:96%\"></div></div>\n          <p>The trust loop now shapes the first execution packet draft while every real write path remains closed.</p>", "<strong>97%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:97%\"></div></div>\n          <p>The trust loop now reviews the packet draft while every real write path remains closed.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Controlled execution review gate</strong>\n          <p>Review the draft packet before any authorization can be considered.</p>", "<span>Next release</span>\n          <strong>Controlled execution authorization hold</strong>\n          <p>Hold authorization behind review evidence before any execution can be considered.</p>");
  if (!content.includes("Phase 279: Controlled Execution Review Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 279: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 279: Controlled Execution Review Gate</strong>
                <p>Reviews a controlled packet draft for source integrity, evidence, boundaries, rollback, monitoring, stop conditions, expiry, and production boundary while all authority remains false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 280: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.4 Controlled Execution Packet Draft</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.5 Controlled Execution Review Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.3 Founder Execution Instruction Gate</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Draft the first controlled execution packet without enabling execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Review the controlled execution packet before any authorization can be considered.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled execution review gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled execution authorization hold</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled execution review gate.</span></li>\n              <li><span class="dot"></span><span>Keep authorization and execution disabled.</span></li>\n              <li><span class="dot"></span><span>Inspect reviewer, rollback, monitoring, and stop conditions.</span></li>\n              <li><span class="dot"></span><span>Preserve storage, canonical, public release, and production blocks.</span></li>', '<li><span class="dot"></span><span>Build controlled execution authorization hold.</span></li>\n              <li><span class="dot"></span><span>Require review-gate readiness before any authorization question.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Prepare founder review of authorization language only.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.4 packet draft<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled execution review gate applied.`);

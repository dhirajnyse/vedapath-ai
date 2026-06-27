(() => {
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
    "\"": "&quot;",
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

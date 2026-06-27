(() => {
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
    "\"": "&quot;",
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

(() => {
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
    "\"": "&quot;",
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

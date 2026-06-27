(() => {
  const storageKey = "vedapath-promotion-execution-preflight";
  const root = document.getElementById("promotionExecutionPreflight");
  const savedRoot = document.getElementById("preflightSaved");
  const resultCard = document.getElementById("preflightResultCard");
  const packetOutput = document.getElementById("preflightPacket");
  const checksRoot = document.getElementById("preflightChecks");
  const scopeRoot = document.getElementById("preflightScope");

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

  function holdReviewReady(packet) {
    return Boolean(packet) &&
      packet.promotion_status === "Promotion hold review ready" &&
      packet.source_promotion_hold_review_ready === true &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Promotion execution preflight";
  }

  function keepsExecutionBoundary(value) {
    const text = String(value || "");
    const required = [
      /execution_preflight_passed remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /source_promotion_allowed remains false/i,
      /promotion_execution_allowed remains false/i,
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i
    ].every((pattern) => pattern.test(text));
    const unsafe = /(execution_preflight_passed true|execution_authorized true|execution_allowed true|source_promotion_allowed true|promotion_execution_allowed true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|execute now|write enabled|production write|canonical update|migration run|secret use)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["opened"]]);
  }

  function preflightMissingForState(config, state, preflight = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(preflight[field] || "").trim());
  }

  function idMatches(preflight, holdPacket, key) {
    return !preflight[key] || !holdPacket[key] || preflight[key] === holdPacket[key];
  }

  function promotionExecutionPreflight(config, holdPacket, preflight) {
    const state = preflight.preflight_state || "Draft execution preflight";
    const missing = preflightMissingForState(config, state, preflight);
    const blocked = [];
    const warnings = [];

    if (!holdReviewReady(holdPacket)) blocked.push("source promotion hold review packet must be ready while promotion, execution, storage, and production flags remain false");
    ["source_promotion_hold_review_id", "implementation_authorization_dry_run_id", "founder_instruction_gate_id", "entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(preflight, holdPacket, key)) blocked.push(key + " must match the source promotion hold packet");
    });

    const readyCandidate = state === "Execution preflight ready";
    if (readyCandidate && !hasText(preflight.preflight_scope, [["named", "source-answer"], ["future", "execution", "packet"], ["do not", "execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["production"]])) {
      blocked.push("preflight scope must be future-only, named-packet, and explicitly block execution, promotion, storage, canonical writes, migration, accounts, secrets, and production");
    }
    if (readyCandidate && !hasText(preflight.execution_conditions, [["promotion hold"], ["source integrity"], ["rights"], ["translation"], ["reviewer evidence"], ["rollback plan"], ["monitoring plan"], ["human approval"], ["founder"]])) {
      blocked.push("execution conditions must include promotion hold, source integrity, rights, translation, reviewer evidence, rollback, monitoring, human approval, and founder recheck");
    }
    if (readyCandidate && !hasText(preflight.readonly_rehearsal, [["dry rehearsal"], ["execution plan"], ["failure path"], ["without touching"], ["storage"], ["canonical"], ["accounts"], ["secrets"], ["migrations"], ["production"]])) {
      blocked.push("readonly rehearsal must produce a plan and failure path without touching execution surfaces");
    }
    if (readyCandidate && !hasText(preflight.final_blockers, [["rights review"], ["source owner"], ["reviewer evidence"], ["rollback"], ["monitoring"], ["founder"], ["write flag"]])) {
      blocked.push("final blockers must include rights, source owner, reviewer evidence, rollback, monitoring, founder, and write-flag blockers");
    }
    if (readyCandidate && !hasText(preflight.rollback_plan, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["no source state"]])) {
      blocked.push("rollback plan must include rollback, replay, before_hash, failure review, and no source state write");
    }
    if (readyCandidate && !hasText(preflight.monitoring_plan, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before any write"]])) {
      blocked.push("monitoring plan must include audit, stop condition, failure review, handoff, post-execution verification, and before-write boundary");
    }
    if (readyCandidate && !hasText(preflight.human_approval_check, [["human approval"], ["explicit"], ["named"], ["source-specific"], ["separate"], ["founder review"], ["not approval"]])) {
      blocked.push("human approval check must be explicit, named, source-specific, separate from founder review, and not treated as approval");
    }
    if (readyCandidate && !keepsExecutionBoundary(preflight.execution_boundary)) {
      blocked.push("execution boundary must keep preflight pass, execution, promotion, storage, source-write, canonical, and production flags false");
    }
    if (readyCandidate && !keepsProductionBoundary(preflight.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, and durable storage paths closed");
    }
    if (state === "Needs execution preflight review" && !preflight.review_question) blocked.push("review question is required");
    if (state === "Return to promotion hold" && !preflight.return_reason) blocked.push("return reason is required");
    if (state === "Execution hold" && !preflight.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !preflight.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !preflight.block_reason) blocked.push("block reason is required when production is forbidden");

    if (holdPacket.promotion_execution_allowed !== false) warnings.push("promotion hold review must never be interpreted as promotion execution");

    const preflight_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      promotion_execution_preflight_id: "promotion-execution-preflight-" + Date.now(),
      preflight_status,
      execution_preflight_review_ready: preflight_status === "Execution preflight ready",
      execution_preflight_passed: false,
      execution_authorized: false,
      execution_allowed: false,
      source_promotion_allowed: false,
      promotion_execution_allowed: false,
      implementation_authorized: false,
      implementation_execution_allowed: false,
      founder_instruction_granted: false,
      production_ready: false,
      production_launch_allowed: false,
      public_release_allowed: false,
      controlled_storage_entry_allowed: false,
      canonical_write_allowed: false,
      storage_write_enabled: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      next_gate_required: config.boundary.next_gate_required,
      source_promotion_hold_review_id: preflight.source_promotion_hold_review_id || holdPacket.source_promotion_hold_review_id || "",
      implementation_authorization_dry_run_id: preflight.implementation_authorization_dry_run_id || holdPacket.implementation_authorization_dry_run_id || "",
      founder_instruction_gate_id: preflight.founder_instruction_gate_id || holdPacket.founder_instruction_gate_id || "",
      entry_dry_run_id: preflight.entry_dry_run_id || holdPacket.entry_dry_run_id || "",
      criteria_packet_id: preflight.criteria_packet_id || holdPacket.criteria_packet_id || "",
      replay_receipt_id: preflight.replay_receipt_id || holdPacket.replay_receipt_id || "",
      rollback_receipt_id: preflight.rollback_receipt_id || holdPacket.rollback_receipt_id || "",
      audit_receipt_id: preflight.audit_receipt_id || holdPacket.audit_receipt_id || "",
      source_answer_id: preflight.source_answer_id || holdPacket.source_answer_id || "",
      source_record_id: preflight.source_record_id || holdPacket.source_record_id || "",
      source_family: preflight.source_family || holdPacket.source_family || "",
      preflight_actor: preflight.preflight_actor || "",
      preflight_note: preflight.preflight_note || "",
      preflight_scope: preflight.preflight_scope || "",
      execution_conditions: preflight.execution_conditions || "",
      readonly_rehearsal: preflight.readonly_rehearsal || "",
      final_blockers: preflight.final_blockers || "",
      rollback_plan: preflight.rollback_plan || "",
      monitoring_plan: preflight.monitoring_plan || "",
      human_approval_check: preflight.human_approval_check || "",
      execution_boundary: preflight.execution_boundary || "",
      production_boundary: preflight.production_boundary || "",
      review_question: preflight.review_question || "",
      return_reason: preflight.return_reason || "",
      hold_reason: preflight.hold_reason || "",
      block_reason: preflight.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function preflightSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.preflight_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Execution preflight ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Execution hold"] || 0,
      execution_enabled: packets.filter((packet) => packet.execution_allowed || packet.execution_authorized || packet.storage_write_enabled || packet.source_write_executed || packet.production_ready).length
    };
  }

  function parsePreflightJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="preflight-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.preflight_status;
    resultCard.innerHTML = '<strong>' + safe(packet.preflight_status) + '</strong>' +
      '<p class="muted">Preflight ready: ' + safe(packet.execution_preflight_review_ready) + ' | Execution: ' + safe(packet.execution_allowed) + ' | Production: ' + safe(packet.production_ready) + '</p>' +
      '<div class="preflight-grid">' +
        card("Promotion hold", packet.source_promotion_hold_review_id, packet.execution_preflight_review_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Execution", packet.execution_allowed ? "enabled" : "false", packet.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for founder execution instruction gate. No execution, storage write, canonical update, or production release was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.preflight_checks.map((check) =>
      '<article class="preflight-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Promotion hold", config.source.source_promotion_hold_review_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parsePreflightJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = preflightSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="preflight-card ' + (packet.execution_preflight_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.preflight_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathPromotionExecutionPreflight = {
    promotionExecutionPreflight,
    preflightSnapshot,
    preflightMissingForState,
    parsePreflightJson
  };

  if (!root) return;

  fetch("data/vedapath-promotion-execution-preflight.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        holdPacket: root.querySelector("#preflightHoldPacket"),
        state: root.querySelector("#preflightState"),
        actor: root.querySelector("#preflightActor"),
        note: root.querySelector("#preflightNote"),
        holdId: root.querySelector("#preflightHoldId"),
        authId: root.querySelector("#preflightAuthId"),
        gateId: root.querySelector("#preflightGateId"),
        entryId: root.querySelector("#preflightEntryId"),
        criteriaId: root.querySelector("#preflightCriteriaId"),
        replayId: root.querySelector("#preflightReplayId"),
        rollbackId: root.querySelector("#preflightRollbackId"),
        auditId: root.querySelector("#preflightAuditId"),
        sourceAnswer: root.querySelector("#preflightSourceAnswer"),
        sourceRecord: root.querySelector("#preflightSourceRecord"),
        sourceFamily: root.querySelector("#preflightSourceFamily"),
        scope: root.querySelector("#preflightScopeText"),
        conditions: root.querySelector("#preflightExecutionConditions"),
        rehearsal: root.querySelector("#preflightReadonlyRehearsal"),
        blockers: root.querySelector("#preflightFinalBlockers"),
        rollback: root.querySelector("#preflightRollbackPlan"),
        monitoring: root.querySelector("#preflightMonitoringPlan"),
        human: root.querySelector("#preflightHumanApproval"),
        boundary: root.querySelector("#preflightExecutionBoundary"),
        production: root.querySelector("#preflightProductionBoundary"),
        review: root.querySelector("#preflightReviewQuestion"),
        returnReason: root.querySelector("#preflightReturnReason"),
        holdReason: root.querySelector("#preflightHoldReason"),
        block: root.querySelector("#preflightBlockReason")
      };

      config.preflight_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_preflight;
        fields.holdPacket.value = JSON.stringify(config.sample_hold_review, null, 2);
        fields.state.value = item.preflight_state;
        fields.actor.value = item.preflight_actor;
        fields.note.value = item.preflight_note;
        fields.holdId.value = item.source_promotion_hold_review_id;
        fields.authId.value = item.implementation_authorization_dry_run_id;
        fields.gateId.value = item.founder_instruction_gate_id;
        fields.entryId.value = item.entry_dry_run_id;
        fields.criteriaId.value = item.criteria_packet_id;
        fields.replayId.value = item.replay_receipt_id;
        fields.rollbackId.value = item.rollback_receipt_id;
        fields.auditId.value = item.audit_receipt_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.preflight_scope;
        fields.conditions.value = item.execution_conditions;
        fields.rehearsal.value = item.readonly_rehearsal;
        fields.blockers.value = item.final_blockers;
        fields.rollback.value = item.rollback_plan;
        fields.monitoring.value = item.monitoring_plan;
        fields.human.value = item.human_approval_check;
        fields.boundary.value = item.execution_boundary;
        fields.production.value = item.production_boundary;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildPreflight() {
        return {
          preflight_state: fields.state.value,
          preflight_actor: fields.actor.value,
          preflight_note: fields.note.value,
          source_promotion_hold_review_id: fields.holdId.value,
          implementation_authorization_dry_run_id: fields.authId.value,
          founder_instruction_gate_id: fields.gateId.value,
          entry_dry_run_id: fields.entryId.value,
          criteria_packet_id: fields.criteriaId.value,
          replay_receipt_id: fields.replayId.value,
          rollback_receipt_id: fields.rollbackId.value,
          audit_receipt_id: fields.auditId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          preflight_scope: fields.scope.value,
          execution_conditions: fields.conditions.value,
          readonly_rehearsal: fields.rehearsal.value,
          final_blockers: fields.blockers.value,
          rollback_plan: fields.rollback.value,
          monitoring_plan: fields.monitoring.value,
          human_approval_check: fields.human.value,
          execution_boundary: fields.boundary.value,
          production_boundary: fields.production.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const holdPacket = parsePreflightJson(fields.holdPacket.value, {});
        const packet = promotionExecutionPreflight(config, holdPacket, buildPreflight());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runExecutionPreflight").addEventListener("click", run);
      root.querySelector("#loadPreflightSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveExecutionPreflight").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearExecutionPreflights").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyPreflightPacket").addEventListener("click", async () => {
        if (!packetOutput.value) run();
        await navigator.clipboard.writeText(packetOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();

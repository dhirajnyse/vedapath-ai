(() => {
  const storageKey = "vedapath-source-promotion-hold-review";
  const root = document.getElementById("sourcePromotionHoldReview");
  const savedRoot = document.getElementById("promotionSaved");
  const resultCard = document.getElementById("promotionResultCard");
  const packetOutput = document.getElementById("promotionPacket");
  const checksRoot = document.getElementById("promotionChecks");
  const scopeRoot = document.getElementById("promotionScope");

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

  function authorizationDryRunReady(packet) {
    return Boolean(packet) &&
      packet.authorization_status === "Authorization dry run ready" &&
      packet.implementation_authorization_dry_run_ready === true &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Source promotion hold review";
  }

  function keepsPromotionBoundary(value) {
    const text = String(value || "");
    const required = [
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
    const unsafe = /(source_promotion_allowed true|promotion_execution_allowed true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|promote now|write enabled|production write|canonical update)/i.test(text);
    return required && !unsafe;
  }

  function promotionMissingForState(config, state, promotion = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(promotion[field] || "").trim());
  }

  function idMatches(promotion, authorizationPacket, key) {
    return !promotion[key] || !authorizationPacket[key] || promotion[key] === authorizationPacket[key];
  }

  function sourcePromotionHoldReview(config, authorizationPacket, promotion) {
    const state = promotion.promotion_state || "Draft promotion hold";
    const missing = promotionMissingForState(config, state, promotion);
    const blocked = [];
    const warnings = [];

    if (!authorizationDryRunReady(authorizationPacket)) blocked.push("implementation authorization dry-run packet must be ready while every execution and write flag remains false");
    ["implementation_authorization_dry_run_id", "founder_instruction_gate_id", "entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(promotion, authorizationPacket, key)) blocked.push(key + " must match the authorization dry-run packet");
    });

    const readyCandidate = state === "Promotion hold review ready";
    if (readyCandidate && !hasText(promotion.promotion_scope, [["named", "source-answer"], ["hold"], ["do not", "promote"], ["execution"], ["storage"], ["production"], ["canonical"]])) {
      blocked.push("promotion scope must name the source-answer packet, keep it on hold, and block execution, storage, production, and canonical updates");
    }
    if (readyCandidate && !hasText(promotion.hold_conditions, [["source text"], ["source family"], ["citation"], ["reviewer evidence"], ["rights"], ["translation"], ["rollback"], ["founder"]])) {
      blocked.push("hold conditions must include source text, source family, citation, reviewer evidence, rights, translation, rollback, and founder recheck");
    }
    if (readyCandidate && !hasText(promotion.source_integrity_check, [["source answer"], ["source record"], ["source family"], ["citation"], ["no content mutation"]])) {
      blocked.push("source integrity must include source answer, source record, source family, citation, and no content mutation");
    }
    if (readyCandidate && !hasText(promotion.rights_and_translation_check, [["rights"], ["translation"], ["reviewed"], ["missing"], ["hold"]])) {
      blocked.push("rights and translation check must keep missing review on hold");
    }
    if (readyCandidate && !hasText(promotion.reviewer_evidence_required, [["implementation authorization"], ["founder gate"], ["receipt chain"], ["rollback"], ["reviewer evidence"], ["source-owner"]])) {
      blocked.push("reviewer evidence must include implementation authorization, founder gate, receipt chain, rollback, reviewer evidence, and source-owner scope");
    }
    if (readyCandidate && !keepsPromotionBoundary(promotion.promotion_boundary)) {
      blocked.push("promotion boundary must keep promotion, execution, storage, source-write, canonical, and production flags false");
    }
    if (readyCandidate && !hasText(promotion.rollback_reference, [["rollback receipt"], ["replay receipt"], ["no new source state"], ["not written"]])) {
      blocked.push("rollback reference must keep rollback and replay receipts visible while no new source state is written");
    }
    if (readyCandidate && !hasText(promotion.founder_recheck, [["founder"], ["implementation authorization"], ["rechecked"], ["before"], ["promotion execution"]])) {
      blocked.push("founder and implementation authorization must be rechecked before promotion execution");
    }
    if (state === "Needs source promotion review" && !promotion.review_question) blocked.push("review question is required");
    if (state === "Return to authorization dry run" && !promotion.return_reason) blocked.push("return reason is required");
    if (state === "Promotion hold" && !promotion.hold_reason) blocked.push("hold reason is required");
    if (state === "Promotion blocked" && !promotion.block_reason) blocked.push("block reason is required");
    if (state === "Execution path forbidden" && !promotion.block_reason) blocked.push("block reason is required when execution path is forbidden");

    if (authorizationPacket.implementation_execution_allowed !== false) warnings.push("authorization dry run must never be interpreted as implementation execution");

    const promotion_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      source_promotion_hold_review_id: "source-promotion-hold-review-" + Date.now(),
      promotion_status,
      source_promotion_hold_review_ready: promotion_status === "Promotion hold review ready",
      source_promotion_allowed: false,
      promotion_execution_allowed: false,
      implementation_authorized: false,
      implementation_execution_allowed: false,
      founder_instruction_granted: false,
      production_ready: false,
      controlled_storage_entry_allowed: false,
      canonical_write_allowed: false,
      storage_write_enabled: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      next_gate_required: config.boundary.next_gate_required,
      implementation_authorization_dry_run_id: promotion.implementation_authorization_dry_run_id || authorizationPacket.implementation_authorization_dry_run_id || "",
      founder_instruction_gate_id: promotion.founder_instruction_gate_id || authorizationPacket.founder_instruction_gate_id || "",
      entry_dry_run_id: promotion.entry_dry_run_id || authorizationPacket.entry_dry_run_id || "",
      criteria_packet_id: promotion.criteria_packet_id || authorizationPacket.criteria_packet_id || "",
      replay_receipt_id: promotion.replay_receipt_id || authorizationPacket.replay_receipt_id || "",
      rollback_receipt_id: promotion.rollback_receipt_id || authorizationPacket.rollback_receipt_id || "",
      audit_receipt_id: promotion.audit_receipt_id || authorizationPacket.audit_receipt_id || "",
      source_answer_id: promotion.source_answer_id || authorizationPacket.source_answer_id || "",
      source_record_id: promotion.source_record_id || authorizationPacket.source_record_id || "",
      source_family: promotion.source_family || authorizationPacket.source_family || "",
      promotion_actor: promotion.promotion_actor || "",
      promotion_note: promotion.promotion_note || "",
      promotion_scope: promotion.promotion_scope || "",
      hold_conditions: promotion.hold_conditions || "",
      source_integrity_check: promotion.source_integrity_check || "",
      rights_and_translation_check: promotion.rights_and_translation_check || "",
      reviewer_evidence_required: promotion.reviewer_evidence_required || "",
      promotion_boundary: promotion.promotion_boundary || "",
      rollback_reference: promotion.rollback_reference || "",
      founder_recheck: promotion.founder_recheck || "",
      review_question: promotion.review_question || "",
      return_reason: promotion.return_reason || "",
      hold_reason: promotion.hold_reason || "",
      block_reason: promotion.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function promotionSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.promotion_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Promotion hold review ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Promotion hold"] || 0,
      promotion_enabled: packets.filter((packet) => packet.source_promotion_allowed || packet.promotion_execution_allowed || packet.storage_write_enabled || packet.source_write_executed).length
    };
  }

  function parsePromotionJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="promotion-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.promotion_status;
    resultCard.innerHTML = '<strong>' + safe(packet.promotion_status) + '</strong>' +
      '<p class="muted">Hold review ready: ' + safe(packet.source_promotion_hold_review_ready) + ' | Promotion: ' + safe(packet.source_promotion_allowed) + ' | Execution: ' + safe(packet.promotion_execution_allowed) + '</p>' +
      '<div class="promotion-grid">' +
        card("Authorization", packet.implementation_authorization_dry_run_id, packet.source_promotion_hold_review_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Promotion", packet.source_promotion_allowed ? "enabled" : "false", packet.source_promotion_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for promotion execution preflight review. No source promotion, storage write, or production execution was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.promotion_checks.map((check) =>
      '<article class="promotion-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Authorization", config.source.implementation_authorization_dry_run_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parsePromotionJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = promotionSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Promotion enabled", snapshot.promotion_enabled, snapshot.promotion_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="promotion-card ' + (packet.source_promotion_hold_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.promotion_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathSourcePromotionHoldReview = {
    sourcePromotionHoldReview,
    promotionSnapshot,
    promotionMissingForState,
    parsePromotionJson
  };

  if (!root) return;

  fetch("data/vedapath-source-promotion-hold-review.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationPacket: root.querySelector("#promotionAuthorizationPacket"),
        state: root.querySelector("#promotionState"),
        actor: root.querySelector("#promotionActor"),
        note: root.querySelector("#promotionNote"),
        authId: root.querySelector("#promotionAuthId"),
        gateId: root.querySelector("#promotionGateId"),
        entryId: root.querySelector("#promotionEntryId"),
        criteriaId: root.querySelector("#promotionCriteriaId"),
        replayId: root.querySelector("#promotionReplayId"),
        rollbackId: root.querySelector("#promotionRollbackId"),
        auditId: root.querySelector("#promotionAuditId"),
        sourceAnswer: root.querySelector("#promotionSourceAnswer"),
        sourceRecord: root.querySelector("#promotionSourceRecord"),
        sourceFamily: root.querySelector("#promotionSourceFamily"),
        scope: root.querySelector("#promotionScopeText"),
        hold: root.querySelector("#promotionHoldConditions"),
        integrity: root.querySelector("#promotionSourceIntegrity"),
        rights: root.querySelector("#promotionRightsTranslation"),
        evidence: root.querySelector("#promotionReviewerEvidence"),
        boundary: root.querySelector("#promotionBoundary"),
        rollback: root.querySelector("#promotionRollbackReference"),
        recheck: root.querySelector("#promotionFounderRecheck"),
        review: root.querySelector("#promotionReviewQuestion"),
        returnReason: root.querySelector("#promotionReturnReason"),
        holdReason: root.querySelector("#promotionHoldReason"),
        block: root.querySelector("#promotionBlockReason")
      };

      config.promotion_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_hold;
        fields.authorizationPacket.value = JSON.stringify(config.sample_authorization_dry_run, null, 2);
        fields.state.value = item.promotion_state;
        fields.actor.value = item.promotion_actor;
        fields.note.value = item.promotion_note;
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
        fields.scope.value = item.promotion_scope;
        fields.hold.value = item.hold_conditions;
        fields.integrity.value = item.source_integrity_check;
        fields.rights.value = item.rights_and_translation_check;
        fields.evidence.value = item.reviewer_evidence_required;
        fields.boundary.value = item.promotion_boundary;
        fields.rollback.value = item.rollback_reference;
        fields.recheck.value = item.founder_recheck;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildPromotion() {
        return {
          promotion_state: fields.state.value,
          promotion_actor: fields.actor.value,
          promotion_note: fields.note.value,
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
          promotion_scope: fields.scope.value,
          hold_conditions: fields.hold.value,
          source_integrity_check: fields.integrity.value,
          rights_and_translation_check: fields.rights.value,
          reviewer_evidence_required: fields.evidence.value,
          promotion_boundary: fields.boundary.value,
          rollback_reference: fields.rollback.value,
          founder_recheck: fields.recheck.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const authorizationPacket = parsePromotionJson(fields.authorizationPacket.value, {});
        const packet = sourcePromotionHoldReview(config, authorizationPacket, buildPromotion());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runPromotionHold").addEventListener("click", run);
      root.querySelector("#loadPromotionSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#savePromotionHold").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearPromotionHolds").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyPromotionPacket").addEventListener("click", async () => {
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

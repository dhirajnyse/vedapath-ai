(() => {
  const storageKey = "vedapath-implementation-authorization-dry-run";
  const root = document.getElementById("implementationAuthorizationDryRun");
  const savedRoot = document.getElementById("authSaved");
  const resultCard = document.getElementById("authResultCard");
  const packetOutput = document.getElementById("authPacket");
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

  function founderGateReady(packet) {
    return Boolean(packet) &&
      packet.instruction_status === "Founder instruction gate ready" &&
      packet.founder_instruction_gate_ready === true &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Implementation authorization dry run";
  }

  function keepsRuntimeBoundary(value) {
    const text = String(value || "");
    const required = [
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i
    ].every((pattern) => pattern.test(text));
    const unsafe = /(implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|write enabled|migration run|production write|secret use)/i.test(text);
    return required && !unsafe;
  }

  function authMissingForState(config, state, authorization = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(authorization[field] || "").trim());
  }

  function idMatches(authorization, gatePacket, key) {
    return !authorization[key] || !gatePacket[key] || authorization[key] === gatePacket[key];
  }

  function implementationAuthorizationDryRun(config, founderPacket, authorization) {
    const state = authorization.authorization_state || "Draft authorization";
    const missing = authMissingForState(config, state, authorization);
    const blocked = [];
    const warnings = [];

    if (!founderGateReady(founderPacket)) blocked.push("founder instruction gate packet must be ready while every write flag remains false");
    ["founder_instruction_gate_id", "entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(authorization, founderPacket, key)) blocked.push(key + " must match the founder gate packet");
    });

    const readyCandidate = state === "Authorization dry run ready";
    if (readyCandidate && !hasText(authorization.implementation_scope, [["future", "implementation"], ["named", "source-answer"], ["review"], ["no", "canonical"], ["no", "production"]])) {
      blocked.push("implementation scope must be future-only, named-packet, review-only, and block canonical or production changes");
    }
    if (readyCandidate && !hasText(authorization.operator_scope, [["single"], ["preview"], ["no", "credentials"], ["no", "account"], ["no", "production"]])) {
      blocked.push("operator scope must stay single-packet, preview-only, and without credentials or account creation");
    }
    if (readyCandidate && !hasText(authorization.allowed_actions, [["plan"], ["schema"], ["rollback"], ["monitoring"], ["review", "handoff"]])) {
      blocked.push("allowed actions must be planning, schema confirmation, rollback, monitoring, and review handoff only");
    }
    if (readyCandidate && !hasText(authorization.forbidden_actions, [["no", "storage"], ["no", "migration"], ["no", "account"], ["no", "canonical"], ["no", "production"], ["no", "secret"]])) {
      blocked.push("forbidden actions must block storage, migration, account, canonical, production, and secret use");
    }
    if (readyCandidate && !keepsRuntimeBoundary(authorization.runtime_boundary)) {
      blocked.push("runtime boundary must keep implementation, storage, source-write, and production flags false");
    }
    if (readyCandidate && !hasText(authorization.rollback_required, [["rollback"], ["receipt"], ["before_hash"], ["restore"]])) {
      blocked.push("rollback requirement must include receipt, before_hash, and restore path");
    }
    if (readyCandidate && !hasText(authorization.monitoring_required, [["audit"], ["failure"], ["review"], ["stop"]])) {
      blocked.push("monitoring requirement must include audit, failure review, and stop condition");
    }
    if (readyCandidate && !hasText(authorization.founder_recheck, [["founder"], ["gate"], ["recheck"], ["before", "execution"]])) {
      blocked.push("founder recheck must happen before any future execution");
    }
    if (readyCandidate && !hasText(authorization.execution_hold, [["do not", "execute"], ["storage"], ["production"], ["migration"], ["account"], ["canonical"]])) {
      blocked.push("execution hold must forbid storage, production, migration, account, and canonical changes");
    }
    if (state === "Needs implementation review" && !authorization.review_question) blocked.push("review question is required");
    if (state === "Return to founder gate" && !authorization.return_reason) blocked.push("return reason is required");
    if (state === "Implementation hold" && !authorization.hold_reason) blocked.push("hold reason is required");
    if (state === "Implementation blocked" && !authorization.block_reason) blocked.push("block reason is required");
    if (state === "Execution forbidden" && !authorization.block_reason) blocked.push("block reason is required when execution is forbidden");

    if (founderPacket.founder_instruction_granted !== false) warnings.push("founder packet must never be interpreted as execution grant");

    const authorization_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      implementation_authorization_dry_run_id: "implementation-authorization-dry-run-" + Date.now(),
      authorization_status,
      implementation_authorization_dry_run_ready: authorization_status === "Authorization dry run ready",
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
      founder_instruction_gate_id: authorization.founder_instruction_gate_id || founderPacket.founder_instruction_gate_id || "",
      entry_dry_run_id: authorization.entry_dry_run_id || founderPacket.entry_dry_run_id || "",
      criteria_packet_id: authorization.criteria_packet_id || founderPacket.criteria_packet_id || "",
      replay_receipt_id: authorization.replay_receipt_id || founderPacket.replay_receipt_id || "",
      rollback_receipt_id: authorization.rollback_receipt_id || founderPacket.rollback_receipt_id || "",
      audit_receipt_id: authorization.audit_receipt_id || founderPacket.audit_receipt_id || "",
      source_answer_id: authorization.source_answer_id || founderPacket.source_answer_id || "",
      source_record_id: authorization.source_record_id || founderPacket.source_record_id || "",
      source_family: authorization.source_family || founderPacket.source_family || "",
      authorization_actor: authorization.authorization_actor || "",
      authorization_note: authorization.authorization_note || "",
      implementation_scope: authorization.implementation_scope || "",
      operator_scope: authorization.operator_scope || "",
      allowed_actions: authorization.allowed_actions || "",
      forbidden_actions: authorization.forbidden_actions || "",
      runtime_boundary: authorization.runtime_boundary || "",
      rollback_required: authorization.rollback_required || "",
      monitoring_required: authorization.monitoring_required || "",
      founder_recheck: authorization.founder_recheck || "",
      execution_hold: authorization.execution_hold || "",
      review_question: authorization.review_question || "",
      return_reason: authorization.return_reason || "",
      hold_reason: authorization.hold_reason || "",
      block_reason: authorization.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function authSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.authorization_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Authorization dry run ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Implementation hold"] || 0,
      execution_enabled: packets.filter((packet) => packet.implementation_execution_allowed || packet.storage_write_enabled || packet.source_write_executed).length
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

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.authorization_status;
    resultCard.innerHTML = '<strong>' + safe(packet.authorization_status) + '</strong>' +
      '<p class="muted">Dry run ready: ' + safe(packet.implementation_authorization_dry_run_ready) + ' | Authorized: ' + safe(packet.implementation_authorized) + ' | Execution: ' + safe(packet.implementation_execution_allowed) + '</p>' +
      '<div class="auth-grid">' +
        card("Founder gate", packet.founder_instruction_gate_id, packet.implementation_authorization_dry_run_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Writes", packet.source_write_executed ? "enabled" : "false", packet.source_write_executed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for source promotion hold review. No implementation execution was authorized.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.authorization_checks.map((check) =>
      '<article class="auth-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Storage target", config.source.entry_storage_target],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parseAuthJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = authSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="auth-card ' + (packet.implementation_authorization_dry_run_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.authorization_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathImplementationAuthorizationDryRun = {
    implementationAuthorizationDryRun,
    authSnapshot,
    authMissingForState,
    parseAuthJson
  };

  if (!root) return;

  fetch("data/vedapath-implementation-authorization-dry-run.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        founderPacket: root.querySelector("#authFounderPacket"),
        state: root.querySelector("#authState"),
        actor: root.querySelector("#authActor"),
        note: root.querySelector("#authNote"),
        gateId: root.querySelector("#authGateId"),
        entryId: root.querySelector("#authEntryId"),
        criteriaId: root.querySelector("#authCriteriaId"),
        replayId: root.querySelector("#authReplayId"),
        rollbackId: root.querySelector("#authRollbackId"),
        auditId: root.querySelector("#authAuditId"),
        sourceAnswer: root.querySelector("#authSourceAnswer"),
        sourceRecord: root.querySelector("#authSourceRecord"),
        sourceFamily: root.querySelector("#authSourceFamily"),
        scope: root.querySelector("#authImplementationScope"),
        operator: root.querySelector("#authOperatorScope"),
        allowed: root.querySelector("#authAllowedActions"),
        forbidden: root.querySelector("#authForbiddenActions"),
        runtime: root.querySelector("#authRuntimeBoundary"),
        rollback: root.querySelector("#authRollbackRequired"),
        monitoring: root.querySelector("#authMonitoringRequired"),
        recheck: root.querySelector("#authFounderRecheck"),
        hold: root.querySelector("#authExecutionHold"),
        review: root.querySelector("#authReviewQuestion"),
        returnReason: root.querySelector("#authReturnReason"),
        holdReason: root.querySelector("#authHoldReason"),
        block: root.querySelector("#authBlockReason")
      };

      config.authorization_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_authorization;
        fields.founderPacket.value = JSON.stringify(config.sample_founder_gate, null, 2);
        fields.state.value = item.authorization_state;
        fields.actor.value = item.authorization_actor;
        fields.note.value = item.authorization_note;
        fields.gateId.value = item.founder_instruction_gate_id;
        fields.entryId.value = item.entry_dry_run_id;
        fields.criteriaId.value = item.criteria_packet_id;
        fields.replayId.value = item.replay_receipt_id;
        fields.rollbackId.value = item.rollback_receipt_id;
        fields.auditId.value = item.audit_receipt_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.implementation_scope;
        fields.operator.value = item.operator_scope;
        fields.allowed.value = item.allowed_actions;
        fields.forbidden.value = item.forbidden_actions;
        fields.runtime.value = item.runtime_boundary;
        fields.rollback.value = item.rollback_required;
        fields.monitoring.value = item.monitoring_required;
        fields.recheck.value = item.founder_recheck;
        fields.hold.value = item.execution_hold;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildAuthorization() {
        return {
          authorization_state: fields.state.value,
          authorization_actor: fields.actor.value,
          authorization_note: fields.note.value,
          founder_instruction_gate_id: fields.gateId.value,
          entry_dry_run_id: fields.entryId.value,
          criteria_packet_id: fields.criteriaId.value,
          replay_receipt_id: fields.replayId.value,
          rollback_receipt_id: fields.rollbackId.value,
          audit_receipt_id: fields.auditId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          implementation_scope: fields.scope.value,
          operator_scope: fields.operator.value,
          allowed_actions: fields.allowed.value,
          forbidden_actions: fields.forbidden.value,
          runtime_boundary: fields.runtime.value,
          rollback_required: fields.rollback.value,
          monitoring_required: fields.monitoring.value,
          founder_recheck: fields.recheck.value,
          execution_hold: fields.hold.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const founderPacket = parseAuthJson(fields.founderPacket.value, {});
        const packet = implementationAuthorizationDryRun(config, founderPacket, buildAuthorization());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runAuthDryRun").addEventListener("click", run);
      root.querySelector("#loadAuthSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthDryRun").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthDryRuns").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthPacket").addEventListener("click", async () => {
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

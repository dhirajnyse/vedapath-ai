(() => {
  const storageKey = "vedapath-founder-storage-instruction-gate";
  const root = document.getElementById("founderStorageInstructionGate");
  const savedRoot = document.getElementById("founderSaved");
  const resultCard = document.getElementById("founderResultCard");
  const packetOutput = document.getElementById("founderPacket");
  const checksRoot = document.getElementById("founderChecks");
  const scopeRoot = document.getElementById("founderScope");

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

  function entryDryRunReady(packet) {
    return Boolean(packet) &&
      packet.entry_status === "Entry dry run passed" &&
      packet.entry_dry_run_passed === true &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.founder_instruction_required === true &&
      packet.founder_instruction_granted === false;
  }

  function keepsFounderBoundary(value) {
    const text = String(value || "");
    const safeBoundary = /controlled_storage_entry_allowed remains false/i.test(text) &&
      /storage_write_enabled remains false/i.test(text) &&
      /canonical_write_allowed remains false/i.test(text) &&
      /source_write_executed remains false/i.test(text) &&
      /actual_storage_write_executed remains false/i.test(text) &&
      /production_ready remains false/i.test(text);
    const unsafe = /(founder_instruction_granted true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|write enabled|production write|real storage granted)/i.test(text);
    return safeBoundary && !unsafe;
  }

  function founderMissingForState(config, state, instruction = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(instruction[field] || "").trim());
  }

  function idMatches(instruction, entryPacket, key) {
    return !instruction[key] || !entryPacket[key] || instruction[key] === entryPacket[key];
  }

  function founderInstructionGate(config, entryPacket, instruction) {
    const state = instruction.instruction_state || "Draft founder instruction";
    const missing = founderMissingForState(config, state, instruction);
    const blocked = [];
    const warnings = [];

    if (!entryDryRunReady(entryPacket)) blocked.push("entry dry run must pass while every write flag remains false");
    ["entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(instruction, entryPacket, key)) blocked.push(key + " must match the entry dry-run packet");
    });

    const readyCandidate = state === "Founder instruction gate ready";
    if (readyCandidate && !hasText(instruction.instruction_scope, [["founder"], ["named", "source-answer"], ["controlled storage"], ["review"], ["not", "broad", "production"]])) {
      blocked.push("instruction scope must be founder-only, named-packet, controlled-storage review, and not broad production");
    }
    if (readyCandidate && !hasText(instruction.allowed_action, [["future", "prepare"], ["review"], ["do not", "execute", "writes"]])) {
      blocked.push("allowed action must be future preparation for review without executing writes");
    }
    if (readyCandidate && !hasText(instruction.forbidden_actions, [["no", "canonical"], ["no", "account"], ["no", "migration"], ["no", "rights"], ["no", "production"]])) {
      blocked.push("forbidden actions must block canonical, account, migration, rights, and production moves");
    }
    if (readyCandidate && !hasText(instruction.required_phrase, [["authorize"], ["prepare"], ["controlled storage entry review"], ["do not execute production writes yet"]])) {
      blocked.push("required phrase must authorize preparation only and forbid production writes");
    }
    if (readyCandidate && !hasText(instruction.evidence_required, [["entry dry run"], ["criteria packet"], ["receipt chain"], ["rollback"], ["source-owner"]])) {
      blocked.push("evidence must include dry run, criteria, receipt chain, rollback, and source-owner scope");
    }
    if (readyCandidate && !hasText(instruction.revocation_rule, [["revoke"], ["before", "execution"], ["return", "entry dry run"]])) {
      blocked.push("revocation rule must allow return to entry dry run before execution");
    }
    if (readyCandidate && !keepsFounderBoundary(instruction.execution_boundary)) {
      blocked.push("execution boundary must keep every storage, source-write, and production flag false");
    }
    if (state === "Needs founder review" && !instruction.review_question) blocked.push("review question is required for founder review");
    if (state === "Return to entry dry run" && !instruction.return_reason) blocked.push("return reason is required");
    if (state === "Founder hold" && !instruction.hold_reason) blocked.push("hold reason is required");
    if (state === "Founder instruction blocked" && !instruction.block_reason) blocked.push("block reason is required");

    if (entryPacket.next_gate_required !== "Founder storage instruction gate") {
      warnings.push("entry dry run did not name this as the next gate");
    }

    const instruction_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_instruction_gate_id: "founder-storage-instruction-gate-" + Date.now(),
      instruction_status,
      founder_instruction_gate_ready: instruction_status === "Founder instruction gate ready",
      founder_instruction_granted: false,
      production_ready: false,
      controlled_storage_entry_allowed: false,
      canonical_write_allowed: false,
      storage_write_enabled: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      next_gate_required: config.boundary.next_gate_required,
      entry_dry_run_id: instruction.entry_dry_run_id || entryPacket.entry_dry_run_id || "",
      criteria_packet_id: instruction.criteria_packet_id || entryPacket.criteria_packet_id || "",
      replay_receipt_id: instruction.replay_receipt_id || entryPacket.replay_receipt_id || "",
      rollback_receipt_id: instruction.rollback_receipt_id || entryPacket.rollback_receipt_id || "",
      audit_receipt_id: instruction.audit_receipt_id || entryPacket.audit_receipt_id || "",
      source_answer_id: instruction.source_answer_id || entryPacket.source_answer_id || "",
      source_record_id: instruction.source_record_id || entryPacket.source_record_id || "",
      source_family: instruction.source_family || entryPacket.source_family || "",
      instruction_actor: instruction.instruction_actor || "",
      instruction_note: instruction.instruction_note || "",
      instruction_scope: instruction.instruction_scope || "",
      allowed_action: instruction.allowed_action || "",
      forbidden_actions: instruction.forbidden_actions || "",
      required_phrase: instruction.required_phrase || "",
      evidence_required: instruction.evidence_required || "",
      execution_boundary: instruction.execution_boundary || "",
      revocation_rule: instruction.revocation_rule || "",
      review_question: instruction.review_question || "",
      return_reason: instruction.return_reason || "",
      hold_reason: instruction.hold_reason || "",
      block_reason: instruction.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function founderInstructionSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.instruction_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Founder instruction gate ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Founder hold"] || 0,
      writes_enabled: packets.filter((packet) => packet.storage_write_enabled || packet.source_write_executed || packet.controlled_storage_entry_allowed).length
    };
  }

  function parseFounderJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.instruction_status;
    resultCard.innerHTML = '<strong>' + safe(packet.instruction_status) + '</strong>' +
      '<p class="muted">Gate ready: ' + safe(packet.founder_instruction_gate_ready) + ' | Founder granted: ' + safe(packet.founder_instruction_granted) + ' | Storage writes: ' + safe(packet.storage_write_enabled) + '</p>' +
      '<div class="founder-grid">' +
        card("Entry dry run", packet.entry_dry_run_id, packet.founder_instruction_gate_ready ? "ready" : "") +
        card("Required phrase", packet.required_phrase ? "present" : "missing", packet.required_phrase ? "ready" : "blocked") +
        card("Next gate", packet.next_gate_required) +
        card("Writes", packet.source_write_executed ? "enabled" : "false", packet.source_write_executed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for implementation authorization dry run. No write permission was granted.</p>');
  }

  function card(label, value, className = "") {
    return '<article class="founder-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.instruction_checks.map((check) =>
      '<article class="founder-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Required phrase", config.sample_instruction.required_phrase],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parseFounderJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = founderInstructionSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Writes enabled", snapshot.writes_enabled, snapshot.writes_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="founder-card ' + (packet.founder_instruction_gate_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.instruction_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderStorageInstructionGate = {
    founderInstructionGate,
    founderInstructionSnapshot,
    founderMissingForState,
    parseFounderJson
  };

  if (!root) return;

  fetch("data/vedapath-founder-storage-instruction-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        entryPacket: root.querySelector("#founderEntryPacket"),
        state: root.querySelector("#founderState"),
        actor: root.querySelector("#founderActor"),
        note: root.querySelector("#founderNote"),
        entryId: root.querySelector("#founderEntryId"),
        criteriaId: root.querySelector("#founderCriteriaId"),
        replayId: root.querySelector("#founderReplayId"),
        rollbackId: root.querySelector("#founderRollbackId"),
        auditId: root.querySelector("#founderAuditId"),
        sourceAnswer: root.querySelector("#founderSourceAnswer"),
        sourceRecord: root.querySelector("#founderSourceRecord"),
        sourceFamily: root.querySelector("#founderSourceFamily"),
        scope: root.querySelector("#founderScopeText"),
        allowed: root.querySelector("#founderAllowedAction"),
        forbidden: root.querySelector("#founderForbiddenActions"),
        phrase: root.querySelector("#founderRequiredPhrase"),
        evidence: root.querySelector("#founderEvidenceRequired"),
        boundary: root.querySelector("#founderExecutionBoundary"),
        revocation: root.querySelector("#founderRevocationRule"),
        review: root.querySelector("#founderReviewQuestion"),
        returnReason: root.querySelector("#founderReturnReason"),
        hold: root.querySelector("#founderHoldReason"),
        block: root.querySelector("#founderBlockReason")
      };

      config.instruction_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_instruction;
        fields.entryPacket.value = JSON.stringify(config.sample_entry_dry_run, null, 2);
        fields.state.value = item.instruction_state;
        fields.actor.value = item.instruction_actor;
        fields.note.value = item.instruction_note;
        fields.entryId.value = item.entry_dry_run_id;
        fields.criteriaId.value = item.criteria_packet_id;
        fields.replayId.value = item.replay_receipt_id;
        fields.rollbackId.value = item.rollback_receipt_id;
        fields.auditId.value = item.audit_receipt_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.instruction_scope;
        fields.allowed.value = item.allowed_action;
        fields.forbidden.value = item.forbidden_actions;
        fields.phrase.value = item.required_phrase;
        fields.evidence.value = item.evidence_required;
        fields.boundary.value = item.execution_boundary;
        fields.revocation.value = item.revocation_rule;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.hold.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildInstruction() {
        return {
          instruction_state: fields.state.value,
          instruction_actor: fields.actor.value,
          instruction_note: fields.note.value,
          entry_dry_run_id: fields.entryId.value,
          criteria_packet_id: fields.criteriaId.value,
          replay_receipt_id: fields.replayId.value,
          rollback_receipt_id: fields.rollbackId.value,
          audit_receipt_id: fields.auditId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          instruction_scope: fields.scope.value,
          allowed_action: fields.allowed.value,
          forbidden_actions: fields.forbidden.value,
          required_phrase: fields.phrase.value,
          evidence_required: fields.evidence.value,
          execution_boundary: fields.boundary.value,
          revocation_rule: fields.revocation.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.hold.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const entryPacket = parseFounderJson(fields.entryPacket.value, {});
        const packet = founderInstructionGate(config, entryPacket, buildInstruction());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runFounderGate").addEventListener("click", run);
      root.querySelector("#loadFounderSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveFounderGate").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearFounderGates").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyFounderPacket").addEventListener("click", async () => {
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

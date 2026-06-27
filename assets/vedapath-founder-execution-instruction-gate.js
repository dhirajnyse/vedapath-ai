(() => {
  const storageKey = "vedapath-founder-execution-instruction-gate";
  const root = document.getElementById("founderExecutionInstructionGate");
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

  function preflightReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "promotion-execution-preflight-v1" &&
      packet.preflight_status === "Execution preflight ready" &&
      packet.execution_preflight_review_ready === true &&
      packet.execution_preflight_passed === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.production_launch_allowed === false &&
      packet.public_release_allowed === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Founder execution instruction gate";
  }

  function keepsFounderBoundary(value) {
    const text = String(value || "");
    const required = [
      /founder_instruction_granted remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
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
    const unsafe = /(founder_instruction_granted true|execution_authorized true|execution_allowed true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["opened"]]);
  }

  function founderMissingForState(config, state, instruction = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(instruction[field] || "").trim());
  }

  function idMatches(instruction, packet, key) {
    return !instruction[key] || !packet[key] || instruction[key] === packet[key];
  }

  function founderExecutionInstructionGate(config, preflightPacket, instruction) {
    const state = instruction.instruction_state || "Draft founder instruction";
    const missing = founderMissingForState(config, state, instruction);
    const blocked = [];

    if (!preflightReady(preflightPacket)) blocked.push("promotion execution preflight packet must be ready while execution, storage, canonical, and production flags remain false");
    ["promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(instruction, preflightPacket, key)) blocked.push(key + " must match the execution preflight packet");
    });

    const readyCandidate = state === "Founder instruction ready";
    if (readyCandidate && !hasText(instruction.founder_instruction_text, [["prepare"], ["controlled execution packet"], ["source answer"], ["do not", "execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["production"]])) {
      blocked.push("founder instruction must permit only a controlled execution packet draft and explicitly forbid execution, promotion, storage, canonical writes, migration, account creation, secrets, and production");
    }
    if (readyCandidate && !hasText(instruction.source_specific_scope, [["source_answer_id"], ["source_record_id"], ["source family"], ["no scope creep"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"]])) {
      blocked.push("scope must name source answer, source record, source family, no scope creep, rights, translation, reviewer evidence, and source-owner scope");
    }
    if (readyCandidate && !hasText(instruction.allowed_next_step, [["draft"], ["controlled execution packet"], ["no write"], ["no source promotion"], ["no storage"], ["no canonical"], ["no production"]])) {
      blocked.push("allowed next step must be draft-only and forbid write, promotion, storage, canonical, and production");
    }
    if (readyCandidate && !hasText(instruction.prohibited_actions, [["do not"], ["execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["durable storage"], ["public release"], ["production"]])) {
      blocked.push("prohibited actions must block execution, promotion, storage, canonical writes, migration, account, secrets, durable storage, public release, and production");
    }
    if (readyCandidate && !hasText(instruction.reviewer_requirement, [["named human reviewer"], ["source-owner"], ["rights"], ["translation"], ["citation"], ["reviewer evidence"], ["source-specific human approval"], ["separate"], ["founder review"]])) {
      blocked.push("reviewer requirement must keep named human review separate from founder review");
    }
    if (readyCandidate && !hasText(instruction.rollback_acceptance, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["before any future write"]])) {
      blocked.push("rollback acceptance must include rollback, replay, before_hash, failure review, stop condition, and before-write boundary");
    }
    if (readyCandidate && !hasText(instruction.monitoring_acceptance, [["audit receipt"], ["stop condition"], ["reviewer handoff"], ["post-execution verification"], ["failure review"], ["before any write"]])) {
      blocked.push("monitoring acceptance must include audit, stop condition, reviewer handoff, post-execution verification, failure review, and before-write boundary");
    }
    if (readyCandidate && !hasText(instruction.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that the instruction expires and is not permanent approval");
    }
    if (readyCandidate && !keepsFounderBoundary(instruction.boundary_statement)) {
      blocked.push("boundary statement must keep founder grant, execution, promotion, storage, canonical, source-write, production, launch, and public release flags false");
    }
    if (readyCandidate && !keepsProductionBoundary(instruction.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, and durable storage paths closed");
    }
    if (state === "Needs founder clarification" && !instruction.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to preflight" && !instruction.return_reason) blocked.push("return reason is required");
    if (state === "Founder hold" && !instruction.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !instruction.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !instruction.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Instruction expired" && !instruction.hold_reason) blocked.push("hold reason is required when instruction expires");

    const founder_instruction_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_execution_instruction_gate_id: "founder-execution-instruction-gate-" + Date.now(),
      founder_instruction_status,
      founder_instruction_review_ready: founder_instruction_status === "Founder instruction ready",
      founder_execution_instruction_packet_ready: founder_instruction_status === "Founder instruction ready",
      founder_instruction_granted: false,
      execution_authorized: false,
      execution_allowed: false,
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
      promotion_execution_preflight_id: instruction.promotion_execution_preflight_id || preflightPacket.promotion_execution_preflight_id || "",
      source_answer_id: instruction.source_answer_id || preflightPacket.source_answer_id || "",
      source_record_id: instruction.source_record_id || preflightPacket.source_record_id || "",
      source_family: instruction.source_family || preflightPacket.source_family || "",
      instruction_actor: instruction.instruction_actor || "",
      founder_name: instruction.founder_name || "",
      founder_instruction_text: instruction.founder_instruction_text || "",
      source_specific_scope: instruction.source_specific_scope || "",
      allowed_next_step: instruction.allowed_next_step || "",
      prohibited_actions: instruction.prohibited_actions || "",
      reviewer_requirement: instruction.reviewer_requirement || "",
      rollback_acceptance: instruction.rollback_acceptance || "",
      monitoring_acceptance: instruction.monitoring_acceptance || "",
      expiry_check: instruction.expiry_check || "",
      boundary_statement: instruction.boundary_statement || "",
      production_boundary: instruction.production_boundary || "",
      clarification_question: instruction.clarification_question || "",
      return_reason: instruction.return_reason || "",
      hold_reason: instruction.hold_reason || "",
      block_reason: instruction.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function founderSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.founder_instruction_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Founder instruction ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Founder hold"] || 0,
      expired: byStatus["Instruction expired"] || 0,
      execution_enabled: packets.filter((packet) => packet.execution_allowed || packet.execution_authorized || packet.storage_write_enabled || packet.source_write_executed || packet.production_ready).length
    };
  }

  function parseFounderJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="founder-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.founder_instruction_status;
    resultCard.innerHTML = '<strong>' + safe(packet.founder_instruction_status) + '</strong>' +
      '<p class="muted">Instruction review ready: ' + safe(packet.founder_instruction_review_ready) + ' | Execution: ' + safe(packet.execution_allowed) + ' | Production: ' + safe(packet.production_ready) + '</p>' +
      '<div class="founder-grid">' +
        card("Preflight", packet.promotion_execution_preflight_id, packet.founder_instruction_review_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Execution", packet.execution_allowed ? "enabled" : "false", packet.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready to draft a controlled execution packet. No founder grant, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
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
      ["Preflight", config.source.promotion_execution_preflight_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
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
    const snapshot = founderSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="founder-card ' + (packet.founder_instruction_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.founder_instruction_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderExecutionInstructionGate = {
    founderExecutionInstructionGate,
    founderSnapshot,
    founderMissingForState,
    parseFounderJson
  };

  if (!root) return;

  fetch("data/vedapath-founder-execution-instruction-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        preflightPacket: root.querySelector("#founderPreflightPacket"),
        state: root.querySelector("#founderState"),
        actor: root.querySelector("#founderActor"),
        founder: root.querySelector("#founderName"),
        instruction: root.querySelector("#founderInstructionText"),
        preflightId: root.querySelector("#founderPreflightId"),
        sourceAnswer: root.querySelector("#founderSourceAnswer"),
        sourceRecord: root.querySelector("#founderSourceRecord"),
        sourceFamily: root.querySelector("#founderSourceFamily"),
        scope: root.querySelector("#founderScopeText"),
        allowed: root.querySelector("#founderAllowedNextStep"),
        prohibited: root.querySelector("#founderProhibitedActions"),
        reviewer: root.querySelector("#founderReviewerRequirement"),
        rollback: root.querySelector("#founderRollbackAcceptance"),
        monitoring: root.querySelector("#founderMonitoringAcceptance"),
        expiry: root.querySelector("#founderExpiryCheck"),
        boundary: root.querySelector("#founderBoundaryStatement"),
        production: root.querySelector("#founderProductionBoundary"),
        clarification: root.querySelector("#founderClarificationQuestion"),
        returnReason: root.querySelector("#founderReturnReason"),
        holdReason: root.querySelector("#founderHoldReason"),
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
        fields.preflightPacket.value = JSON.stringify(config.sample_preflight_packet, null, 2);
        fields.state.value = item.instruction_state;
        fields.actor.value = item.instruction_actor;
        fields.founder.value = item.founder_name;
        fields.instruction.value = item.founder_instruction_text;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.source_specific_scope;
        fields.allowed.value = item.allowed_next_step;
        fields.prohibited.value = item.prohibited_actions;
        fields.reviewer.value = item.reviewer_requirement;
        fields.rollback.value = item.rollback_acceptance;
        fields.monitoring.value = item.monitoring_acceptance;
        fields.expiry.value = item.expiry_check;
        fields.boundary.value = item.boundary_statement;
        fields.production.value = item.production_boundary;
        fields.clarification.value = item.clarification_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildInstruction() {
        return {
          instruction_state: fields.state.value,
          instruction_actor: fields.actor.value,
          founder_name: fields.founder.value,
          founder_instruction_text: fields.instruction.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          source_specific_scope: fields.scope.value,
          allowed_next_step: fields.allowed.value,
          prohibited_actions: fields.prohibited.value,
          reviewer_requirement: fields.reviewer.value,
          rollback_acceptance: fields.rollback.value,
          monitoring_acceptance: fields.monitoring.value,
          expiry_check: fields.expiry.value,
          boundary_statement: fields.boundary.value,
          production_boundary: fields.production.value,
          clarification_question: fields.clarification.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const preflightPacket = parseFounderJson(fields.preflightPacket.value, {});
        const packet = founderExecutionInstructionGate(config, preflightPacket, buildInstruction());
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

(() => {
  const storageKey = "vedapath-controlled-execution-packet-draft";
  const root = document.getElementById("controlledExecutionPacketDraft");
  const savedRoot = document.getElementById("packetSaved");
  const resultCard = document.getElementById("packetResultCard");
  const packetOutput = document.getElementById("packetOutput");
  const checksRoot = document.getElementById("packetChecks");
  const scopeRoot = document.getElementById("packetScope");

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

  function founderInstructionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "founder-execution-instruction-gate-v1" &&
      packet.founder_instruction_status === "Founder instruction ready" &&
      packet.founder_instruction_review_ready === true &&
      packet.founder_execution_instruction_packet_ready === true &&
      packet.founder_instruction_granted === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
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
      packet.next_gate_required === "Controlled execution packet draft";
  }

  function keepsDraftBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_execution_packet_draft_ready may be true/i,
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
    const unsafe = /(execution_packet_authorized true|execution_authorized true|execution_allowed true|founder_instruction_granted true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function packetMissingForState(config, state, packet = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(packet[field] || "").trim());
  }

  function idMatches(packetDraft, founderPacket, key) {
    return !packetDraft[key] || !founderPacket[key] || packetDraft[key] === founderPacket[key];
  }

  function controlledExecutionPacketDraft(config, founderPacket, packetDraft) {
    const state = packetDraft.packet_state || "Draft controlled execution packet";
    const missing = packetMissingForState(config, state, packetDraft);
    const blocked = [];

    if (!founderInstructionReady(founderPacket)) blocked.push("founder instruction packet must be ready while founder grant, execution, storage, canonical, public release, and production flags remain false");
    ["founder_execution_instruction_gate_id", "promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(packetDraft, founderPacket, key)) blocked.push(key + " must match the founder instruction packet");
    });

    const readyCandidate = state === "Controlled packet draft ready";
    if (readyCandidate && !hasText(packetDraft.source_context, [["source_answer_id"], ["source_record_id"], ["source family"], ["rights"], ["translation"], ["citation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"]])) {
      blocked.push("source context must keep source ids, source family, rights, translation, citation, reviewer evidence, source-owner scope, and founder instruction visible");
    }
    if (readyCandidate && !hasText(packetDraft.execution_intent, [["future controlled execution"], ["reviewer inspection"], ["do not", "execute"], ["authorize"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["public release"], ["production"]])) {
      blocked.push("execution intent must be future-only, reviewer-inspected, and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(packetDraft.readonly_execution_plan, [["readonly plan"], ["assemble packet fields"], ["compare source ids"], ["reviewer gates"], ["rollback"], ["monitoring"], ["without touching"], ["storage"], ["canonical"], ["accounts"], ["secrets"], ["migrations"], ["public release"], ["production"]])) {
      blocked.push("readonly plan must assemble fields, compare source ids, check gates, and avoid all execution surfaces");
    }
    if (readyCandidate && !hasText(packetDraft.preconditions, [["founder instruction ready"], ["promotion execution preflight ready"], ["source answer id match"], ["source record id match"], ["source family match"], ["rights"], ["translation"], ["source-owner"], ["reviewer evidence"], ["rollback"], ["monitoring"]])) {
      blocked.push("preconditions must include founder, preflight, source ids, rights, translation, owner scope, reviewer evidence, rollback, and monitoring");
    }
    if (readyCandidate && !hasText(packetDraft.reviewer_gates, [["named human reviewer"], ["source-owner"], ["rights"], ["translation"], ["citation"], ["reviewer evidence"], ["source-specific human approval"], ["founder instruction"], ["rollback"], ["monitoring"]])) {
      blocked.push("reviewer gates must require named human review, source-owner scope, rights, translation, citation, evidence, founder scope, rollback, and monitoring");
    }
    if (readyCandidate && !hasText(packetDraft.rollback_plan, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["no source state"]])) {
      blocked.push("rollback plan must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, and no source state write");
    }
    if (readyCandidate && !hasText(packetDraft.monitoring_plan, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"]])) {
      blocked.push("monitoring plan must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check");
    }
    if (readyCandidate && !hasText(packetDraft.stop_condition, [["stop"], ["source ids mismatch"], ["source text changes"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder instruction expires"], ["rollback"], ["monitoring"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on mismatches, source or rights changes, missing evidence, expiry, missing rollback/monitoring, or any true write flag");
    }
    if (readyCandidate && !keepsDraftBoundary(packetDraft.no_write_boundary)) {
      blocked.push("no-write boundary must keep authorization, execution, founder grant, promotion, storage, canonical, source-write, production, launch, and public release flags false");
    }
    if (readyCandidate && !keepsProductionBoundary(packetDraft.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (readyCandidate && !hasText(packetDraft.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder instruction"], ["rollback"], ["monitoring"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that the draft expires and is not permanent approval");
    }
    if (state === "Needs packet review" && !packetDraft.review_question) blocked.push("review question is required");
    if (state === "Return to founder gate" && !packetDraft.return_reason) blocked.push("return reason is required");
    if (state === "Execution hold" && !packetDraft.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !packetDraft.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !packetDraft.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Draft expired" && !packetDraft.hold_reason) blocked.push("hold reason is required when draft expires");

    const packet_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_execution_packet_draft_id: "controlled-execution-packet-draft-" + Date.now(),
      packet_status,
      controlled_execution_packet_draft_ready: packet_status === "Controlled packet draft ready",
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
      founder_execution_instruction_gate_id: packetDraft.founder_execution_instruction_gate_id || founderPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: packetDraft.promotion_execution_preflight_id || founderPacket.promotion_execution_preflight_id || "",
      source_answer_id: packetDraft.source_answer_id || founderPacket.source_answer_id || "",
      source_record_id: packetDraft.source_record_id || founderPacket.source_record_id || "",
      source_family: packetDraft.source_family || founderPacket.source_family || "",
      packet_actor: packetDraft.packet_actor || "",
      source_context: packetDraft.source_context || "",
      execution_intent: packetDraft.execution_intent || "",
      readonly_execution_plan: packetDraft.readonly_execution_plan || "",
      preconditions: packetDraft.preconditions || "",
      reviewer_gates: packetDraft.reviewer_gates || "",
      rollback_plan: packetDraft.rollback_plan || "",
      monitoring_plan: packetDraft.monitoring_plan || "",
      stop_condition: packetDraft.stop_condition || "",
      no_write_boundary: packetDraft.no_write_boundary || "",
      production_boundary: packetDraft.production_boundary || "",
      expiry_check: packetDraft.expiry_check || "",
      review_question: packetDraft.review_question || "",
      return_reason: packetDraft.return_reason || "",
      hold_reason: packetDraft.hold_reason || "",
      block_reason: packetDraft.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function packetSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.packet_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Controlled packet draft ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Execution hold"] || 0,
      expired: byStatus["Draft expired"] || 0,
      execution_enabled: packets.filter((packet) => packet.execution_allowed || packet.execution_authorized || packet.execution_packet_authorized || packet.storage_write_enabled || packet.source_write_executed || packet.production_ready).length
    };
  }

  function parsePacketJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="packet-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.packet_status;
    resultCard.innerHTML = '<strong>' + safe(packet.packet_status) + '</strong>' +
      '<p class="muted">Draft ready: ' + safe(packet.controlled_execution_packet_draft_ready) + ' | Authorized: ' + safe(packet.execution_packet_authorized) + ' | Production: ' + safe(packet.production_ready) + '</p>' +
      '<div class="packet-grid">' +
        card("Founder gate", packet.founder_execution_instruction_gate_id, packet.controlled_execution_packet_draft_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Execution", packet.execution_allowed ? "enabled" : "false", packet.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled execution review. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.packet_checks.map((check) =>
      '<article class="packet-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Founder gate", config.source.founder_execution_instruction_gate_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parsePacketJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = packetSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="packet-card ' + (packet.controlled_execution_packet_draft_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.packet_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledExecutionPacketDraft = {
    controlledExecutionPacketDraft,
    packetSnapshot,
    packetMissingForState,
    parsePacketJson
  };

  if (!root) return;

  fetch("data/vedapath-controlled-execution-packet-draft.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        founderPacket: root.querySelector("#packetFounderPacket"),
        state: root.querySelector("#packetState"),
        actor: root.querySelector("#packetActor"),
        founderGateId: root.querySelector("#packetFounderGateId"),
        preflightId: root.querySelector("#packetPreflightId"),
        sourceAnswer: root.querySelector("#packetSourceAnswer"),
        sourceRecord: root.querySelector("#packetSourceRecord"),
        sourceFamily: root.querySelector("#packetSourceFamily"),
        context: root.querySelector("#packetSourceContext"),
        intent: root.querySelector("#packetExecutionIntent"),
        plan: root.querySelector("#packetReadonlyPlan"),
        preconditions: root.querySelector("#packetPreconditions"),
        reviewer: root.querySelector("#packetReviewerGates"),
        rollback: root.querySelector("#packetRollbackPlan"),
        monitoring: root.querySelector("#packetMonitoringPlan"),
        stop: root.querySelector("#packetStopCondition"),
        boundary: root.querySelector("#packetNoWriteBoundary"),
        production: root.querySelector("#packetProductionBoundary"),
        expiry: root.querySelector("#packetExpiryCheck"),
        review: root.querySelector("#packetReviewQuestion"),
        returnReason: root.querySelector("#packetReturnReason"),
        holdReason: root.querySelector("#packetHoldReason"),
        block: root.querySelector("#packetBlockReason")
      };

      config.packet_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_packet;
        fields.founderPacket.value = JSON.stringify(config.sample_founder_packet, null, 2);
        fields.state.value = item.packet_state;
        fields.actor.value = item.packet_actor;
        fields.founderGateId.value = item.founder_execution_instruction_gate_id;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.context.value = item.source_context;
        fields.intent.value = item.execution_intent;
        fields.plan.value = item.readonly_execution_plan;
        fields.preconditions.value = item.preconditions;
        fields.reviewer.value = item.reviewer_gates;
        fields.rollback.value = item.rollback_plan;
        fields.monitoring.value = item.monitoring_plan;
        fields.stop.value = item.stop_condition;
        fields.boundary.value = item.no_write_boundary;
        fields.production.value = item.production_boundary;
        fields.expiry.value = item.expiry_check;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildPacket() {
        return {
          packet_state: fields.state.value,
          packet_actor: fields.actor.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          source_context: fields.context.value,
          execution_intent: fields.intent.value,
          readonly_execution_plan: fields.plan.value,
          preconditions: fields.preconditions.value,
          reviewer_gates: fields.reviewer.value,
          rollback_plan: fields.rollback.value,
          monitoring_plan: fields.monitoring.value,
          stop_condition: fields.stop.value,
          no_write_boundary: fields.boundary.value,
          production_boundary: fields.production.value,
          expiry_check: fields.expiry.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const founderPacket = parsePacketJson(fields.founderPacket.value, {});
        const packet = controlledExecutionPacketDraft(config, founderPacket, buildPacket());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runPacketDraft").addEventListener("click", run);
      root.querySelector("#loadPacketSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#savePacketDraft").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearPacketDrafts").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyPacketDraft").addEventListener("click", async () => {
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

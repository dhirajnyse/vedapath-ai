(() => {
  const storageKey = "vedapath-founder-authorization-instruction-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("founderAuthorizationInstructionGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("authInstructionSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("authInstructionResultCard") : null;
  const instructionOutput = pageDocument ? pageDocument.getElementById("authInstructionOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("authInstructionChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("authInstructionScope") : null;
  const questionRoot = pageDocument ? pageDocument.getElementById("authInstructionQuestionContract") : null;
  const flagsRoot = pageDocument ? pageDocument.getElementById("authInstructionFlags") : null;

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

  function authorizationReviewReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-authorization-review-gate-v2" &&
      packet.review_status === "Authorization review ready" &&
      packet.route_decision === "Ready for founder instruction" &&
      packet.authorization_review_ready === true &&
      packet.controlled_authorization_review_gate_ready === true &&
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
      keepsAuthorityFlagAudit(packet.authority_flag_audit) &&
      packet.next_gate_required === "Founder authorization instruction gate";
  }

  function hasUnsafeAuthority(value) {
    return /(authorization granted|authorization approved|approval granted|permission granted|founder grant|grant execution|authorize now|execution approved|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsInstructionBoundary(value) {
    const text = String(value || "");
    const required = [
      /authorization_review_ready may be true/i,
      /controlled_authorization_review_gate_ready may be true/i,
      /founder_authorization_instruction_ready may be true/i,
      /founder_instruction_signal_recorded may be true/i,
      /controlled_founder_authorization_instruction_gate_ready may be true/i,
      /founder_instruction_granted remains false/i,
      /execution_packet_authorized remains false/i,
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
    return required && !hasUnsafeAuthority(text);
  }

  function keepsAuthorityFlagAudit(value) {
    const text = String(value || "");
    const required = [
      "execution_packet_authorized=false",
      "execution_authorized=false",
      "execution_allowed=false",
      "founder_instruction_granted=false",
      "source_promotion_allowed=false",
      "promotion_execution_allowed=false",
      "implementation_authorized=false",
      "implementation_execution_allowed=false",
      "controlled_storage_entry_allowed=false",
      "storage_write_enabled=false",
      "canonical_write_allowed=false",
      "source_write_executed=false",
      "actual_storage_write_executed=false",
      "production_ready=false",
      "production_launch_allowed=false",
      "public_release_allowed=false"
    ].every((term) => text.includes(term));
    return required && !hasUnsafeAuthority(text);
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function instructionMissingForState(config, state, instruction = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(instruction[field] || "").trim());
  }

  function idMatches(instruction, packet, key) {
    return !instruction[key] || !packet[key] || instruction[key] === packet[key];
  }

  function founderAuthorizationInstructionGate(config, authorizationReviewPacket, instruction) {
    const state = instruction.instruction_state || "Draft instruction";
    const missing = instructionMissingForState(config, state, instruction);
    const blocked = [];

    if (!authorizationReviewReady(authorizationReviewPacket)) {
      blocked.push("authorization review must be ready while founder grant, authorization, execution, storage, canonical, public release, and production flags remain false");
    }
    ["controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(instruction, authorizationReviewPacket, key)) blocked.push(key + " must match the authorization review packet");
    });

    const readyCandidate = state === "Founder instruction ready";
    if (readyCandidate && instruction.review_route !== authorizationReviewPacket.route_decision) {
      blocked.push("review route must match the authorization review packet route");
    }
    if (readyCandidate && !hasText(instruction.instruction_scope, [["record founder instruction intent"], ["exact reviewed authorization packet"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("instruction scope must be exact-review only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(instruction.founder_question)) {
      blocked.push("founder question must not grant authorization, approve execution, or open production");
    }
    if (readyCandidate && !hasText(instruction.founder_question, [["founder question"], ["exact reviewed"], ["source-locked"], ["controlled authorization permission preflight"], ["authorization"], ["execution"], ["storage"], ["public release"], ["production"], ["false"]])) {
      blocked.push("founder question must ask one controlled preflight question and keep authorization, execution, storage, public release, and production false");
    }
    if (readyCandidate && hasUnsafeAuthority(instruction.founder_instruction_text)) {
      blocked.push("founder instruction text must not grant authorization, approve execution, or open production");
    }
    if (readyCandidate && !hasText(instruction.founder_instruction_text, [["founder instruction signal"], ["controlled authorization permission preflight"], ["instruction readiness only"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("founder instruction text must prepare permission preflight only and state authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(instruction.instruction_rationale, [["authorization review is ready"], ["source-locked"], ["founder instruction signal"], ["permission preflight"], ["does not open"], ["operational authority"]])) {
      blocked.push("instruction rationale must keep the review source-locked and separate intent from authority");
    }
    if (readyCandidate && !hasText(instruction.review_evidence_summary, [["authorization review ready"], ["authorization draft"], ["founder decision"], ["hold"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(instruction.source_lock, [["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the authorization review, authorization draft, founder decision, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsInstructionBoundary(instruction.non_authority_clause)) {
      blocked.push("non-authority clause must keep instruction readiness as non-authority and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !keepsAuthorityFlagAudit(instruction.authority_flag_audit)) {
      blocked.push("authority flag audit must list every execution, storage, canonical, public release, and production flag as false");
    }
    if (readyCandidate && !hasText(instruction.risk_acknowledgment, [["risk remains"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder instruction ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["founder grant"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on review, draft, source, rights, reviewer, ambiguity, rollback, monitoring, packet, code, or true authority flags");
    }
    if (readyCandidate && !hasText(instruction.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["controlled authorization permission preflight"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next preflight, and no source state write");
    }
    if (readyCandidate && !hasText(instruction.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled authorization permission preflight"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next preflight");
    }
    if (readyCandidate && !hasText(instruction.stop_condition, [["stop"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["founder instruction is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["founder grant"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on review/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(instruction.expiry_check, [["expires"], ["material authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not approval"]])) {
      blocked.push("expiry check must state that founder authorization instruction expires and is not approval");
    }
    if (readyCandidate && !keepsProductionBoundary(instruction.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder clarification" && !instruction.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to authorization review" && !instruction.return_reason) blocked.push("return reason is required");
    if (state === "Instruction hold" && !instruction.hold_reason) blocked.push("hold reason is required");
    if (state === "Authorization still blocked" && !instruction.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !instruction.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !instruction.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Instruction expired" && !instruction.hold_reason) blocked.push("hold reason is required when instruction expires");

    const instruction_status = missing.length
      ? "Blocked: required founder instruction fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_authorization_instruction_gate_id: instruction.founder_authorization_instruction_gate_id || "founder-authorization-instruction-gate-" + Date.now(),
      instruction_status,
      authorization_review_ready: authorizationReviewPacket.authorization_review_ready === true,
      controlled_authorization_review_gate_ready: authorizationReviewPacket.controlled_authorization_review_gate_ready === true,
      founder_authorization_instruction_ready: instruction_status === "Founder instruction ready",
      founder_instruction_signal_recorded: instruction_status === "Founder instruction ready",
      controlled_founder_authorization_instruction_gate_ready: instruction_status === "Founder instruction ready",
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
      controlled_authorization_review_gate_id: instruction.controlled_authorization_review_gate_id || authorizationReviewPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: instruction.controlled_execution_packet_authorization_draft_id || authorizationReviewPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: instruction.founder_authorization_decision_gate_id || authorizationReviewPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: instruction.controlled_execution_authorization_hold_id || authorizationReviewPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: instruction.controlled_execution_review_gate_id || authorizationReviewPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: instruction.controlled_execution_packet_draft_id || authorizationReviewPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: instruction.founder_execution_instruction_gate_id || authorizationReviewPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: instruction.promotion_execution_preflight_id || authorizationReviewPacket.promotion_execution_preflight_id || "",
      source_answer_id: instruction.source_answer_id || authorizationReviewPacket.source_answer_id || "",
      source_record_id: instruction.source_record_id || authorizationReviewPacket.source_record_id || "",
      source_family: instruction.source_family || authorizationReviewPacket.source_family || "",
      instruction_actor: instruction.instruction_actor || "",
      founder_name: instruction.founder_name || "",
      review_route: instruction.review_route || "",
      instruction_scope: instruction.instruction_scope || "",
      founder_question: instruction.founder_question || "",
      founder_instruction_text: instruction.founder_instruction_text || "",
      instruction_rationale: instruction.instruction_rationale || "",
      review_evidence_summary: instruction.review_evidence_summary || "",
      source_lock: instruction.source_lock || "",
      non_authority_clause: instruction.non_authority_clause || "",
      authority_flag_audit: instruction.authority_flag_audit || "",
      risk_acknowledgment: instruction.risk_acknowledgment || "",
      rollback_condition: instruction.rollback_condition || "",
      monitoring_condition: instruction.monitoring_condition || "",
      stop_condition: instruction.stop_condition || "",
      expiry_check: instruction.expiry_check || "",
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

  function founderInstructionSnapshot(instructions, config) {
    const byStatus = instructions.reduce((counts, instruction) => {
      const key = instruction.instruction_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_instructions: instructions.length,
      ready: byStatus["Founder instruction ready"] || 0,
      ready_questions: instructions.filter((instruction) => instruction.founder_question && instruction.founder_authorization_instruction_ready).length,
      blocked: instructions.filter((instruction) => String(instruction.instruction_status || "").startsWith("Blocked")).length,
      holds: byStatus["Instruction hold"] || 0,
      expired: byStatus["Instruction expired"] || 0,
      execution_enabled: instructions.filter((instruction) => instruction.execution_allowed || instruction.execution_authorized || instruction.execution_packet_authorized || instruction.storage_write_enabled || instruction.source_write_executed || instruction.production_ready || instruction.public_release_allowed).length
    };
  }

  function parseInstructionJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-instruction-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(instruction) {
    if (!resultCard) return;
    const issues = [...(instruction.missing || []), ...(instruction.blocked || [])];
    resultCard.dataset.state = instruction.instruction_status;
    resultCard.innerHTML = '<strong>' + safe(instruction.instruction_status) + '</strong>' +
      '<p class="muted">Instruction ready: ' + safe(instruction.founder_authorization_instruction_ready) + ' | Founder grant: ' + safe(instruction.founder_instruction_granted) + ' | Execution: ' + safe(instruction.execution_allowed) + '</p>' +
      '<div class="auth-instruction-grid">' +
        card("Review gate", instruction.controlled_authorization_review_gate_id, instruction.founder_authorization_instruction_ready ? "ready" : "") +
        card("Source answer", instruction.source_answer_id) +
        card("Founder question", instruction.founder_question ? "ready" : "missing") +
        card("Next gate", instruction.next_gate_required) +
        card("Production", instruction.production_ready ? "open" : "false", instruction.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled authorization permission preflight. Founder grant, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.instruction_checks.map((check) =>
      '<article class="auth-instruction-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderQuestionContract(config) {
    if (!questionRoot) return;
    questionRoot.innerHTML = (config.question_contract || []).map((item) =>
      '<article class="auth-instruction-rule"><strong>' + safe(item.label) + '</strong><span>' + safe(item.rule) + '</span></article>'
    ).join("");
  }

  function renderFlags(config) {
    if (!flagsRoot) return;
    flagsRoot.innerHTML = Object.entries(config.authority_flags || {}).map(([key, value]) =>
      '<article class="auth-instruction-flag"><span>' + safe(key) + '</span><strong>' + safe(value) + '</strong></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Review gate", config.source.controlled_authorization_review_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseInstructionJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(instructions) {
    localStorage.setItem(storageKey, JSON.stringify(instructions.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const instructions = readSaved();
    const snapshot = founderInstructionSnapshot(instructions, config);
    savedRoot.innerHTML = card("Saved instructions", snapshot.saved_instructions) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      instructions.slice(-4).reverse().map((instruction) =>
        '<article class="auth-instruction-card ' + (instruction.founder_authorization_instruction_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(instruction.created_at) + '</span>' +
        '<strong>' + safe(instruction.instruction_status) + '</strong>' +
        '<span>' + safe(instruction.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderAuthorizationInstructionGate = {
    founderAuthorizationInstructionGate,
    founderInstructionSnapshot,
    instructionMissingForState,
    keepsInstructionBoundary,
    keepsAuthorityFlagAudit,
    keepsProductionBoundary,
    hasUnsafeAuthority,
    parseInstructionJson,
    authorizationReviewReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-founder-authorization-instruction-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationReview: root.querySelector("#authInstructionAuthorizationReview"),
        state: root.querySelector("#authInstructionState"),
        actor: root.querySelector("#authInstructionActor"),
        founder: root.querySelector("#authInstructionFounderName"),
        instructionGateId: root.querySelector("#authInstructionGateId"),
        reviewGateId: root.querySelector("#authInstructionReviewGateId"),
        authorizationDraftId: root.querySelector("#authInstructionDraftId"),
        decisionGateId: root.querySelector("#authInstructionDecisionGateId"),
        authorizationHoldId: root.querySelector("#authInstructionAuthorizationHoldId"),
        priorReviewGateId: root.querySelector("#authInstructionPriorReviewGateId"),
        packetDraftId: root.querySelector("#authInstructionPacketDraftId"),
        founderGateId: root.querySelector("#authInstructionFounderGateId"),
        preflightId: root.querySelector("#authInstructionPreflightId"),
        sourceAnswer: root.querySelector("#authInstructionSourceAnswer"),
        sourceRecord: root.querySelector("#authInstructionSourceRecord"),
        sourceFamily: root.querySelector("#authInstructionSourceFamily"),
        reviewRoute: root.querySelector("#authInstructionReviewRoute"),
        scope: root.querySelector("#authInstructionScopeText"),
        founderQuestion: root.querySelector("#authInstructionFounderQuestion"),
        instruction: root.querySelector("#authInstructionText"),
        rationale: root.querySelector("#authInstructionRationale"),
        evidence: root.querySelector("#authInstructionEvidence"),
        sourceLock: root.querySelector("#authInstructionSourceLock"),
        boundary: root.querySelector("#authInstructionBoundary"),
        flagAudit: root.querySelector("#authInstructionFlagAudit"),
        risk: root.querySelector("#authInstructionRisk"),
        rollback: root.querySelector("#authInstructionRollback"),
        monitoring: root.querySelector("#authInstructionMonitoring"),
        stop: root.querySelector("#authInstructionStopCondition"),
        expiry: root.querySelector("#authInstructionExpiry"),
        production: root.querySelector("#authInstructionProductionBoundary"),
        question: root.querySelector("#authInstructionQuestion"),
        returnReason: root.querySelector("#authInstructionReturnReason"),
        holdReason: root.querySelector("#authInstructionHoldReason"),
        block: root.querySelector("#authInstructionBlockReason")
      };

      config.instruction_states.forEach((state) => fields.state.add(new Option(state, state)));

      function loadSample() {
        const sample = config.sample_instruction;
        fields.authorizationReview.value = JSON.stringify(config.sample_authorization_review, null, 2);
        fields.state.value = sample.instruction_state;
        fields.actor.value = sample.instruction_actor;
        fields.founder.value = sample.founder_name;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
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
        fields.reviewRoute.value = sample.review_route;
        fields.scope.value = sample.instruction_scope;
        fields.founderQuestion.value = sample.founder_question;
        fields.instruction.value = sample.founder_instruction_text;
        fields.rationale.value = sample.instruction_rationale;
        fields.evidence.value = sample.review_evidence_summary;
        fields.sourceLock.value = sample.source_lock;
        fields.boundary.value = sample.non_authority_clause;
        fields.flagAudit.value = sample.authority_flag_audit;
        fields.risk.value = sample.risk_acknowledgment;
        fields.rollback.value = sample.rollback_condition;
        fields.monitoring.value = sample.monitoring_condition;
        fields.stop.value = sample.stop_condition;
        fields.expiry.value = sample.expiry_check;
        fields.production.value = sample.production_boundary;
        fields.question.value = sample.clarification_question;
        fields.returnReason.value = sample.return_reason;
        fields.holdReason.value = sample.hold_reason;
        fields.block.value = sample.block_reason;
      }

      function buildInstruction() {
        return {
          instruction_state: fields.state.value,
          instruction_actor: fields.actor.value,
          founder_name: fields.founder.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
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
          review_route: fields.reviewRoute.value,
          instruction_scope: fields.scope.value,
          founder_question: fields.founderQuestion.value,
          founder_instruction_text: fields.instruction.value,
          instruction_rationale: fields.rationale.value,
          review_evidence_summary: fields.evidence.value,
          source_lock: fields.sourceLock.value,
          non_authority_clause: fields.boundary.value,
          authority_flag_audit: fields.flagAudit.value,
          risk_acknowledgment: fields.risk.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          clarification_question: fields.question.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const authorizationReviewPacket = parseInstructionJson(fields.authorizationReview.value, {});
        const instruction = founderAuthorizationInstructionGate(config, authorizationReviewPacket, buildInstruction());
        instructionOutput.value = JSON.stringify(instruction, null, 2);
        renderResult(instruction);
        return instruction;
      }

      root.querySelector("#runAuthInstruction").addEventListener("click", run);
      root.querySelector("#loadAuthInstructionSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthInstruction").addEventListener("click", () => {
        const instruction = run();
        writeSaved([...readSaved(), instruction]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthInstructions").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthInstruction").addEventListener("click", async () => {
        if (!instructionOutput.value) run();
        await navigator.clipboard.writeText(instructionOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      renderQuestionContract(config);
      renderFlags(config);
      run();
      renderSaved(config);
    });
})();

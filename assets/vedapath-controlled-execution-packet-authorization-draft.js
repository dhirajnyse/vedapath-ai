(() => {
  const storageKey = "vedapath-controlled-execution-packet-authorization-draft";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledExecutionPacketAuthorizationDraft") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("authDraftSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("authDraftResultCard") : null;
  const draftOutput = pageDocument ? pageDocument.getElementById("authDraftOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("authDraftChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("authDraftScope") : null;

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

  function founderDecisionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "founder-authorization-decision-gate-v1" &&
      packet.decision_status === "Founder decision ready" &&
      packet.founder_authorization_decision_ready === true &&
      packet.founder_decision_recorded === true &&
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
      packet.next_gate_required === "Controlled execution packet authorization draft";
  }

  function keepsDraftBoundary(value) {
    const text = String(value || "");
    const required = [
      /authorization_draft_ready may be true/i,
      /controlled_execution_packet_authorization_draft_ready may be true/i,
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
    const unsafe = /(authorization granted|authorize now|execution approved|execute now|run now|run from it|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function draftMissingForState(config, state, draft = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(draft[field] || "").trim());
  }

  function idMatches(draft, packet, key) {
    return !draft[key] || !packet[key] || draft[key] === packet[key];
  }

  function controlledExecutionPacketAuthorizationDraft(config, founderDecisionPacket, draft) {
    const state = draft.draft_state || "Draft packet";
    const missing = draftMissingForState(config, state, draft);
    const blocked = [];

    if (!founderDecisionReady(founderDecisionPacket)) {
      blocked.push("founder authorization decision must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    }
    ["founder_authorization_decision_gate_id", "controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(draft, founderDecisionPacket, key)) blocked.push(key + " must match the founder decision packet");
    });

    const readyCandidate = state === "Authorization draft ready";
    if (readyCandidate && !hasText(draft.draft_scope, [["draft an execution packet authorization review object"], ["exact source packet"], ["founder decision readiness"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("draft scope must be exact-source only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(draft.authorization_draft_language, [["proposed authorization language"], ["later review"], ["controlled authorization review gate"], ["draft text only"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("authorization draft language must be proposed text only and state authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(draft.draft_rationale, [["founder decision"], ["packet drafting only"], ["same source answer"], ["source record"], ["source family"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("draft rationale must keep the packet tied to the founder decision and source chain");
    }
    if (readyCandidate && !hasText(draft.review_evidence_summary, [["founder decision ready"], ["authorization hold"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(draft.source_lock, [["founder_authorization_decision_gate_id"], ["controlled_execution_authorization_hold_id"], ["controlled_execution_review_gate_id"], ["controlled_execution_packet_draft_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the founder decision, hold, review gate, packet draft, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsDraftBoundary(draft.non_authority_clause)) {
      blocked.push("non-authority clause must keep draft readiness as non-authority and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(draft.risk_acknowledgment, [["risk remains"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder decision expiry"], ["authorization hold expiry"], ["review gate expiry"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on source, rights, reviewer, founder, hold, review, rollback, monitoring, packet, code, or true authority flags");
    }
    if (readyCandidate && !hasText(draft.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["controlled authorization review gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next review gate, and no source state write");
    }
    if (readyCandidate && !hasText(draft.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled authorization review gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next review gate");
    }
    if (readyCandidate && !hasText(draft.stop_condition, [["stop"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder decision expires"], ["authorization hold expires"], ["review gate expires"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(draft.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder decision"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not approval"]])) {
      blocked.push("expiry check must state that authorization draft expires and is not approval");
    }
    if (readyCandidate && !keepsProductionBoundary(draft.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs authorization draft evidence" && !draft.review_question) blocked.push("review question is required");
    if (state === "Return to founder decision" && !draft.return_reason) blocked.push("return reason is required");
    if (state === "Draft hold" && !draft.hold_reason) blocked.push("hold reason is required");
    if (state === "Authorization blocked" && !draft.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !draft.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !draft.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Draft expired" && !draft.hold_reason) blocked.push("hold reason is required when draft expires");

    const draft_status = missing.length
      ? "Blocked: required authorization draft fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_execution_packet_authorization_draft_id: draft.controlled_execution_packet_authorization_draft_id || "controlled-execution-packet-authorization-draft-" + Date.now(),
      draft_status,
      authorization_draft_ready: draft_status === "Authorization draft ready",
      controlled_execution_packet_authorization_draft_ready: draft_status === "Authorization draft ready",
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
      founder_authorization_decision_gate_id: draft.founder_authorization_decision_gate_id || founderDecisionPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: draft.controlled_execution_authorization_hold_id || founderDecisionPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: draft.controlled_execution_review_gate_id || founderDecisionPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: draft.controlled_execution_packet_draft_id || founderDecisionPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: draft.founder_execution_instruction_gate_id || founderDecisionPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: draft.promotion_execution_preflight_id || founderDecisionPacket.promotion_execution_preflight_id || "",
      source_answer_id: draft.source_answer_id || founderDecisionPacket.source_answer_id || "",
      source_record_id: draft.source_record_id || founderDecisionPacket.source_record_id || "",
      source_family: draft.source_family || founderDecisionPacket.source_family || "",
      draft_actor: draft.draft_actor || "",
      draft_name: draft.draft_name || "",
      draft_scope: draft.draft_scope || "",
      authorization_draft_language: draft.authorization_draft_language || "",
      draft_rationale: draft.draft_rationale || "",
      review_evidence_summary: draft.review_evidence_summary || "",
      source_lock: draft.source_lock || "",
      non_authority_clause: draft.non_authority_clause || "",
      risk_acknowledgment: draft.risk_acknowledgment || "",
      rollback_condition: draft.rollback_condition || "",
      monitoring_condition: draft.monitoring_condition || "",
      stop_condition: draft.stop_condition || "",
      expiry_check: draft.expiry_check || "",
      production_boundary: draft.production_boundary || "",
      review_question: draft.review_question || "",
      return_reason: draft.return_reason || "",
      hold_reason: draft.hold_reason || "",
      block_reason: draft.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function authorizationDraftSnapshot(drafts, config) {
    const byStatus = drafts.reduce((counts, draft) => {
      const key = draft.draft_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_drafts: drafts.length,
      ready: byStatus["Authorization draft ready"] || 0,
      blocked: drafts.filter((draft) => String(draft.draft_status || "").startsWith("Blocked")).length,
      holds: byStatus["Draft hold"] || 0,
      expired: byStatus["Draft expired"] || 0,
      execution_enabled: drafts.filter((draft) => draft.execution_allowed || draft.execution_authorized || draft.execution_packet_authorized || draft.storage_write_enabled || draft.source_write_executed || draft.production_ready || draft.public_release_allowed).length
    };
  }

  function parseDraftJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-draft-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(draft) {
    if (!resultCard) return;
    const issues = [...(draft.missing || []), ...(draft.blocked || [])];
    resultCard.dataset.state = draft.draft_status;
    resultCard.innerHTML = '<strong>' + safe(draft.draft_status) + '</strong>' +
      '<p class="muted">Draft ready: ' + safe(draft.authorization_draft_ready) + ' | Authorized: ' + safe(draft.execution_packet_authorized) + ' | Production: ' + safe(draft.production_ready) + '</p>' +
      '<div class="auth-draft-grid">' +
        card("Founder decision", draft.founder_authorization_decision_gate_id, draft.authorization_draft_ready ? "ready" : "") +
        card("Source answer", draft.source_answer_id) +
        card("Next gate", draft.next_gate_required) +
        card("Execution", draft.execution_allowed ? "enabled" : "false", draft.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled authorization review gate. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.draft_checks.map((check) =>
      '<article class="auth-draft-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Founder decision", config.source.founder_authorization_decision_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseDraftJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(drafts) {
    localStorage.setItem(storageKey, JSON.stringify(drafts.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const drafts = readSaved();
    const snapshot = authorizationDraftSnapshot(drafts, config);
    savedRoot.innerHTML = card("Saved drafts", snapshot.saved_drafts) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      drafts.slice(-4).reverse().map((draft) =>
        '<article class="auth-draft-card ' + (draft.authorization_draft_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(draft.created_at) + '</span>' +
        '<strong>' + safe(draft.draft_status) + '</strong>' +
        '<span>' + safe(draft.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledExecutionPacketAuthorizationDraft = {
    controlledExecutionPacketAuthorizationDraft,
    authorizationDraftSnapshot,
    draftMissingForState,
    keepsDraftBoundary,
    keepsProductionBoundary,
    parseDraftJson,
    founderDecisionReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-controlled-execution-packet-authorization-draft.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        founderDecision: root.querySelector("#authDraftFounderDecision"),
        state: root.querySelector("#authDraftState"),
        actor: root.querySelector("#authDraftActor"),
        name: root.querySelector("#authDraftName"),
        draftId: root.querySelector("#authDraftId"),
        decisionGateId: root.querySelector("#authDraftDecisionGateId"),
        authorizationHoldId: root.querySelector("#authDraftAuthorizationHoldId"),
        reviewGateId: root.querySelector("#authDraftReviewGateId"),
        packetDraftId: root.querySelector("#authDraftPacketDraftId"),
        founderGateId: root.querySelector("#authDraftFounderGateId"),
        preflightId: root.querySelector("#authDraftPreflightId"),
        sourceAnswer: root.querySelector("#authDraftSourceAnswer"),
        sourceRecord: root.querySelector("#authDraftSourceRecord"),
        sourceFamily: root.querySelector("#authDraftSourceFamily"),
        scope: root.querySelector("#authDraftScopeText"),
        language: root.querySelector("#authDraftLanguage"),
        rationale: root.querySelector("#authDraftRationale"),
        evidence: root.querySelector("#authDraftEvidence"),
        sourceLock: root.querySelector("#authDraftSourceLock"),
        boundary: root.querySelector("#authDraftBoundary"),
        risk: root.querySelector("#authDraftRisk"),
        rollback: root.querySelector("#authDraftRollback"),
        monitoring: root.querySelector("#authDraftMonitoring"),
        stop: root.querySelector("#authDraftStopCondition"),
        expiry: root.querySelector("#authDraftExpiry"),
        production: root.querySelector("#authDraftProductionBoundary"),
        question: root.querySelector("#authDraftQuestion"),
        returnReason: root.querySelector("#authDraftReturnReason"),
        holdReason: root.querySelector("#authDraftHoldReason"),
        block: root.querySelector("#authDraftBlockReason")
      };

      config.draft_states.forEach((state) => fields.state.add(new Option(state, state)));

      function loadSample() {
        const sample = config.sample_draft;
        fields.founderDecision.value = JSON.stringify(config.sample_founder_decision, null, 2);
        fields.state.value = sample.draft_state;
        fields.actor.value = sample.draft_actor;
        fields.name.value = sample.draft_name;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.authorizationHoldId.value = sample.controlled_execution_authorization_hold_id;
        fields.reviewGateId.value = sample.controlled_execution_review_gate_id;
        fields.packetDraftId.value = sample.controlled_execution_packet_draft_id;
        fields.founderGateId.value = sample.founder_execution_instruction_gate_id;
        fields.preflightId.value = sample.promotion_execution_preflight_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.draft_scope;
        fields.language.value = sample.authorization_draft_language;
        fields.rationale.value = sample.draft_rationale;
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

      function buildDraft() {
        return {
          draft_state: fields.state.value,
          draft_actor: fields.actor.value,
          draft_name: fields.name.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          controlled_execution_authorization_hold_id: fields.authorizationHoldId.value,
          controlled_execution_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          draft_scope: fields.scope.value,
          authorization_draft_language: fields.language.value,
          draft_rationale: fields.rationale.value,
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
        const founderDecisionPacket = parseDraftJson(fields.founderDecision.value, {});
        const draft = controlledExecutionPacketAuthorizationDraft(config, founderDecisionPacket, buildDraft());
        draftOutput.value = JSON.stringify(draft, null, 2);
        renderResult(draft);
        return draft;
      }

      root.querySelector("#runAuthDraft").addEventListener("click", run);
      root.querySelector("#loadAuthDraftSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthDraft").addEventListener("click", () => {
        const draft = run();
        writeSaved([...readSaved(), draft]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthDrafts").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthDraft").addEventListener("click", async () => {
        if (!draftOutput.value) run();
        await navigator.clipboard.writeText(draftOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();

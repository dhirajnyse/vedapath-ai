const reviewRoot = document.getElementById("reviewTicketBridge");

const reviewStopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "did", "do", "does", "for", "from",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "should", "that", "the", "to",
  "was", "what", "when", "where", "which", "with", "you"
]);

if (reviewRoot) {
  initReviewBridge().catch((error) => {
    reviewRoot.innerHTML = '<article class="ticket-packet"><strong>Review bridge could not load.</strong></article>';
    console.error(error);
  });
}

function reviewNormalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();
}

function reviewTokens(value) {
  return reviewNormalize(value)
    .split(/\s+/)
    .filter((token) => token && token.length > 1 && !reviewStopWords.has(token));
}

function reviewSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function reviewScoreRecord(query, record, config) {
  const normalizedQuery = reviewNormalize(query);
  const queryTokens = reviewTokens(query);
  const noSourceHits = (config.no_source_signals || []).filter((term) => normalizedQuery.includes(term));
  const reasons = [];
  let score = 0;

  for (const alias of record.aliases || []) {
    if (normalizedQuery.includes(reviewNormalize(alias))) {
      score += 60;
      reasons.push("Exact alias: " + alias);
      break;
    }
  }

  for (const phrase of [record.question, record.title]) {
    const normalizedPhrase = reviewNormalize(phrase);
    if (normalizedPhrase && (normalizedQuery.includes(normalizedPhrase) || normalizedPhrase.includes(normalizedQuery))) {
      score += 44;
      reasons.push("Question/title phrase match");
      break;
    }
  }

  for (const term of record.retrieval_terms || []) {
    const normalizedTerm = reviewNormalize(term);
    const termTokens = reviewTokens(term);
    if (normalizedTerm && normalizedQuery.includes(normalizedTerm)) {
      score += 14;
      reasons.push("Curated term: " + term);
    } else if (termTokens.some((token) => queryTokens.includes(token))) {
      score += 9;
      reasons.push("Related term: " + term);
    }
  }

  const sourceHits = [...new Set(reviewTokens([record.source, record.source_family, record.tradition_layer].join(" ")).filter((token) => queryTokens.includes(token)))];
  if (sourceHits.length) {
    score += Math.min(24, sourceHits.length * 8);
    reasons.push("Source/family terms: " + sourceHits.slice(0, 4).join(", "));
  }

  const bodyHits = [...new Set(reviewTokens([record.summary, record.boundary, record.caution, ...(record.blocked_claims || [])].join(" ")).filter((token) => queryTokens.includes(token)))];
  if (bodyHits.length) {
    score += Math.min(18, bodyHits.length * 3);
    reasons.push("Body evidence terms: " + bodyHits.slice(0, 5).join(", "));
  }

  if (record.readiness === "answer-preview-ready") {
    score += 12;
    reasons.push("Preview-ready record");
  } else if (record.readiness) {
    score += 4;
    reasons.push("Record exists but needs review: " + record.readiness);
  }

  if (String(record.pramana || "").toLowerCase().includes("direct")) {
    score += 8;
    reasons.push("Direct source lane");
  }

  if (noSourceHits.length) {
    score -= 48;
    reasons.unshift("No-source signal: " + noSourceHits.join(", "));
  }

  return {
    record,
    score,
    reasons,
    status: score >= config.threshold.answer_ready && record.readiness === "answer-preview-ready" ? "answer-ready" : score >= config.threshold.review_needed ? "review-needed" : "no-source"
  };
}

function reviewRank(query, records, config) {
  return records
    .map((record) => reviewScoreRecord(query, record, config))
    .sort((a, b) => b.score - a.score);
}

function evaluateBridgeCases(cases, records, config) {
  return cases.map((testCase) => {
    const ranked = reviewRank(testCase.query, records, config);
    const top = ranked[0] || null;
    const actualSlug = top && top.score >= config.threshold.review_needed ? top.record.slug : "no-source";
    const actualStatus = top && top.score >= config.threshold.review_needed ? top.status : "no-source";
    const score = top ? top.score : 0;
    const pass = actualSlug === testCase.expected_slug &&
      actualStatus === testCase.expected_status &&
      (testCase.minimum_score === undefined || score >= testCase.minimum_score) &&
      (testCase.maximum_score === undefined || score <= testCase.maximum_score);

    return {
      ...testCase,
      pass,
      actual_slug: actualSlug,
      actual_status: actualStatus,
      actual_score: score,
      actual_source: top && top.score >= config.threshold.review_needed ? top.record.source : "No matching source record",
      actual_family: top && top.score >= config.threshold.review_needed ? top.record.source_family : "Unverified | Review needed",
      actual_record: top && top.score >= config.threshold.review_needed ? top.record : null,
      reasons: top ? top.reasons : []
    };
  });
}

function bridgeLaneFor(result) {
  if (!result.pass) return "eval-failure";
  if (result.actual_status === "no-source") return "source-gap";
  if (result.actual_status === "review-needed" && result.actual_family.includes("Veda")) return "mantra-review";
  if (result.actual_status === "review-needed" && result.actual_family.includes("Upanishad")) return "commentary-review";
  if (result.actual_status === "review-needed") return "source-review";
  return "";
}

function laneConfig(bridge, laneId) {
  return (bridge.lanes || []).find((lane) => lane.id === laneId) || {
    id: laneId,
    label: laneId,
    owner: "Reviewer",
    severity: "Medium",
    next_action: "Review this case before release."
  };
}

function generateReviewTickets(results, bridge) {
  return results
    .map((result) => {
      const laneId = bridgeLaneFor(result);
      if (!laneId) return null;
      const lane = laneConfig(bridge, laneId);
      const titlePrefix = laneId === "source-gap" ? "Source gap" : laneId === "eval-failure" ? "Eval failure" : "Review needed";
      return {
        ticket_id: "ticket-" + result.id,
        lane: lane.label,
        lane_id: lane.id,
        severity: lane.severity,
        owner: lane.owner,
        state: "Open",
        title: titlePrefix + ": " + result.query,
        question: result.query,
        source: result.actual_source,
        family: result.actual_family,
        risk: result.risk,
        expected: result.expected_slug + " / " + result.expected_status,
        actual: result.actual_slug + " / " + result.actual_status + " / score " + result.actual_score,
        next_action: lane.next_action,
        boundary: result.actual_record ? result.actual_record.boundary : "No reviewed source record exists for this question yet.",
        reason: result.reason,
        match_reasons: result.reasons.join(" | ") || "No retrieval reasons",
        packet: ""
      };
    })
    .filter(Boolean);
}

function ticketPacket(ticket, decision) {
  return [
    "VedaPath Review Ticket",
    "Ticket: " + ticket.ticket_id,
    "Lane: " + ticket.lane,
    "Severity: " + ticket.severity,
    "Owner: " + (decision.owner || ticket.owner),
    "State: " + (decision.state || ticket.state),
    "Question: " + ticket.question,
    "Source: " + ticket.source,
    "Family: " + ticket.family,
    "Risk: " + ticket.risk,
    "Expected: " + ticket.expected,
    "Actual: " + ticket.actual,
    "Next action: " + ticket.next_action,
    "Boundary: " + ticket.boundary,
    "Reviewer note: " + (decision.note || "No note yet.")
  ].join("\n");
}

function readDecisions(storeKey) {
  try {
    return JSON.parse(localStorage.getItem(storeKey) || "{}");
  } catch (error) {
    return {};
  }
}

function writeDecisions(storeKey, decisions) {
  localStorage.setItem(storeKey, JSON.stringify(decisions, null, 2));
}

async function reviewLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

async function initReviewBridge() {
  const [bridge, evalData, retrievalConfig, sourceData] = await Promise.all([
    reviewLoadJson("data/vedapath-review-ticket-bridge.json"),
    reviewLoadJson("data/vedapath-retrieval-eval-cases.json"),
    reviewLoadJson("data/vedapath-retrieval-foundation.json"),
    reviewLoadJson("data/vedapath-source-answer-foundation.json")
  ]);
  const results = evaluateBridgeCases(evalData.cases || [], sourceData.records || [], retrievalConfig);
  const tickets = generateReviewTickets(results, bridge);
  const storeKey = bridge.local_decision_store || "vedapath-review-ticket-decisions-v1";
  let decisions = readDecisions(storeKey);
  let activeId = tickets[0] && tickets[0].ticket_id;

  const summary = reviewRoot.querySelector("#ticketSummary");
  const list = reviewRoot.querySelector("#ticketList");
  const detail = reviewRoot.querySelector("#ticketDetail");
  const rules = reviewRoot.querySelector("#bridgeRules");
  const packet = reviewRoot.querySelector("#ticketPacket");
  const copyOne = reviewRoot.querySelector("#copyTicketPacket");
  const copyAll = reviewRoot.querySelector("#copyAllTickets");
  const save = reviewRoot.querySelector("#saveTicketDecision");
  const state = reviewRoot.querySelector("#ticketState");
  const owner = reviewRoot.querySelector("#ticketOwner");
  const note = reviewRoot.querySelector("#ticketNote");

  function activeTicket() {
    return tickets.find((ticket) => ticket.ticket_id === activeId) || tickets[0];
  }

  function decisionFor(ticket) {
    return decisions[ticket.ticket_id] || {};
  }

  function renderSummary() {
    const sourceGaps = tickets.filter((ticket) => ticket.lane_id === "source-gap").length;
    const reviewNeeded = tickets.filter((ticket) => ticket.lane_id !== "source-gap" && ticket.lane_id !== "eval-failure").length;
    const failures = tickets.filter((ticket) => ticket.lane_id === "eval-failure").length;
    const saved = tickets.filter((ticket) => decisions[ticket.ticket_id]).length;
    summary.innerHTML = [
      ["Tickets", tickets.length],
      ["Source gaps", sourceGaps],
      ["Review", reviewNeeded],
      ["Failures", failures],
      ["Saved", saved]
    ].map((row) => '<div class="ticket-stat"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></div>').join("");
  }

  function renderList() {
    list.innerHTML = tickets.map((ticket) => {
      const decision = decisionFor(ticket);
      return '<button class="ticket-card ' + reviewSafe(ticket.lane_id) + (ticket.ticket_id === activeId ? ' active' : '') + '" type="button" data-id="' + reviewSafe(ticket.ticket_id) + '">' +
        '<span class="ticket-chip ' + (ticket.lane_id === "source-gap" ? "" : "green") + '">' + reviewSafe(ticket.lane) + '</span>' +
        '<strong>' + reviewSafe(ticket.title) + '</strong>' +
        '<span>' + reviewSafe(ticket.severity + " severity | " + (decision.state || ticket.state)) + '</span>' +
        '<span>' + reviewSafe(ticket.owner) + '</span>' +
      '</button>';
    }).join("");
  }

  function renderControls(ticket) {
    const decision = decisionFor(ticket);
    state.innerHTML = (bridge.decision_options || []).map((option) => '<option value="' + reviewSafe(option) + '"' + ((decision.state || ticket.state) === option ? ' selected' : '') + '>' + reviewSafe(option) + '</option>').join("");
    owner.innerHTML = (bridge.owner_options || []).map((option) => '<option value="' + reviewSafe(option) + '"' + ((decision.owner || ticket.owner) === option ? ' selected' : '') + '>' + reviewSafe(option) + '</option>').join("");
    note.value = decision.note || "";
  }

  function renderDetail() {
    const ticket = activeTicket();
    if (!ticket) return;
    const decision = decisionFor(ticket);
    detail.innerHTML = [
      ["Ticket", ticket.ticket_id],
      ["Lane", ticket.lane],
      ["Severity", ticket.severity],
      ["Owner", decision.owner || ticket.owner],
      ["State", decision.state || ticket.state],
      ["Risk", ticket.risk],
      ["Question", ticket.question, "wide"],
      ["Expected", ticket.expected, "wide"],
      ["Actual", ticket.actual, "wide"],
      ["Source", ticket.source, "wide"],
      ["Boundary", ticket.boundary, "wide"],
      ["Next action", ticket.next_action, "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></div>').join("");
    renderControls(ticket);
    packet.value = ticketPacket(ticket, decision);
  }

  function renderRules() {
    rules.innerHTML = [
      ["Policy", bridge.ticket_policy],
      ["Boundary", bridge.warning],
      ["Eval data", bridge.evaluation_dataset],
      ["Local store", storeKey]
    ].map((row) => '<article class="bridge-rule"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></article>').join("");
  }

  function render() {
    renderSummary();
    renderList();
    renderDetail();
    renderRules();
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    activeId = button.dataset.id;
    render();
  });

  save.addEventListener("click", () => {
    const ticket = activeTicket();
    if (!ticket) return;
    decisions[ticket.ticket_id] = {
      state: state.value,
      owner: owner.value,
      note: note.value.trim(),
      updated_at: new Date().toISOString()
    };
    writeDecisions(storeKey, decisions);
    render();
  });

  function copyText(value, button) {
    const original = button.textContent;
    const done = () => {
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(done).catch(() => {});
      return;
    }
    packet.focus();
    packet.select();
    try {
      document.execCommand("copy");
      done();
    } catch (error) {}
  }

  copyOne.addEventListener("click", () => {
    copyText(packet.value, copyOne);
  });

  copyAll.addEventListener("click", () => {
    const all = tickets.map((ticket) => ticketPacket(ticket, decisionFor(ticket))).join("\n\n---\n\n");
    copyText(all, copyAll);
  });

  render();
}

if (typeof window !== "undefined") {
  window.vedapathReviewBridge = {
    evaluateBridgeCases,
    generateReviewTickets,
    ticketPacket
  };
}

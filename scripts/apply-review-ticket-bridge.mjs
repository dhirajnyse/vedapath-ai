import fs from "node:fs";
import path from "node:path";

const release = "v2.9.4";
const badge = `${release} review`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, block, before) {
  const wrapped = `${start}\n${block.trimEnd()}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), wrapped);
  }
  const index = content.indexOf(before);
  if (index === -1) return `${content.trimEnd()}\n\n${wrapped}\n`;
  return `${content.slice(0, index)}${wrapped}\n\n${content.slice(index)}`;
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function addReviewNav(content, isBrandPage = false) {
  if (content.includes("reviewticketbridge.html")) return content;
  const prefix = isBrandPage ? "../" : "";
  const normal = `<a class="link" href="${prefix}citedanswerlab.html">Answers</a>`;
  const active = `<a class="link active" href="${prefix}citedanswerlab.html">Answers</a>`;
  const review = `          <a class="link" href="${prefix}reviewticketbridge.html">Review</a>`;
  if (content.includes(normal)) return content.replace(normal, `${normal}\n${review}`);
  if (content.includes(active)) return content.replace(active, `${active}\n${review}`);
  return content;
}

function updateAllHtmlShells() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, addReviewNav(updateVersionBadge(read(file))));
  }
  const brandFile = path.join("brand", "brand-board.html");
  write(brandFile, addReviewNav(updateVersionBadge(read(brandFile)), true));
}

function writeBridgeData() {
  const data = {
    product: "VedaPath AI",
    release,
    status: "review ticket bridge v1",
    schema_version: "review-ticket-bridge-v1",
    evaluation_dataset: "data/vedapath-retrieval-eval-cases.json",
    retrieval_config: "data/vedapath-retrieval-foundation.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_decision_store: "vedapath-review-ticket-decisions-v1",
    warning: "Prototype review bridge only. Tickets are browser-side review aids, not scholar approval, canonical source validation, production workflow, therapy, ritual instruction, emergency support, or spiritual authority.",
    ticket_policy: "Create visible review tickets for failed evals, review-needed source matches, and no-source gaps. Passing answer-ready cases are monitored but do not become open review work.",
    lanes: [
      {
        id: "eval-failure",
        label: "Eval failure",
        owner: "Retrieval reviewer",
        severity: "High",
        next_action: "Compare expected and actual source, then decide whether the data, scoring rule, or expectation should change."
      },
      {
        id: "source-review",
        label: "Source review",
        owner: "Source reviewer",
        severity: "Medium",
        next_action: "Confirm citation, source family, rights state, and whether the answer can move from review-needed to answer-ready."
      },
      {
        id: "mantra-review",
        label: "Mantra review",
        owner: "Mantra reviewer",
        severity: "High",
        next_action: "Review Sanskrit, recitation boundary, ritual caution, and citation-only wording before public answer use."
      },
      {
        id: "commentary-review",
        label: "Commentary review",
        owner: "Interpretation reviewer",
        severity: "High",
        next_action: "Add comparison lanes so one tradition is not flattened into the only reading."
      },
      {
        id: "source-gap",
        label: "Source gap",
        owner: "Source intake",
        severity: "High",
        next_action: "Record the user question, likely claim family, and missing evidence without forcing an answer."
      }
    ],
    decision_options: [
      "Open",
      "Needs source",
      "Needs Sanskrit",
      "Needs commentary",
      "Ready after review",
      "Closed"
    ],
    owner_options: [
      "Retrieval reviewer",
      "Source reviewer",
      "Mantra reviewer",
      "Interpretation reviewer",
      "Source intake",
      "Founder review"
    ],
    copy_packet_fields: [
      "ticket_id",
      "lane",
      "severity",
      "owner",
      "question",
      "source",
      "risk",
      "expected",
      "actual",
      "next_action",
      "boundary"
    ]
  };
  write("data/vedapath-review-ticket-bridge.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeBridgeCss() {
  write("assets/vedapath-review-ticket-bridge.css", `/* VedaPath review ticket bridge */
.review-bridge {
  display: grid;
  gap: 16px;
}

.review-head,
.ticket-shell,
.ticket-detail-grid,
.ticket-summary,
.decision-grid,
.ticket-actions,
.bridge-rules {
  display: grid;
  gap: 10px;
}

.review-head {
  grid-template-columns: minmax(0, 1fr) 130px;
  align-items: center;
}

.review-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.review-mark img {
  width: 100%;
  display: block;
}

.ticket-summary {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.ticket-shell {
  grid-template-columns: minmax(250px, 0.86fr) minmax(0, 1.14fr);
  align-items: start;
}

.ticket-list {
  display: grid;
  gap: 10px;
  max-height: 620px;
  overflow: auto;
  padding-right: 3px;
}

.ticket-card,
.ticket-stat,
.ticket-detail-grid > div,
.decision-panel,
.bridge-rule,
.ticket-packet {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.ticket-card,
.ticket-stat,
.ticket-detail-grid > div,
.decision-panel,
.bridge-rule {
  padding: 12px;
}

.ticket-card {
  width: 100%;
  color: inherit;
  text-align: left;
  border-left: 4px solid var(--bhagwa);
}

.ticket-card.source-review,
.ticket-card.commentary-review,
.ticket-card.mantra-review {
  border-left-color: var(--gold);
}

.ticket-card.source-gap,
.ticket-card.eval-failure {
  border-left-color: var(--bhagwa);
}

.ticket-card.active {
  background: #fff0e7;
  border-color: #f09f79;
}

.ticket-card strong,
.ticket-card span,
.ticket-stat span,
.ticket-stat strong,
.ticket-detail-grid span,
.ticket-detail-grid strong,
.bridge-rule span,
.bridge-rule strong {
  display: block;
}

.ticket-card span,
.ticket-stat span,
.ticket-detail-grid span,
.bridge-rule span,
.ticket-packet-label {
  color: var(--muted);
  font-size: 12px;
}

.ticket-stat strong {
  margin-top: 4px;
  font-size: 24px;
  line-height: 1;
}

.ticket-chip {
  display: inline-flex;
  width: fit-content;
  min-height: 26px;
  align-items: center;
  border-radius: 999px;
  padding: 3px 9px;
  background: var(--soft-red);
  color: var(--ochre);
  font-size: 12px;
  font-weight: 900;
}

.ticket-chip.green {
  background: var(--soft-green);
  color: var(--green);
}

.ticket-detail-grid,
.decision-grid,
.bridge-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ticket-detail-grid .wide,
.decision-panel,
.ticket-packet-wrap {
  grid-column: 1 / -1;
}

.decision-panel {
  display: grid;
  gap: 10px;
}

.decision-grid label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.decision-grid select,
.decision-panel textarea {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.decision-panel textarea {
  min-height: 92px;
  margin-top: 0;
  resize: vertical;
}

.ticket-actions {
  grid-template-columns: repeat(3, minmax(0, max-content));
  align-items: center;
}

.ticket-packet {
  width: 100%;
  min-height: 210px;
  resize: vertical;
  border-color: var(--line);
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

@media (max-width: 980px) {
  .review-head,
  .ticket-summary,
  .ticket-shell,
  .ticket-detail-grid,
  .decision-grid,
  .bridge-rules {
    grid-template-columns: 1fr;
  }

  .review-mark {
    max-width: 150px;
  }

  .ticket-list {
    max-height: none;
  }
}

@media (max-width: 680px) {
  .ticket-actions,
  .ticket-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeBridgeJs() {
  write("assets/vedapath-review-ticket-bridge.js", `const reviewRoot = document.getElementById("reviewTicketBridge");

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
    .split(/\\s+/)
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
  ].join("\\n");
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
    const all = tickets.map((ticket) => ticketPacket(ticket, decisionFor(ticket))).join("\\n\\n---\\n\\n");
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
`);
}

function writeBridgePage() {
  write("reviewticketbridge.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Review Ticket Bridge</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-review-ticket-bridge.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Review ticket bridge</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link active" href="reviewticketbridge.html">Review</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Review Ticket Bridge workspace">
        <aside class="panel">
          <span class="eyebrow">Review bridge</span>
          <h2>Do not hide uncertainty</h2>
          <p class="muted">When a source needs review or a question has no verified record, VedaPath should create visible work instead of inventing certainty.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Detect</strong><p>Read eval outcome.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Classify</strong><p>Choose review lane.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Assign</strong><p>Name owner and severity.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Decide</strong><p>Save local review state.</p></div></div>
          </div>
        </aside>

        <section class="panel review-bridge" id="reviewTicketBridge">
          <div class="review-head">
            <div>
              <span class="eyebrow">Human review loop</span>
              <h1>Failed trust becomes visible work.</h1>
              <p class="muted">This bridge turns retrieval eval results into reviewer tickets with lane, owner, severity, boundary, and copyable handoff packets.</p>
            </div>
            <div class="review-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath review mark"></div>
          </div>

          <div class="ticket-summary" id="ticketSummary" aria-live="polite"></div>

          <section class="ticket-shell" aria-label="Review tickets">
            <div class="ticket-list" id="ticketList"></div>
            <div class="review-bridge">
              <div class="ticket-detail-grid" id="ticketDetail"></div>
              <div class="decision-panel">
                <h2>Reviewer Decision</h2>
                <div class="decision-grid">
                  <label for="ticketState">State<select id="ticketState"></select></label>
                  <label for="ticketOwner">Owner<select id="ticketOwner"></select></label>
                </div>
                <label for="ticketNote" class="ticket-packet-label">Reviewer note</label>
                <textarea id="ticketNote" placeholder="Add a short review note."></textarea>
                <div class="ticket-actions">
                  <button class="button primary" id="saveTicketDecision" type="button">Save Local Decision</button>
                  <button class="button safe" id="copyTicketPacket" type="button">Copy Ticket</button>
                  <button class="button" id="copyAllTickets" type="button">Copy All</button>
                </div>
              </div>
              <div>
                <h2>Bridge Contract</h2>
                <div class="bridge-rules" id="bridgeRules"></div>
              </div>
              <div class="ticket-packet-wrap">
                <label class="ticket-packet-label" for="ticketPacket">Copyable ticket packet</label>
                <textarea class="ticket-packet" id="ticketPacket" readonly></textarea>
              </div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Quality phase</span>
          <h2 style="margin-top: 14px;">Review Boundary</h2>
          <p class="muted">This is local prototype workflow. A future product needs accounts, permissions, reviewer identity, audit history, and source governance.</p>
          <div class="progress" aria-label="Review ticket bridge progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Inputs</span><strong>Eval</strong></div>
            <div class="metric"><span>Memory</span><strong>Local</strong></div>
            <div class="metric"><span>Next</span><strong>Queue</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Rule</h2>
            <p class="muted">No source expansion should ship without a visible path for review-needed and no-source cases.</p>
          </section>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="retrievalevaluation.html">Open Eval</a>
            <a class="button" href="data/vedapath-review-ticket-bridge.json">Open JSON</a>
          </div>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-review-ticket-bridge.js"></script>
  </body>
</html>
`);
}

function updateIndex() {
  let content = addReviewNav(updateVersionBadge(read("index.html")));
  if (!content.includes('href="reviewticketbridge.html">Review bridge')) {
    content = content.replace(
      '<a href="retrievalevaluation.html">Retrieval eval <span>tests</span></a>',
      '<a href="retrievalevaluation.html">Retrieval eval <span>tests</span></a>\n              <a href="reviewticketbridge.html">Review bridge <span>tickets</span></a>'
    );
  }
  if (!content.includes('href="reviewticketbridge.html">Tickets')) {
    content = content.replace(
      '<a href="reviewdesk.html">Review <span>desk</span></a>',
      '<a href="reviewdesk.html">Review <span>desk</span></a>\n              <a href="reviewticketbridge.html">Tickets <span>bridge</span></a>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = addReviewNav(updateVersionBadge(read("build-status.html")));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Reviewer Ticket Bridge: eval gaps, review-needed matches, and no-source cases now become visible reviewer work.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>72%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:72%"></div></div>
          <p>The trust loop now has a bridge from retrieval checks to human review packets.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Reviewer queue persistence</strong>
          <p>Move local review decisions toward durable queue records and accountable history.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 258: Reviewer Ticket Bridge</strong>
                <p>Turns retrieval eval gaps, review-needed matches, and no-source cases into visible reviewer tickets.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 258: Reviewer Ticket Bridge")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 258: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 259: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Reviewer Ticket Bridge</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.3 Retrieval Evaluation</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make trust failures become visible work.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for reviewer queue persistence</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Turn failed evals into reviewer queue cards\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Add owner and severity fields to source gaps\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Connect no-source cases to review intake\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep the Ask surface simple while review work grows\.<\/span><\/li>/, `<li><span class="dot"></span><span>Persist review decisions beyond browser storage.</span></li>
              <li><span class="dot"></span><span>Add reviewer identity and audit history.</span></li>
              <li><span class="dot"></span><span>Connect accepted tickets to source record updates.</span></li>
              <li><span class="dot"></span><span>Keep review work separate from user-facing answers.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH REVIEW TICKET BRIDGE START -->", "<!-- VEDAPATH REVIEW TICKET BRIDGE END -->", `## ${release} Reviewer Ticket Bridge

This release connects retrieval evaluation to human review work.

- adds \`data/vedapath-review-ticket-bridge.json\`
- adds \`reviewticketbridge.html\` as a browser-side reviewer ticket bridge
- generates tickets for eval failures, review-needed matches, and no-source gaps
- adds local reviewer decisions for state, owner, and note
- keeps uncertainty visible instead of silently changing answers`, "<!-- VEDAPATH RETRIEVAL EVALUATION START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH REVIEW TICKET BRIDGE NOTES START -->", "<!-- VEDAPATH REVIEW TICKET BRIDGE NOTES END -->", `## ${release} Reviewer Ticket Bridge

This phase turns evaluation results into review work.

Action taken:

- Added review-ticket bridge JSON.
- Added a live browser page that generates tickets from retrieval eval cases.
- Added local decision controls for state, owner, and reviewer note.
- Added copyable ticket packets for handoff.
- Set the next phase as reviewer queue persistence.`, "<!-- VEDAPATH RETRIEVAL EVALUATION NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH REVIEW TICKET BRIDGE BLUEPRINT START -->", "<!-- VEDAPATH REVIEW TICKET BRIDGE BLUEPRINT END -->", `### 277. Reviewer Ticket Bridge

VedaPath should make uncertainty operational.

Rules:

- Failed eval cases become review tickets.
- Review-needed source matches get an owner and next action.
- No-source questions become source gaps, not weak answers.
- Local decisions are prototype memory only.
- The production version needs reviewer identity, audit history, and durable queue storage.`, "<!-- VEDAPATH RETRIEVAL EVALUATION BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/REVIEW_TICKET_BRIDGE.md", `# VedaPath AI Review Ticket Bridge

Release: ${release}

This release turns retrieval evaluation outcomes into reviewer tickets.

## Files

- \`data/vedapath-review-ticket-bridge.json\`
- \`reviewticketbridge.html\`
- \`assets/vedapath-review-ticket-bridge.css\`
- \`assets/vedapath-review-ticket-bridge.js\`

## Ticket Sources

Tickets are created from:

- failed expected-source evals
- review-needed source matches
- no-source gaps

## Boundary

This is a browser-side prototype. It does not provide scholar approval, production queue storage, reviewer authentication, licensed source validation, therapy, ritual instruction, emergency support, or spiritual authority.
`);
}

writeBridgeData();
writeBridgeCss();
writeBridgeJs();
writeBridgePage();
updateAllHtmlShells();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} review ticket bridge applied.`);

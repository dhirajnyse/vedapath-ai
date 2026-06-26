const reviewStudioRoot = document.getElementById("reviewStudio");

if (reviewStudioRoot) {
  initReviewStudio().catch((error) => {
    reviewStudioRoot.innerHTML = '<p class="muted">Reviewer studio could not load review queue data.</p>';
    console.error(error);
  });
}

async function reviewLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function reviewText(value) {
  return value === 0 ? "0" : String(value || "");
}

function reviewSafe(value) {
  return reviewText(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function reviewStorageKey() {
  return "vedapath-reviewer-studio-decisions";
}

function readReviewDecisions() {
  try {
    return JSON.parse(localStorage.getItem(reviewStorageKey()) || "[]");
  } catch (error) {
    return [];
  }
}

function writeReviewDecisions(decisions) {
  localStorage.setItem(reviewStorageKey(), JSON.stringify(decisions.slice(0, 20)));
}

function selectedDecisionFor(item, decisions) {
  const hit = decisions.find((decision) => decision.id === item.id);
  return hit ? hit.decision : item.suggested_decision;
}

function publicEffect(decision) {
  const effects = {
    "hold": "Keep held; do not show as answer-ready.",
    "request-source": "Ask for stronger source evidence before display.",
    "approve-preview": "Allow reflection preview only; not production approval.",
    "block-overclaim": "Block public use until overclaim is rewritten."
  };
  return effects[decision] || effects.hold;
}

function handoffText(item, decision, decisions) {
  return [
    "VedaPath Reviewer Studio Handoff",
    "Review item: " + item.title,
    "Source candidate: " + item.source_candidate,
    "Text family: " + item.text_family,
    "Queue: " + item.queue,
    "Reviewer role: " + item.reviewer_role,
    "Decision: " + decision,
    "Public effect: " + publicEffect(decision),
    "Evidence needed: " + item.evidence_needed,
    "No-go: " + item.no_go,
    "Saved local decisions: " + decisions.length,
    "",
    "Boundary: browser-only review prototype; not scholar approval, legal clearance, production storage, public answer release, therapy, or spiritual authority."
  ].join("\n");
}

function renderReviewStats(root, items, filtered, decisions) {
  const high = items.filter((item) => item.severity === "high").length;
  root.querySelector("#reviewStats").innerHTML = [
    ["Items", items.length],
    ["Visible", filtered.length],
    ["High risk", high],
    ["Saved", decisions.length]
  ].map((row) => '<div class="review-stat"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></div>').join("");
}

async function initReviewStudio() {
  const queueData = await reviewLoadJson("data/vedapath-review-queue.json");
  const items = queueData.items || [];
  const filter = reviewStudioRoot.querySelector("#queueFilter");
  const chipsNode = reviewStudioRoot.querySelector("#reviewChips");
  const listNode = reviewStudioRoot.querySelector("#reviewList");
  const detailNode = reviewStudioRoot.querySelector("#reviewDetail");
  const decisionNode = reviewStudioRoot.querySelector("#decisionRow");
  const handoff = reviewStudioRoot.querySelector("#reviewHandoff");
  const auditNode = reviewStudioRoot.querySelector("#auditTrail");
  const queues = ["all", ...Array.from(new Set(items.map((item) => item.queue)))];
  const state = {
    queue: reviewStudioRoot.dataset.defaultQueue || "all",
    itemId: items[0] && items[0].id,
    decision: ""
  };

  filter.innerHTML = queues.map((queue) => (
    '<option value="' + reviewSafe(queue) + '">' + reviewSafe(queue) + '</option>'
  )).join("");

  function filteredItems() {
    return state.queue === "all" ? items : items.filter((item) => item.queue === state.queue);
  }

  function selectedItem() {
    const filtered = filteredItems();
    return filtered.find((item) => item.id === state.itemId) || filtered[0] || items[0];
  }

  function ensureSelected() {
    const item = selectedItem();
    state.itemId = item && item.id;
    return item;
  }

  function renderChips() {
    chipsNode.innerHTML = queues.map((queue) => (
      '<button class="review-chip' + (queue === state.queue ? ' active' : '') + '" type="button" data-queue="' + reviewSafe(queue) + '">' + reviewSafe(queue) + '</button>'
    )).join("");
  }

  function renderList(item) {
    const filtered = filteredItems();
    listNode.innerHTML = filtered.map((row) => (
      '<button class="review-card ' + reviewSafe(row.severity) + (row.id === item.id ? ' active' : '') + '" type="button" data-review-id="' + reviewSafe(row.id) + '">' +
        '<strong>' + reviewSafe(row.title) + '</strong>' +
        '<span>' + reviewSafe(row.source_candidate) + '</span>' +
        '<span>' + reviewSafe(row.queue + " | " + row.severity + " | " + row.reviewer_role) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderDetail(item, decision) {
    detailNode.innerHTML = [
      ["Source", item.source_candidate],
      ["Family", item.text_family],
      ["Queue", item.queue],
      ["Role", item.reviewer_role],
      ["Claim under review", item.claim_under_review, "wide"],
      ["Evidence needed", item.evidence_needed, "wide"],
      ["No-go", item.no_go, "wide"],
      ["Public effect", publicEffect(decision), "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + reviewSafe(row[0]) + '</span><strong>' + reviewSafe(row[1]) + '</strong></div>').join("");
  }

  function renderDecisionButtons(item, decision) {
    decisionNode.innerHTML = item.decision_options.map((option) => (
      '<button class="decision-button' + (option === decision ? ' active' : '') + '" type="button" data-decision="' + reviewSafe(option) + '">' + reviewSafe(option) + '</button>'
    )).join("");
  }

  function renderAudit(decisions) {
    if (!decisions.length) {
      auditNode.innerHTML = '<article class="audit-card"><strong>No local review decisions yet</strong><p class="muted">Save a decision and the local audit preview will begin.</p></article>';
      return;
    }
    auditNode.innerHTML = decisions.slice(0, 4).map((decision) => (
      '<article class="audit-card"><strong>' + reviewSafe(decision.decision) + '</strong><span>' + reviewSafe(decision.title) + '</span><p class="muted">' + reviewSafe(decision.source) + ' | ' + reviewSafe(decision.date) + '</p></article>'
    )).join("");
  }

  function render() {
    const decisions = readReviewDecisions();
    const item = ensureSelected();
    if (!item) return;
    const decision = state.decision || selectedDecisionFor(item, decisions);
    filter.value = state.queue;
    renderReviewStats(reviewStudioRoot, items, filteredItems(), decisions);
    renderChips();
    renderList(item);
    renderDetail(item, decision);
    renderDecisionButtons(item, decision);
    renderAudit(decisions);
    handoff.value = handoffText(item, decision, decisions);
  }

  filter.addEventListener("change", () => {
    state.queue = filter.value;
    state.itemId = (filteredItems()[0] || items[0]).id;
    state.decision = "";
    render();
  });

  chipsNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-queue]");
    if (!button) return;
    state.queue = button.dataset.queue;
    state.itemId = (filteredItems()[0] || items[0]).id;
    state.decision = "";
    render();
  });

  listNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-id]");
    if (!button) return;
    state.itemId = button.dataset.reviewId;
    state.decision = "";
    render();
  });

  decisionNode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-decision]");
    if (!button) return;
    state.decision = button.dataset.decision;
    render();
  });

  reviewStudioRoot.querySelector("#saveDecision").addEventListener("click", () => {
    const item = selectedItem();
    const decision = state.decision || item.suggested_decision;
    const decisions = readReviewDecisions().filter((row) => row.id !== item.id);
    decisions.unshift({
      id: item.id,
      title: item.title,
      source: item.source_candidate,
      queue: item.queue,
      decision,
      date: new Date().toISOString().slice(0, 10)
    });
    writeReviewDecisions(decisions);
    render();
  });

  reviewStudioRoot.querySelector("#clearReviewMemory").addEventListener("click", () => {
    localStorage.removeItem(reviewStorageKey());
    render();
  });

  reviewStudioRoot.querySelector("#copyReviewHandoff").addEventListener("click", () => {
    handoff.focus();
    handoff.select();
    const button = reviewStudioRoot.querySelector("#copyReviewHandoff");
    const originalText = button.textContent;
    const showCopied = () => {
      button.textContent = "Copied Handoff";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1400);
    };
    const fallbackCopy = () => {
      try {
        document.execCommand("copy");
      } catch (error) {
        return;
      }
      showCopied();
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(handoff.value).then(showCopied).catch(fallbackCopy);
      return;
    }
    fallbackCopy();
  });

  render();
}

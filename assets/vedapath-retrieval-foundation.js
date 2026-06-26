const retrievalRoot = document.getElementById("retrievalFoundation");

if (retrievalRoot) {
  initRetrievalFoundation().catch((error) => {
    retrievalRoot.innerHTML = '<article class="retrieval-empty"><strong>Retrieval records could not load.</strong><p class="muted">The static dataset is unavailable right now.</p></article>';
    console.error(error);
  });
}

const retrievalStopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "did", "do", "does", "for", "from",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "should", "that", "the", "to",
  "was", "what", "when", "where", "which", "with", "you"
]);

const retrievalNoSourceSignals = [
  "airplane",
  "airplanes",
  "aircraft",
  "vimana",
  "spaceship",
  "internet",
  "wifi",
  "stock market",
  "bitcoin",
  "lottery",
  "medical cure",
  "cancer cure"
];

function retrievalNormalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();
}

function retrievalTokens(value) {
  return retrievalNormalize(value)
    .split(/\s+/)
    .filter((token) => token && token.length > 1 && !retrievalStopWords.has(token));
}

function retrievalSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function retrievalScoreRecord(query, record) {
  const normalizedQuery = retrievalNormalize(query);
  const queryTokens = retrievalTokens(query);
  const reasons = [];
  let score = 0;
  const noSourceHits = retrievalNoSourceSignals.filter((term) => normalizedQuery.includes(term));

  for (const alias of record.aliases || []) {
    if (normalizedQuery.includes(retrievalNormalize(alias))) {
      score += 60;
      reasons.push("Exact alias: " + alias);
      break;
    }
  }

  for (const phrase of [record.question, record.title]) {
    const normalizedPhrase = retrievalNormalize(phrase);
    if (normalizedPhrase && (normalizedQuery.includes(normalizedPhrase) || normalizedPhrase.includes(normalizedQuery))) {
      score += 44;
      reasons.push("Question/title phrase match");
      break;
    }
  }

  const retrievalTerms = record.retrieval_terms || [];
  for (const term of retrievalTerms) {
    const normalizedTerm = retrievalNormalize(term);
    const termTokens = retrievalTokens(term);
    if (normalizedTerm && normalizedQuery.includes(normalizedTerm)) {
      score += 14;
      reasons.push("Curated term: " + term);
    } else if (termTokens.some((token) => queryTokens.includes(token))) {
      score += 9;
      reasons.push("Related term: " + term);
    }
  }

  const sourceTokens = retrievalTokens([record.source, record.source_family, record.tradition_layer].join(" "));
  const sourceHits = [...new Set(sourceTokens.filter((token) => queryTokens.includes(token)))];
  if (sourceHits.length) {
    score += Math.min(24, sourceHits.length * 8);
    reasons.push("Source/family terms: " + sourceHits.slice(0, 4).join(", "));
  }

  const bodyTokens = retrievalTokens([record.summary, record.boundary, record.caution, ...(record.blocked_claims || [])].join(" "));
  const bodyHits = [...new Set(bodyTokens.filter((token) => queryTokens.includes(token)))];
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
    status: score >= 24 && record.readiness === "answer-preview-ready" ? "answer-ready" : score >= 14 ? "review-needed" : "no-source"
  };
}

function retrievalRank(query, records) {
  return records
    .map((record) => retrievalScoreRecord(query, record))
    .sort((a, b) => b.score - a.score);
}

function retrievalTrace(query, ranked, config) {
  const top = ranked[0];
  if (!top || top.score < config.threshold.review_needed) {
    return [
      "VedaPath Retrieval Trace",
      "Query: " + query,
      "Result: no verified source record yet",
      "Boundary: do not force a weak answer.",
      "Next: create a review ticket with likely source family and missing evidence."
    ].join("\n");
  }
  return [
    "VedaPath Retrieval Trace",
    "Query: " + query,
    "Top record: " + top.record.id,
    "Source: " + top.record.source,
    "Family: " + top.record.source_family,
    "Score: " + top.score,
    "Status: " + top.status,
    "Readiness: " + top.record.readiness,
    "Confidence: " + top.record.confidence,
    "Reasons:",
    ...top.reasons.map((reason) => "- " + reason),
    "",
    "Boundary: " + top.record.boundary
  ].join("\n");
}

async function retrievalLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

async function initRetrievalFoundation() {
  const [config, dataset] = await Promise.all([
    retrievalLoadJson("data/vedapath-retrieval-foundation.json"),
    retrievalLoadJson("data/vedapath-source-answer-foundation.json")
  ]);
  const records = dataset.records || [];
  const query = retrievalRoot.querySelector("#retrievalQuery");
  const sampleList = retrievalRoot.querySelector("#retrievalSamples");
  const candidates = retrievalRoot.querySelector("#retrievalCandidates");
  const status = retrievalRoot.querySelector("#retrievalStatus");
  const stats = retrievalRoot.querySelector("#retrievalStats");
  const rules = retrievalRoot.querySelector("#retrievalRules");
  const trace = retrievalRoot.querySelector("#retrievalTrace");
  const copyButton = retrievalRoot.querySelector("#copyRetrievalTrace");
  const searchButton = retrievalRoot.querySelector("#runRetrieval");

  query.value = config.sample_queries[0];

  sampleList.innerHTML = config.sample_queries.map((item) => (
    '<button type="button" data-query="' + retrievalSafe(item) + '">' + retrievalSafe(item) + '</button>'
  )).join("");

  rules.innerHTML = config.scoring_rules.map((rule) => (
    '<article class="retrieval-rule"><span>' + retrievalSafe(rule[0]) + '</span><strong>+' + retrievalSafe(rule[1]) + '</strong><p>' + retrievalSafe(rule[2]) + '</p></article>'
  )).join("");

  function render() {
    const ranked = retrievalRank(query.value, records);
    const top = ranked[0];
    const ready = ranked.filter((item) => item.status === "answer-ready").length;
    const review = ranked.filter((item) => item.status === "review-needed").length;
    const resultText = top && top.score >= config.threshold.answer_ready ? "Answer-ready" : top && top.score >= config.threshold.review_needed ? "Review-needed" : "No source";

    stats.innerHTML = [
      ["Records", records.length],
      ["Answer-ready", ready],
      ["Review-needed", review],
      ["Top score", top ? top.score : 0]
    ].map((row) => '<div class="retrieval-stat"><span>' + retrievalSafe(row[0]) + '</span><strong>' + retrievalSafe(row[1]) + '</strong></div>').join("");

    if (!top || top.score < config.threshold.review_needed) {
      status.innerHTML = '<span>' + retrievalSafe(resultText) + '</span><strong>' + retrievalSafe(config.no_source_policy.title) + '</strong><p>' + retrievalSafe(config.no_source_policy.summary) + '</p>';
    } else {
      status.innerHTML = '<span>' + retrievalSafe(resultText) + '</span><strong>' + retrievalSafe(top.record.title) + '</strong><p>' + retrievalSafe(top.reasons.slice(0, 3).join(" | ")) + '</p>';
    }

    candidates.innerHTML = ranked.slice(0, 5).map((item, index) => (
      '<button class="retrieval-card' + (index === 0 ? ' active' : '') + '" type="button" data-id="' + retrievalSafe(item.record.id) + '">' +
        '<span class="score">' + retrievalSafe(item.score) + '</span>' +
        '<strong>' + retrievalSafe(item.record.question) + '</strong>' +
        '<span>' + retrievalSafe(item.record.source) + '</span>' +
        '<span>' + retrievalSafe(item.status + " | " + item.record.readiness) + '</span>' +
      '</button>'
    )).join("");

    trace.value = retrievalTrace(query.value, ranked, config);
  }

  sampleList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-query]");
    if (!button) return;
    query.value = button.dataset.query;
    render();
  });

  searchButton.addEventListener("click", render);
  query.addEventListener("input", render);

  copyButton.addEventListener("click", () => {
    trace.focus();
    trace.select();
    const original = copyButton.textContent;
    const copied = () => {
      copyButton.textContent = "Copied Trace";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(trace.value).then(copied).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      copied();
    } catch (error) {}
  });

  render();
}

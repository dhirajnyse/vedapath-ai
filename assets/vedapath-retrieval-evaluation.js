const evalRoot = document.getElementById("retrievalEvaluation");

if (evalRoot) {
  initRetrievalEvaluation().catch((error) => {
    evalRoot.innerHTML = '<article class="eval-report"><strong>Evaluation cases could not load.</strong></article>';
    console.error(error);
  });
}

const evalStopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "did", "do", "does", "for", "from",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "should", "that", "the", "to",
  "was", "what", "when", "where", "which", "with", "you"
]);

function evalNormalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();
}

function evalTokens(value) {
  return evalNormalize(value)
    .split(/\s+/)
    .filter((token) => token && token.length > 1 && !evalStopWords.has(token));
}

function evalSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function evalScoreRecord(query, record, config) {
  const normalizedQuery = evalNormalize(query);
  const queryTokens = evalTokens(query);
  const noSourceSignals = config.no_source_signals || [];
  const noSourceHits = noSourceSignals.filter((term) => normalizedQuery.includes(term));
  const reasons = [];
  let score = 0;

  for (const alias of record.aliases || []) {
    if (normalizedQuery.includes(evalNormalize(alias))) {
      score += 60;
      reasons.push("Exact alias: " + alias);
      break;
    }
  }

  for (const phrase of [record.question, record.title]) {
    const normalizedPhrase = evalNormalize(phrase);
    if (normalizedPhrase && (normalizedQuery.includes(normalizedPhrase) || normalizedPhrase.includes(normalizedQuery))) {
      score += 44;
      reasons.push("Question/title phrase match");
      break;
    }
  }

  for (const term of record.retrieval_terms || []) {
    const normalizedTerm = evalNormalize(term);
    const termTokens = evalTokens(term);
    if (normalizedTerm && normalizedQuery.includes(normalizedTerm)) {
      score += 14;
      reasons.push("Curated term: " + term);
    } else if (termTokens.some((token) => queryTokens.includes(token))) {
      score += 9;
      reasons.push("Related term: " + term);
    }
  }

  const sourceHits = [...new Set(evalTokens([record.source, record.source_family, record.tradition_layer].join(" ")).filter((token) => queryTokens.includes(token)))];
  if (sourceHits.length) {
    score += Math.min(24, sourceHits.length * 8);
    reasons.push("Source/family terms: " + sourceHits.slice(0, 4).join(", "));
  }

  const bodyHits = [...new Set(evalTokens([record.summary, record.boundary, record.caution, ...(record.blocked_claims || [])].join(" ")).filter((token) => queryTokens.includes(token)))];
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

function evalRank(query, records, config) {
  return records
    .map((record) => evalScoreRecord(query, record, config))
    .sort((a, b) => b.score - a.score);
}

function evaluateRetrievalCases(cases, records, config) {
  return cases.map((testCase) => {
    const ranked = evalRank(testCase.query, records, config);
    const top = ranked[0] || null;
    const actualSlug = top && top.score >= config.threshold.review_needed ? top.record.slug : "no-source";
    const actualStatus = top && top.score >= config.threshold.review_needed ? top.status : "no-source";
    const score = top ? top.score : 0;
    const slugPass = actualSlug === testCase.expected_slug;
    const statusPass = actualStatus === testCase.expected_status;
    const minPass = testCase.minimum_score === undefined || score >= testCase.minimum_score;
    const maxPass = testCase.maximum_score === undefined || score <= testCase.maximum_score;
    const pass = slugPass && statusPass && minPass && maxPass;
    return {
      ...testCase,
      pass,
      actual_slug: actualSlug,
      actual_status: actualStatus,
      actual_score: score,
      actual_source: top && top.score >= config.threshold.review_needed ? top.record.source : "No matching source record",
      actual_family: top && top.score >= config.threshold.review_needed ? top.record.source_family : "Unverified | Review needed",
      reasons: top ? top.reasons : [],
      top_candidates: ranked.slice(0, 3).map((item) => ({
        slug: item.record.slug,
        score: item.score,
        status: item.status,
        source: item.record.source
      }))
    };
  });
}

function evalReport(results, data) {
  const passed = results.filter((result) => result.pass).length;
  return [
    "VedaPath Retrieval Evaluation",
    "Release: " + data.release,
    "Cases: " + results.length,
    "Passed: " + passed,
    "Failed: " + (results.length - passed),
    "",
    ...results.map((result) => [
      (result.pass ? "PASS " : "FAIL ") + result.id,
      "Query: " + result.query,
      "Expected: " + result.expected_slug + " / " + result.expected_status,
      "Actual: " + result.actual_slug + " / " + result.actual_status + " / score " + result.actual_score,
      "Reason: " + result.reason
    ].join("\n"))
  ].join("\n\n");
}

async function evalLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

async function initRetrievalEvaluation() {
  const [data, config, sourceData] = await Promise.all([
    evalLoadJson("data/vedapath-retrieval-eval-cases.json"),
    evalLoadJson("data/vedapath-retrieval-foundation.json"),
    evalLoadJson("data/vedapath-source-answer-foundation.json")
  ]);
  const records = sourceData.records || [];
  const results = evaluateRetrievalCases(data.cases || [], records, config);
  let activeId = results[0] && results[0].id;

  const summary = evalRoot.querySelector("#evalSummary");
  const list = evalRoot.querySelector("#evalCaseList");
  const detail = evalRoot.querySelector("#evalDetail");
  const report = evalRoot.querySelector("#evalReport");
  const rules = evalRoot.querySelector("#evalRules");
  const copy = evalRoot.querySelector("#copyEvalReport");

  rules.innerHTML = [
    ["Pass rule", data.pass_rule],
    ["Boundary", data.warning],
    ["Config", data.retrieval_config],
    ["Source", data.source_dataset]
  ].map((row) => '<article class="eval-rule"><span>' + evalSafe(row[0]) + '</span><strong>' + evalSafe(row[1]) + '</strong></article>').join("");

  function activeResult() {
    return results.find((result) => result.id === activeId) || results[0];
  }

  function renderSummary() {
    const passed = results.filter((result) => result.pass).length;
    const failed = results.length - passed;
    const answerReady = results.filter((result) => result.actual_status === "answer-ready").length;
    const reviewNeeded = results.filter((result) => result.actual_status === "review-needed").length;
    const noSource = results.filter((result) => result.actual_status === "no-source").length;
    summary.innerHTML = [
      ["Cases", results.length],
      ["Passed", passed],
      ["Failed", failed],
      ["Review", reviewNeeded],
      ["No-source", noSource]
    ].map((row) => '<div class="eval-stat"><span>' + evalSafe(row[0]) + '</span><strong>' + evalSafe(row[1]) + '</strong></div>').join("");
  }

  function renderList() {
    list.innerHTML = results.map((result) => (
      '<button class="eval-case ' + (result.pass ? 'pass' : 'fail') + (result.id === activeId ? ' active' : '') + '" type="button" data-id="' + evalSafe(result.id) + '">' +
        '<span class="eval-chip ' + (result.pass ? '' : 'fail') + '">' + (result.pass ? 'Pass' : 'Fail') + '</span>' +
        '<strong>' + evalSafe(result.query) + '</strong>' +
        '<span>Expected ' + evalSafe(result.expected_slug + " / " + result.expected_status) + '</span>' +
        '<span>Actual ' + evalSafe(result.actual_slug + " / " + result.actual_status + " / " + result.actual_score) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderDetail() {
    const result = activeResult();
    detail.innerHTML = [
      ["Case", result.id],
      ["Result", result.pass ? "Pass" : "Fail"],
      ["Expected", result.expected_slug + " / " + result.expected_status],
      ["Actual", result.actual_slug + " / " + result.actual_status],
      ["Score", result.actual_score],
      ["Risk", result.risk],
      ["Source", result.actual_source, "wide"],
      ["Family", result.actual_family, "wide"],
      ["Why this matters", result.reason, "wide"],
      ["Reasons", result.reasons.join(" | ") || "No match reasons", "wide"],
      ["Top candidates", result.top_candidates.map((item) => item.slug + " " + item.score + " " + item.status).join(" | "), "wide"]
    ].map((row) => '<div class="' + (row[2] || "") + '"><span>' + evalSafe(row[0]) + '</span><strong>' + evalSafe(row[1]) + '</strong></div>').join("");
  }

  function renderReport() {
    report.value = evalReport(results, data);
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    activeId = button.dataset.id;
    renderList();
    renderDetail();
  });

  copy.addEventListener("click", () => {
    report.focus();
    report.select();
    const original = copy.textContent;
    const copied = () => {
      copy.textContent = "Copied Report";
      window.setTimeout(() => {
        copy.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(report.value).then(copied).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      copied();
    } catch (error) {}
  });

  renderSummary();
  renderList();
  renderDetail();
  renderReport();
}

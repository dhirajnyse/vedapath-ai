import fs from "node:fs";
import path from "node:path";

const release = "v2.9.3";
const badge = `${release} eval`;

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

function updateAllHtmlVersions() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, updateVersionBadge(read(file)));
  }
  const brandFile = path.join("brand", "brand-board.html");
  write(brandFile, updateVersionBadge(read(brandFile)));
}

function writeEvalDataset() {
  const data = {
    product: "VedaPath AI",
    release,
    status: "retrieval evaluation v1",
    schema_version: "retrieval-eval-v1",
    retrieval_config: "data/vedapath-retrieval-foundation.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    warning: "Evaluation cases check static retrieval behavior only. Passing cases do not mean broad corpus coverage, scholar approval, licensed source text display, therapy, ritual instruction, emergency support, or spiritual authority.",
    pass_rule: "A case passes when the top retrieval result has the expected slug and expected status, or when a no-source case stays below the review-needed threshold.",
    cases: [
      {
        id: "eval-oppenheimer-source",
        query: "What scripture did Oppenheimer quote?",
        expected_slug: "oppenheimer",
        expected_status: "answer-ready",
        expected_family: "Bhagavad Gita | Smriti",
        minimum_score: 24,
        risk: "category confusion",
        reason: "The product should correct the common Vedas-versus-Gita confusion with a direct source candidate."
      },
      {
        id: "eval-gita-classification",
        query: "Is the Gita one of the Vedas?",
        expected_slug: "gita-veda",
        expected_status: "answer-ready",
        expected_family: "Bhagavad Gita | Smriti",
        minimum_score: 24,
        risk: "source family confusion",
        reason: "The Gita classification record must outrank generic Gita/Veda overlap."
      },
      {
        id: "eval-gayatri-review-needed",
        query: "Explain Gayatri mantra carefully",
        expected_slug: "gayatri",
        expected_status: "review-needed",
        expected_family: "Veda | Shruti",
        minimum_score: 14,
        risk: "ritual overreach",
        reason: "The Gayatri record can be found, but should stay review-needed until Sanskrit and recitation boundaries are stronger."
      },
      {
        id: "eval-quantum-boundary",
        query: "Do the Vedas prove quantum physics?",
        expected_slug: "quantum",
        expected_status: "answer-ready",
        expected_family: "Modern claim | Cross-domain analogy",
        minimum_score: 24,
        risk: "modern science overclaim",
        reason: "The claim checker should route broad science-proof language to the analogy boundary record."
      },
      {
        id: "eval-atman-commentary",
        query: "How should I understand Atman and Brahman?",
        expected_slug: "atman",
        expected_status: "review-needed",
        expected_family: "Upanishad | Shruti",
        minimum_score: 14,
        risk: "one-school flattening",
        reason: "Atman and Brahman should be discoverable but remain commentary-lane until comparison views are stronger."
      },
      {
        id: "eval-steady-action",
        query: "How can I act calmly when results are uncertain?",
        expected_slug: "steady-action",
        expected_status: "answer-ready",
        expected_family: "Bhagavad Gita | Smriti",
        minimum_score: 24,
        risk: "personal advice overreach",
        reason: "Calm-path questions should route to a bounded reflection record, not therapy or command language."
      },
      {
        id: "eval-airplane-no-source",
        query: "Did the Vedas describe airplanes?",
        expected_slug: "no-source",
        expected_status: "no-source",
        maximum_score: 13,
        risk: "unsupported technology claim",
        reason: "Unsupported modern-technology claims should produce a source gap instead of a weak answer."
      },
      {
        id: "eval-bitcoin-no-source",
        query: "Do the Vedas predict bitcoin?",
        expected_slug: "no-source",
        expected_status: "no-source",
        maximum_score: 13,
        risk: "unsupported finance claim",
        reason: "No reviewed source record should be forced onto a modern finance prediction."
      },
      {
        id: "eval-gita-part-of-vedas",
        query: "Is the Bhagavad Gita part of Vedas?",
        expected_slug: "gita-veda",
        expected_status: "answer-ready",
        expected_family: "Bhagavad Gita | Smriti",
        minimum_score: 24,
        risk: "wording variation",
        reason: "A common alternate wording should still reach the classification record."
      },
      {
        id: "eval-gita-248-results",
        query: "What does Gita 2.48 suggest when I am anxious about results?",
        expected_slug: "steady-action",
        expected_status: "answer-ready",
        expected_family: "Bhagavad Gita | Smriti",
        minimum_score: 24,
        risk: "calm advice overreach",
        reason: "Gita 2.48 result-anxiety wording should route to the steady-action source candidate."
      }
    ]
  };
  write("data/vedapath-retrieval-eval-cases.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeEvalCss() {
  write("assets/vedapath-retrieval-evaluation.css", `/* VedaPath retrieval evaluation */
.eval-workspace {
  display: grid;
  gap: 16px;
}

.eval-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  gap: 16px;
  align-items: center;
}

.eval-mark {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 12px;
}

.eval-mark img {
  display: block;
  width: 100%;
}

.eval-summary,
.eval-layout,
.eval-case-list,
.eval-detail-grid,
.eval-actions,
.eval-rules {
  display: grid;
  gap: 10px;
}

.eval-summary {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.eval-stat,
.eval-case,
.eval-detail-grid > div,
.eval-rule,
.eval-report {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.eval-stat,
.eval-case,
.eval-detail-grid > div,
.eval-rule {
  padding: 12px;
}

.eval-stat span,
.eval-case span,
.eval-detail-grid span,
.eval-rule span,
.eval-report-label {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.eval-stat strong {
  display: block;
  font-size: 24px;
  line-height: 1.05;
}

.eval-layout {
  grid-template-columns: minmax(260px, 0.88fr) minmax(0, 1.12fr);
  align-items: start;
}

.eval-case {
  width: 100%;
  color: inherit;
  text-align: left;
}

.eval-case strong,
.eval-detail-grid strong,
.eval-rule strong {
  display: block;
}

.eval-case.pass {
  border-left: 4px solid var(--peacock-green);
}

.eval-case.fail {
  border-left: 4px solid var(--bhagwa);
}

.eval-case.active {
  background: #fff0e7;
  border-color: #f09f79;
}

.eval-chip {
  display: inline-flex;
  width: fit-content;
  min-height: 26px;
  align-items: center;
  border-radius: 999px;
  padding: 3px 9px;
  background: rgba(232, 240, 234, 0.72);
  color: var(--peacock-green);
  font-size: 12px;
  font-weight: 900;
}

.eval-chip.fail {
  background: #fde8dd;
  color: var(--deep-ochre);
}

.eval-detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.eval-detail-grid .wide {
  grid-column: 1 / -1;
}

.eval-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.eval-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  align-items: center;
}

.eval-report-label {
  margin-bottom: 8px;
}

.eval-report {
  width: 100%;
  min-height: 220px;
  resize: vertical;
  border-color: var(--line);
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
  font-family: Arial, Helvetica, sans-serif;
}

@media (max-width: 940px) {
  .eval-head,
  .eval-summary,
  .eval-layout,
  .eval-detail-grid,
  .eval-rules {
    grid-template-columns: 1fr;
  }

  .eval-mark {
    max-width: 170px;
  }
}

@media (max-width: 680px) {
  .eval-actions,
  .eval-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeEvalJs() {
  write("assets/vedapath-retrieval-evaluation.js", `const evalRoot = document.getElementById("retrievalEvaluation");

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
    .split(/\\s+/)
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
    ].join("\\n"))
  ].join("\\n\\n");
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
`);
}

function writeEvalPage() {
  write("retrievalevaluation.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Retrieval Evaluation</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-retrieval-evaluation.css">
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
            <span>Retrieval evaluation</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Retrieval Evaluation workspace">
        <aside class="panel">
          <span class="eyebrow">Eval v1</span>
          <h2>Trust by tests</h2>
          <p class="muted">A retrieval answer should not merely sound right. It should pass expected-source checks before the corpus grows.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Case</strong><p>Define the query.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Expect</strong><p>Name source and status.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Run</strong><p>Score actual retrieval.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Gate</strong><p>Pass before expansion.</p></div></div>
          </div>
        </aside>

        <section class="panel eval-workspace" id="retrievalEvaluation">
          <div class="eval-head">
            <div>
              <span class="eyebrow">Retrieval evaluation</span>
              <h1>Expected source. Actual source. Clear result.</h1>
              <p class="muted">This page runs the starter retrieval questions against the source-answer records and flags whether the chosen source, readiness status, and score boundary match expectation.</p>
            </div>
            <div class="eval-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath evaluation mark"></div>
          </div>

          <div class="eval-summary" id="evalSummary" aria-live="polite"></div>

          <section class="eval-layout" aria-label="Retrieval evaluation cases">
            <div class="eval-case-list" id="evalCaseList"></div>
            <div class="eval-workspace">
              <div class="eval-detail-grid" id="evalDetail"></div>
              <div>
                <h2>Evaluation Contract</h2>
                <div class="eval-rules" id="evalRules"></div>
              </div>
              <div class="eval-actions">
                <button class="button primary" id="copyEvalReport" type="button">Copy Eval Report</button>
                <a class="button safe" href="data/vedapath-retrieval-eval-cases.json">Open Eval JSON</a>
              </div>
              <label class="eval-report-label" for="evalReport">Copyable evaluation report</label>
              <textarea class="eval-report" id="evalReport" readonly></textarea>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Quality phase</span>
          <h2 style="margin-top: 14px;">Eval Boundary</h2>
          <p class="muted">This is a static retrieval evaluation harness. It tests routing behavior, not scholarship completeness or production RAG quality.</p>
          <div class="progress" aria-label="Retrieval evaluation progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Cases</span><strong>10</strong></div>
            <div class="metric"><span>Mode</span><strong>Static</strong></div>
            <div class="metric"><span>Next</span><strong>Review</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Expansion Rule</h2>
            <p class="muted">Add more source records only after the current expected-source tests keep passing.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-retrieval-evaluation.js"></script>
  </body>
</html>
`);
}

function updateIndex() {
  let content = updateVersionBadge(read("index.html"));
  if (!content.includes('href="retrievalevaluation.html"')) {
    content = content.replace(
      '<a href="retrievalfoundation.html">Retrieval <span>reasons</span></a>',
      '<a href="retrievalfoundation.html">Retrieval <span>reasons</span></a>\n              <a href="retrievalevaluation.html">Retrieval eval <span>tests</span></a>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = updateVersionBadge(read("build-status.html"));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Retrieval Evaluation: expected-source cases now test source choice, status, score boundaries, and no-source behavior.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>71%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:71%"></div></div>
          <p>The retrieval layer now has a small quality gate before source expansion.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Review ticket bridge</strong>
          <p>Turn failed evals and no-source cases into visible reviewer queue cards.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 257: Retrieval Evaluation</strong>
                <p>Adds expected-source eval cases, a pass/fail runner, score boundaries, and copyable evaluation reports.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 257: Retrieval Evaluation")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 257: Production Implementation and Licensed Audio<\/strong>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 258: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Retrieval Evaluation</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.2 Retrieval Foundation</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Test source selection before growing the corpus.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for reviewer ticket bridge</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Add expected-source eval cases for every starter query\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Tune thresholds for answer-ready versus review-needed\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Connect retrieval traces to reviewer queue tickets\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Expand records only after the eval loop is visible\.<\/span><\/li>/, `<li><span class="dot"></span><span>Turn failed evals into reviewer queue cards.</span></li>
              <li><span class="dot"></span><span>Add owner and severity fields to source gaps.</span></li>
              <li><span class="dot"></span><span>Connect no-source cases to review intake.</span></li>
              <li><span class="dot"></span><span>Keep the Ask surface simple while review work grows.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH RETRIEVAL EVALUATION START -->", "<!-- VEDAPATH RETRIEVAL EVALUATION END -->", `## ${release} Retrieval Evaluation

This release adds the first quality gate for source selection.

- adds \`data/vedapath-retrieval-eval-cases.json\`
- adds \`retrievalevaluation.html\` as a pass/fail evaluation runner
- checks expected source slug, expected status, score boundaries, and no-source behavior
- keeps unsupported modern claims below the review-needed threshold
- prepares the reviewer ticket bridge for failed evals and source gaps`, "<!-- VEDAPATH RETRIEVAL FOUNDATION START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH RETRIEVAL EVALUATION NOTES START -->", "<!-- VEDAPATH RETRIEVAL EVALUATION NOTES END -->", `## ${release} Retrieval Evaluation

This phase makes retrieval quality visible.

Action taken:

- Added expected-source eval cases for common starter queries.
- Added an evaluation runner page with pass/fail cards.
- Added score boundary checks for no-source cases.
- Added a copyable evaluation report for review handoff.
- Set the next phase as reviewer ticket bridge.`, "<!-- VEDAPATH RETRIEVAL FOUNDATION NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH RETRIEVAL EVALUATION BLUEPRINT START -->", "<!-- VEDAPATH RETRIEVAL EVALUATION BLUEPRINT END -->", `### 276. Retrieval Evaluation

VedaPath should not expand its corpus faster than it can test retrieval.

Rules:

- Every starter query needs an expected source or expected no-source state.
- Review-needed records may be found but should not be treated as answer-ready.
- Unsupported modern claims should remain below the review-needed threshold.
- Failed evals become reviewer work, not silent tuning.
- The next build should connect failures to reviewer queue cards.`, "<!-- VEDAPATH RETRIEVAL FOUNDATION BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/RETRIEVAL_EVALUATION.md", `# VedaPath AI Retrieval Evaluation

Release: ${release}

This release adds expected-source evaluation cases for the static retrieval layer.

## Files

- \`data/vedapath-retrieval-eval-cases.json\`
- \`retrievalevaluation.html\`
- \`assets/vedapath-retrieval-evaluation.css\`
- \`assets/vedapath-retrieval-evaluation.js\`

## Evaluation Checks

Each case checks:

- expected top source slug
- expected result status
- score minimum or maximum
- actual source family
- visible match reasons

## Boundary

This is a static retrieval evaluation harness. It does not prove broad source coverage, scholar approval, licensed source display, therapy, ritual instruction, emergency support, or spiritual authority.
`);
}

writeEvalDataset();
writeEvalCss();
writeEvalJs();
writeEvalPage();
updateAllHtmlVersions();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} retrieval evaluation applied.`);

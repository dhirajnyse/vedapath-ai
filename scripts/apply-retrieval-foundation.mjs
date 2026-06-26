import fs from "node:fs";
import path from "node:path";

const release = "v2.9.2";
const badge = `${release} retrieval`;

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

function writeRetrievalFoundationData() {
  const data = {
    product: "VedaPath AI",
    release,
    status: "retrieval foundation v1",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    schema_version: "retrieval-foundation-v1",
    threshold: {
      answer_ready: 24,
      review_needed: 14
    },
    warning: "Static retrieval scoring over starter records only. This is not semantic search, live RAG, scholar approval, licensed text display, therapy, ritual instruction, emergency support, or spiritual authority.",
    no_source_signals: [
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
    ],
    sample_queries: [
      "What scripture did Oppenheimer quote?",
      "Is the Gita one of the Vedas?",
      "Explain Gayatri mantra carefully",
      "Do the Vedas prove quantum physics?",
      "How should I understand Atman and Brahman?",
      "How can I act calmly when results are uncertain?",
      "Did the Vedas describe airplanes?"
    ],
    scoring_rules: [
      ["Exact alias", 60, "Strong match to a reviewed question wording."],
      ["Question or title phrase", 44, "User language resembles a record question or answer title."],
      ["Retrieval term", 14, "Curated term appears in the query."],
      ["Source or family term", 8, "Citation or source family appears in the query."],
      ["Summary or boundary term", 3, "Supporting language appears in the record body."],
      ["Preview-ready bonus", 12, "Record can currently render an answer preview."],
      ["Review-needed bonus", 4, "Record exists but needs a stronger review lane."]
    ],
    no_source_policy: {
      title: "No verified source record yet.",
      summary: "When the starter dataset cannot support a question, VedaPath should pause instead of forcing a weak answer.",
      next_action: "Create a review ticket with the user question, likely source family, and missing evidence."
    }
  };
  write("data/vedapath-retrieval-foundation.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeRetrievalFoundationCss() {
  write("assets/vedapath-retrieval-foundation.css", `/* VedaPath retrieval foundation */
.retrieval-foundation {
  display: grid;
  gap: 16px;
}

.retrieval-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 16px;
  align-items: center;
}

.retrieval-mark {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 12px;
}

.retrieval-mark img {
  width: 100%;
  display: block;
}

.retrieval-search {
  display: grid;
  gap: 10px;
}

.retrieval-search label,
.retrieval-match-status span,
.retrieval-card span,
.retrieval-stat span,
.retrieval-rule span,
.retrieval-trace label {
  color: var(--muted);
  font-size: 12px;
}

.retrieval-search textarea,
.retrieval-trace textarea {
  width: 100%;
  min-height: 108px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
  font-weight: 760;
  resize: vertical;
}

.retrieval-samples,
.retrieval-actions,
.retrieval-rules,
.retrieval-grid,
.retrieval-stats,
.retrieval-card-list {
  display: grid;
  gap: 10px;
}

.retrieval-samples {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.retrieval-samples button,
.retrieval-card,
.retrieval-rule,
.retrieval-stat,
.retrieval-match-status,
.retrieval-empty {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.retrieval-samples button {
  min-height: 44px;
  color: var(--deep-ochre);
  padding: 10px;
  text-align: left;
  font-weight: 850;
}

.retrieval-samples button:hover,
.retrieval-samples button:focus-visible,
.retrieval-card.active {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.retrieval-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  align-items: center;
}

.retrieval-match-status {
  border-left: 4px solid var(--bhagwa);
  padding: 12px;
}

.retrieval-match-status strong,
.retrieval-card strong,
.retrieval-stat strong,
.retrieval-rule strong {
  display: block;
}

.retrieval-grid {
  grid-template-columns: minmax(230px, 0.82fr) minmax(0, 1.18fr);
  align-items: start;
}

.retrieval-card {
  width: 100%;
  padding: 12px;
  color: inherit;
  text-align: left;
}

.retrieval-card .score {
  display: inline-grid;
  place-items: center;
  min-width: 42px;
  height: 30px;
  margin-bottom: 8px;
  border-radius: 999px;
  background: rgba(224, 168, 59, 0.22);
  color: var(--deep-ochre);
  font-weight: 900;
}

.retrieval-detail {
  display: grid;
  gap: 12px;
}

.retrieval-stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.retrieval-stat,
.retrieval-rule,
.retrieval-empty {
  padding: 12px;
}

.retrieval-stat strong {
  font-size: 22px;
  line-height: 1.1;
}

.retrieval-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.retrieval-rule {
  min-height: 108px;
}

.retrieval-trace {
  display: grid;
  gap: 8px;
}

.retrieval-trace textarea {
  min-height: 230px;
  font-family: Arial, Helvetica, sans-serif;
}

.retrieval-home-status {
  margin-top: 12px;
  border: 1px solid rgba(224, 168, 59, 0.34);
  border-radius: 8px;
  background: rgba(224, 168, 59, 0.12);
  color: var(--deep-ochre);
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 850;
}

@media (max-width: 920px) {
  .retrieval-head,
  .retrieval-grid,
  .retrieval-stats,
  .retrieval-rules,
  .retrieval-samples {
    grid-template-columns: 1fr;
  }

  .retrieval-mark {
    max-width: 180px;
  }
}

@media (max-width: 680px) {
  .retrieval-actions,
  .retrieval-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeRetrievalFoundationJs() {
  write("assets/vedapath-retrieval-foundation.js", `const retrievalRoot = document.getElementById("retrievalFoundation");

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
    .split(/\\s+/)
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
    ].join("\\n");
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
  ].join("\\n");
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
`);
}

function writeRetrievalFoundationPage() {
  write("retrievalfoundation.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Retrieval Foundation</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-retrieval-foundation.css">
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
            <span>Retrieval foundation</span>
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

      <main class="workspace" aria-label="VedaPath Retrieval Foundation workspace">
        <aside class="panel">
          <span class="eyebrow">Retrieval v1</span>
          <h2>Search before answer</h2>
          <p class="muted">A calm static retrieval layer over the first answer records. It shows why a source was selected and when VedaPath should pause.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Ask</strong><p>Read the user question.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Rank</strong><p>Score source-answer records.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Explain</strong><p>Show match reasons.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Pause</strong><p>Use no-source fallback.</p></div></div>
          </div>
        </aside>

        <section class="panel retrieval-foundation" id="retrievalFoundation">
          <div class="retrieval-head">
            <div>
              <span class="eyebrow">Static retrieval foundation</span>
              <h1>Find the source. Show the reason.</h1>
              <p class="muted">This build ranks the first source-answer records by aliases, curated terms, source family, readiness, and pramana. It is transparent by design.</p>
            </div>
            <div class="retrieval-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath source mark"></div>
          </div>

          <section class="retrieval-search" aria-label="Retrieval query">
            <label for="retrievalQuery">Question</label>
            <textarea id="retrievalQuery"></textarea>
            <div class="retrieval-actions">
              <button class="button primary" id="runRetrieval" type="button">Search Records</button>
              <button class="button safe" id="copyRetrievalTrace" type="button">Copy Trace</button>
            </div>
            <div class="retrieval-samples" id="retrievalSamples" aria-label="Sample retrieval questions"></div>
          </section>

          <div class="retrieval-stats" id="retrievalStats" aria-live="polite"></div>
          <div class="retrieval-match-status" id="retrievalStatus" aria-live="polite"></div>

          <section class="retrieval-grid" aria-label="Retrieval candidates">
            <div class="retrieval-card-list" id="retrievalCandidates"></div>
            <div class="retrieval-detail">
              <div class="retrieval-trace">
                <label for="retrievalTrace">Visible retrieval trace</label>
                <textarea id="retrievalTrace" readonly></textarea>
              </div>
              <div>
                <h2>Scoring Rules</h2>
                <div class="retrieval-rules" id="retrievalRules"></div>
              </div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Functional phase</span>
          <h2 style="margin-top: 14px;">Retrieval Boundary</h2>
          <p class="muted">This is static record ranking, not production semantic search. It protects the product from confident answers when the source set is not ready.</p>
          <div class="progress" aria-label="Retrieval foundation progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Dataset</span><strong>6</strong></div>
            <div class="metric"><span>Mode</span><strong>Static</strong></div>
            <div class="metric"><span>Next</span><strong>Evals</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>No-Source Rule</h2>
            <p class="muted">If the score is too low, VedaPath should create a review path instead of inventing confidence.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-retrieval-foundation.js"></script>
  </body>
</html>
`);
}

function patchSourceAnswerFoundation() {
  const file = "data/vedapath-source-answer-foundation.json";
  const data = JSON.parse(read(file));
  data.last_updated_release = release;
  data.status = "source answer foundation v1 with retrieval aliases";
  const gita = data.records.find((record) => record.slug === "gita-veda");
  if (gita) {
    gita.aliases = Array.from(new Set([
      ...(gita.aliases || []),
      "is the gita one of the vedas",
      "gita one of the vedas",
      "part of the vedas",
      "is bhagavad gita part of vedas"
    ]));
    gita.retrieval_terms = Array.from(new Set([
      ...(gita.retrieval_terms || []),
      "gita one of vedas",
      "part of vedas",
      "text classification"
    ]));
  }
  write(file, `${JSON.stringify(data, null, 2)}\n`);
}

function updateIndex() {
  let content = updateVersionBadge(read("index.html"));

  if (!content.includes(".retrieval-home-status")) {
    content = content.replace(
      `      .answer-header {`,
      `      .retrieval-home-status {
        margin-top: 12px;
        border: 1px solid rgba(224, 168, 59, 0.34);
        border-radius: 8px;
        background: rgba(224, 168, 59, 0.12);
        color: var(--deep-ochre);
        padding: 10px 12px;
        font-size: 13px;
        font-weight: 850;
      }

      .answer-header {`
    );
  }

  if (!content.includes('id="retrievalMatchStatus"')) {
    content = content.replace(
      `          <div class="source-data-status" id="sourceDataStatus">Source data foundation loading...</div>`,
      `          <div class="source-data-status" id="sourceDataStatus">Source data foundation loading...</div>
          <div class="retrieval-home-status" id="retrievalMatchStatus">Retrieval reasons will appear after you ask.</div>`
    );
  }

  if (!content.includes('href="retrievalfoundation.html"')) {
    content = content.replace(
      '<a href="sourcefoundation.html">Source data <span>records</span></a>',
      '<a href="sourcefoundation.html">Source data <span>records</span></a>\n              <a href="retrievalfoundation.html">Retrieval <span>reasons</span></a>'
    );
  }

  const noSourceStart = "      // VEDAPATH NO SOURCE ANSWER START";
  const noSourceEnd = "      // VEDAPATH NO SOURCE ANSWER END";
  const noSource = `${noSourceStart}
      answers["no-source"] = {
        question: "No verified source record yet.",
        title: "No verified source record yet.",
        summary: "The starter source set does not yet support this question. VedaPath should pause, preserve the question, and ask for source review instead of forcing an answer.",
        family: "Unverified | Review needed",
        citation: "No matching source record",
        pramana: "No source yet",
        confidence: "Low",
        caution: "Do not answer beyond the reviewed source set.",
        meter: "speculative",
        tabs: {
          source: [
            ["What happened", "The current source-answer foundation could not find a strong enough record for this question."],
            ["Next honest step", "Create a review ticket with likely source family, missing evidence, and the exact user question."]
          ],
          sanskrit: [
            ["No Sanskrit layer yet", "Do not invent Sanskrit terms or citations for an unsupported question."],
            ["Review need", "A reviewer can decide whether the question belongs to Veda, Upanishad, Gita, Itihasa, Purana, commentary, or modern interpretation."]
          ],
          views: [
            ["Product stance", "A calm product can say not yet without disappointing the user."],
            ["Trust stance", "Source gaps should become visible review work, not hidden hallucination risk."]
          ],
          claim: [
            ["What the source says", "No reviewed source record has been selected."],
            ["What tradition says", "Unknown from the current dataset."],
            ["Modern claim", "The user may be asking a valid question, but this build cannot support it yet."],
            ["Boundary", "Do not force an answer."]
          ]
        }
      };
${noSourceEnd}`;

  if (content.includes(noSourceStart)) {
    content = content.replace(new RegExp(`${escapeRegex(noSourceStart)}[\\s\\S]*?${escapeRegex(noSourceEnd)}`), noSource);
  } else {
    content = content.replace("      // VEDAPATH SOURCE DATA FOUNDATION START", `${noSource}\n\n      // VEDAPATH SOURCE DATA FOUNDATION START`);
  }

  const bridgeStart = "      // VEDAPATH SOURCE DATA FOUNDATION START";
  const bridgeEnd = "      // VEDAPATH SOURCE DATA FOUNDATION END";
  const bridge = `${bridgeStart}
      let foundationRecords = [];
      let lastRetrievalMatch = null;
      const retrievalStopWords = new Set(["a", "an", "and", "are", "as", "at", "be", "by", "can", "did", "do", "does", "for", "from", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "should", "that", "the", "to", "was", "what", "when", "where", "which", "with", "you"]);
      const retrievalNoSourceSignals = ["airplane", "airplanes", "aircraft", "vimana", "spaceship", "internet", "wifi", "stock market", "bitcoin", "lottery", "medical cure", "cancer cure"];

      function answerFromFoundationRecord(record) {
        return {
          question: record.question,
          title: record.title,
          summary: record.summary,
          family: record.source_family,
          citation: record.source,
          pramana: record.pramana,
          confidence: record.confidence,
          caution: record.caution,
          meter: record.meter,
          tabs: record.tabs
        };
      }

      function updateSourceDataStatus(message) {
        const status = document.querySelector("#sourceDataStatus");
        if (status) status.textContent = message;
      }

      function updateRetrievalMatchStatus(message) {
        const status = document.querySelector("#retrievalMatchStatus");
        if (status) status.textContent = message;
      }

      function retrievalNormalize(value) {
        return String(value || "").toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();
      }

      function retrievalTokens(value) {
        return retrievalNormalize(value)
          .split(/\\s+/)
          .filter((token) => token && token.length > 1 && !retrievalStopWords.has(token));
      }

      function scoreFoundationRecord(query, record) {
        const normalizedQuery = retrievalNormalize(query);
        const queryTokens = retrievalTokens(query);
        const reasons = [];
        let score = 0;
        const noSourceHits = retrievalNoSourceSignals.filter((term) => normalizedQuery.includes(term));

        for (const alias of record.aliases || []) {
          if (normalizedQuery.includes(retrievalNormalize(alias))) {
            score += 60;
            reasons.push("alias " + alias);
            break;
          }
        }

        for (const phrase of [record.question, record.title]) {
          const normalizedPhrase = retrievalNormalize(phrase);
          if (normalizedPhrase && (normalizedQuery.includes(normalizedPhrase) || normalizedPhrase.includes(normalizedQuery))) {
            score += 44;
            reasons.push("question/title phrase");
            break;
          }
        }

        for (const term of record.retrieval_terms || []) {
          const normalizedTerm = retrievalNormalize(term);
          const termTokens = retrievalTokens(term);
          if (normalizedTerm && normalizedQuery.includes(normalizedTerm)) {
            score += 14;
            reasons.push("term " + term);
          } else if (termTokens.some((token) => queryTokens.includes(token))) {
            score += 9;
            reasons.push("related " + term);
          }
        }

        const sourceHits = retrievalTokens([record.source, record.source_family, record.tradition_layer].join(" "))
          .filter((token, index, list) => queryTokens.includes(token) && list.indexOf(token) === index);
        if (sourceHits.length) {
          score += Math.min(24, sourceHits.length * 8);
          reasons.push("source terms " + sourceHits.slice(0, 3).join(", "));
        }

        const bodyHits = retrievalTokens([record.summary, record.boundary, record.caution, ...(record.blocked_claims || [])].join(" "))
          .filter((token, index, list) => queryTokens.includes(token) && list.indexOf(token) === index);
        if (bodyHits.length) {
          score += Math.min(18, bodyHits.length * 3);
          reasons.push("body terms " + bodyHits.slice(0, 3).join(", "));
        }

        if (record.readiness === "answer-preview-ready") {
          score += 12;
          reasons.push("preview-ready");
        } else if (record.readiness) {
          score += 4;
          reasons.push("review-needed");
        }

        if (String(record.pramana || "").toLowerCase().includes("direct")) {
          score += 8;
          reasons.push("direct lane");
        }

        if (noSourceHits.length) {
          score -= 48;
          reasons.unshift("no-source signal " + noSourceHits.join(", "));
        }

        return { record, score, reasons };
      }

      function rankFoundationRecords(query) {
        return foundationRecords
          .map((record) => scoreFoundationRecord(query, record))
          .sort((a, b) => b.score - a.score);
      }

      function selectAnswerFromText(text) {
        if (!foundationRecords.length) return pickLegacyAnswerFromText(text);
        const ranked = rankFoundationRecords(text);
        const top = ranked[0];
        if (top && top.score >= 24) {
          lastRetrievalMatch = top;
          const matchKind = top.record.readiness === "answer-preview-ready" ? "Matched" : "Review-needed match";
          updateRetrievalMatchStatus(matchKind + " " + top.record.source + " with score " + top.score + ": " + top.reasons.slice(0, 3).join(", ") + ".");
          return top.record.slug;
        }
        lastRetrievalMatch = null;
        updateRetrievalMatchStatus("No strong source record yet. VedaPath should create a review ticket instead of forcing an answer.");
        return "no-source";
      }

      async function loadSourceFoundation() {
        try {
          const response = await fetch("data/vedapath-source-answer-foundation.json");
          if (!response.ok) throw new Error("source data unavailable");
          const dataset = await response.json();
          foundationRecords = dataset.records || [];
          foundationRecords.forEach((record) => {
            answers[record.slug] = answerFromFoundationRecord(record);
          });
          updateSourceDataStatus("Retrieval foundation active: " + foundationRecords.length + " source-answer records loaded.");
          renderAnswer(currentKey);
        } catch (error) {
          updateSourceDataStatus("Retrieval foundation offline; using bundled preview answers.");
        }
      }
${bridgeEnd}`;

  content = content.replace(new RegExp(`${escapeRegex(bridgeStart)}[\\s\\S]*?${escapeRegex(bridgeEnd)}`), bridge);

  if (!content.includes("function pickLegacyAnswerFromText")) {
    content = content.replace("      function pickAnswerFromText(text) {", "      function pickLegacyAnswerFromText(text) {");
  }

  content = content.replace(
    /      function pickLegacyAnswerFromText\(text\) \{[\s\S]*?      \}\s*\n\n      function renderAnswer/,
    `      function pickLegacyAnswerFromText(text) {
        const normalized = text.toLowerCase();
        if (normalized.includes("quantum") || normalized.includes("science")) return "quantum";
        if (normalized.includes("gayatri") || normalized.includes("savitr")) return "gayatri";
        if (normalized.includes("atman") || normalized.includes("brahman")) return "atman";
        if (normalized.includes("gita") || normalized.includes("veda")) return "gita-veda";
        if (normalized.includes("oppenheimer") || normalized.includes("death")) return "oppenheimer";
        return currentKey;
      }

      function pickAnswerFromText(text) {
        return selectAnswerFromText(text);
      }

      function renderAnswer`
  );

  write("index.html", content);
}

function updateBuildStatus() {
  let content = updateVersionBadge(read("build-status.html"));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Retrieval Foundation: Ask now ranks source-answer records, shows match reasons, and has a no-source fallback.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>70%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:70%"></div></div>
          <p>The first retrieval layer can choose answer records, explain ranking, and refuse unsupported questions.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Retrieval evaluation</strong>
          <p>Add expected-source eval cases and tune retrieval thresholds before expanding the corpus.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 256: Retrieval Foundation</strong>
                <p>Adds static ranking over source-answer records, visible match reasons, and a no-source answer fallback on the Ask surface.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 256: Retrieval Foundation")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 256: Production Implementation and Licensed Audio<\/strong>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 257: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Retrieval Foundation</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.1 Source Data Foundation</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make source selection visible before answer rendering.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for retrieval eval cases</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Use answer records for the first static retrieval pass\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Add no-source and reviewer-needed fallbacks\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Connect source records to answer records by stable ids\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep UI calm while the knowledge layer becomes real\.<\/span><\/li>/, `<li><span class="dot"></span><span>Add expected-source eval cases for every starter query.</span></li>
              <li><span class="dot"></span><span>Tune thresholds for answer-ready versus review-needed.</span></li>
              <li><span class="dot"></span><span>Connect retrieval traces to reviewer queue tickets.</span></li>
              <li><span class="dot"></span><span>Expand records only after the eval loop is visible.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH RETRIEVAL FOUNDATION START -->", "<!-- VEDAPATH RETRIEVAL FOUNDATION END -->", `## ${release} Retrieval Foundation

This release turns the source-answer dataset into a visible static retrieval layer.

- adds \`data/vedapath-retrieval-foundation.json\`
- adds \`retrievalfoundation.html\` for ranking, reasons, and traces
- updates Home Ask to rank records before answering
- adds a no-source fallback instead of forcing weak answers
- keeps retrieval transparent: score, reason, readiness, confidence, boundary`, "<!-- VEDAPATH SOURCE DATA FOUNDATION START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH RETRIEVAL FOUNDATION NOTES START -->", "<!-- VEDAPATH RETRIEVAL FOUNDATION NOTES END -->", `## ${release} Retrieval Foundation

After the source-answer data foundation, this phase adds the first retrieval behavior.

Action taken:

- Added static scoring config and sample queries.
- Added a Retrieval Foundation page with candidate scores and visible traces.
- Updated Home Ask to rank source-answer records before rendering.
- Added a no-source answer when a question falls outside the starter dataset.
- Prepared the next phase: retrieval eval cases and threshold tuning.`, "<!-- VEDAPATH SOURCE DATA FOUNDATION NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH RETRIEVAL FOUNDATION BLUEPRINT START -->", "<!-- VEDAPATH RETRIEVAL FOUNDATION BLUEPRINT END -->", `### 275. Retrieval Foundation

VedaPath should search before it speaks.

Rules:

- Rank reviewed source-answer records before rendering an answer.
- Show match reasons in plain language.
- Treat low scores as review work, not answer pressure.
- Keep no-source fallback calm and helpful.
- Next build should add expected-source eval cases before expanding the corpus.`, "<!-- VEDAPATH SOURCE DATA FOUNDATION BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/RETRIEVAL_FOUNDATION.md", `# VedaPath AI Retrieval Foundation

Release: ${release}

This release adds the first static retrieval layer over the source-answer records.

## Files

- \`data/vedapath-retrieval-foundation.json\`
- \`retrievalfoundation.html\`
- \`assets/vedapath-retrieval-foundation.css\`
- \`assets/vedapath-retrieval-foundation.js\`

## Behavior

The retrieval layer scores records by:

- exact aliases
- question and title phrase matches
- curated retrieval terms
- source and family terms
- body evidence terms
- readiness state
- pramana lane

## Boundary

This is static retrieval over starter records. It is not semantic search, live RAG, broad corpus coverage, scholar approval, therapy, ritual instruction, emergency support, or spiritual authority.
`);
}

writeRetrievalFoundationData();
writeRetrievalFoundationCss();
writeRetrievalFoundationJs();
writeRetrievalFoundationPage();
updateAllHtmlVersions();
patchSourceAnswerFoundation();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} retrieval foundation applied.`);

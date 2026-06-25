const betaSearchRoot = document.getElementById("betaSearch");

if (betaSearchRoot) {
  initBetaSearch().catch((error) => {
    betaSearchRoot.innerHTML = '<p class="muted">Search preview could not load the local seed files.</p>';
    console.error(error);
  });
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load " + url);
  }
  return response.json();
}

function text(value) {
  return String(value || "");
}

function fieldBlob(record) {
  return [
    record.title,
    record.source_candidate,
    record.text_family,
    record.status,
    record.review_state,
    record.rights_state,
    record.boundary,
    record.summary,
    ...(record.allowed_intents || []),
    ...(record.blocked_claims || [])
  ].map(text).join(" ").toLowerCase();
}

function matchReason(record, query) {
  const needle = query.toLowerCase();
  const checks = [
    ["title", record.title],
    ["source", record.source_candidate],
    ["family", record.text_family],
    ["summary", record.summary],
    ["boundary", record.boundary],
    ["intent", (record.allowed_intents || []).join(" ")],
    ["blocked claim", (record.blocked_claims || []).join(" ")]
  ];
  const hit = checks.find((row) => text(row[1]).toLowerCase().includes(needle));
  return hit ? "Matched " + hit[0] + "." : "Shown as part of the beta seed.";
}

function fixtureBlob(fixture) {
  return [
    fixture.question,
    fixture.expected_route,
    fixture.expected_source_candidate,
    fixture.expected_boundary
  ].map(text).join(" ").toLowerCase();
}

function renderStats(root, records, fixtures, results) {
  root.querySelector("#betaSearchStats").innerHTML = [
    ["Seed", records.length],
    ["Fixtures", fixtures.length],
    ["Results", results.length],
    ["Eligible", records.filter((record) => record.public_answer_eligible).length]
  ].map((row) => '<div class="stat-card"><span>' + row[0] + '</span><strong>' + row[1] + '</strong></div>').join("");
}

function resultCard(record, query) {
  return '<article class="result-card">' +
    '<h3>' + record.title + '</h3>' +
    '<p class="muted">' + record.summary + '</p>' +
    '<div class="result-meta">' +
      '<span>' + record.release + '</span>' +
      '<span class="safe">' + record.text_family + '</span>' +
      '<span>' + record.review_state + '</span>' +
      '<span>' + record.rights_state + '</span>' +
      '<span>eligible: ' + String(record.public_answer_eligible) + '</span>' +
    '</div>' +
    '<p><strong>Source:</strong> ' + record.source_candidate + '</p>' +
    '<p><strong>Boundary:</strong> ' + record.boundary + '</p>' +
    '<p class="match-note">' + matchReason(record, query) + '</p>' +
  '</article>';
}

function fixtureCard(fixture) {
  return '<article class="fixture-card">' +
    '<h3>Fixture: ' + fixture.expected_route + '</h3>' +
    '<p>' + fixture.question + '</p>' +
    '<p class="muted">Expected source: ' + fixture.expected_source_candidate + '</p>' +
    '<p class="match-note">Reviewer needed: ' + String(fixture.reviewer_needed) + '</p>' +
  '</article>';
}

function handoffText(query, results, fixtures) {
  const top = results.slice(0, 3).map((record) => '- ' + record.title + ' | ' + record.source_candidate + ' | ' + record.review_state);
  return [
    'VedaPath Beta Search Handoff',
    'Query: ' + query,
    'Result count: ' + results.length,
    'Fixture matches: ' + fixtures.length,
    '',
    'Top records:',
    ...(top.length ? top : ['- No matching source records. Use fallback copy.']),
    '',
    'Boundary: prototype seed search only; not production retrieval, reviewed corpus coverage, or live AI generation.'
  ].join('\n');
}

async function initBetaSearch() {
  const seed = await loadJson("data/vedapath-beta-seed.json");
  const fixtureData = await loadJson("data/vedapath-question-fixtures.json");
  const records = seed.records || [];
  const fixtures = fixtureData.fixtures || [];
  const input = betaSearchRoot.querySelector("#betaSearchInput");
  const resultsNode = betaSearchRoot.querySelector("#betaSearchResults");
  const handoff = betaSearchRoot.querySelector("#betaSearchHandoff");
  const chips = ["beta", "Gita", "Upanishad", "review", "rights", "therapy", "blocked", "source"];

  betaSearchRoot.querySelector("#betaSearchChips").innerHTML = chips.map((chip) => (
    '<button class="query-chip" type="button" data-query="' + chip + '">' + chip + '</button>'
  )).join("");

  function render() {
    const query = input.value.trim() || betaSearchRoot.dataset.defaultQuery || "beta";
    const needle = query.toLowerCase();
    const recordResults = records.filter((record) => fieldBlob(record).includes(needle));
    const fixtureResults = fixtures.filter((fixture) => fixtureBlob(fixture).includes(needle)).slice(0, 2);
    renderStats(betaSearchRoot, records, fixtures, recordResults);
    resultsNode.innerHTML = [
      ...(recordResults.length ? recordResults.map((record) => resultCard(record, query)) : ['<article class="result-card"><h3>No eligible seed result</h3><p class="muted">Try a narrower source, family, review, rights, or blocked-claim query. Do not invent an answer from an empty search.</p></article>']),
      ...fixtureResults.map(fixtureCard)
    ].join("");
    handoff.value = handoffText(query, recordResults, fixtureResults);
  }

  betaSearchRoot.querySelector("#betaSearchButton").addEventListener("click", render);
  input.addEventListener("input", render);
  betaSearchRoot.querySelector("#betaSearchChips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-query]");
    if (!button) return;
    input.value = button.dataset.query;
    render();
  });
  render();
}

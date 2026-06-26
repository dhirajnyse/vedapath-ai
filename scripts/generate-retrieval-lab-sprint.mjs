import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const retrievalFixtures = [
  {
    id: "steady-action",
    query: "How can I act calmly when results are uncertain?",
    intent: "steady action",
    expected_source_ids: ["bg-2-48-steadiness", "bg-18-63-agency"],
    boundary: "Reflection support only; do not promise peace or therapy.",
    safe_answer_frame: "Start with the source candidate, explain the action/result distinction gently, and name one small carry action."
  },
  {
    id: "discernment-choice",
    query: "How do I tell short term comfort from a deeper good?",
    intent: "discernment",
    expected_source_ids: ["katha-1-2-1-discernment"],
    boundary: "Do not judge another person's life or turn the source into moral policing.",
    safe_answer_frame: "Offer a source-guided question about clarity, not a command."
  },
  {
    id: "knowledge-layers",
    query: "What does Hindu philosophy mean by different kinds of knowledge?",
    intent: "knowledge",
    expected_source_ids: ["mundaka-1-1-4-knowledge"],
    boundary: "Do not frame the source as anti-science or anti-scholarship.",
    safe_answer_frame: "Separate source category, plain meaning, and commentary caution."
  },
  {
    id: "restraint-life",
    query: "How can I practice restraint without escaping responsibility?",
    intent: "restraint",
    expected_source_ids: ["isha-1-restraint"],
    boundary: "Do not advise abandoning safety, shelter, responsibility, law, or family duties.",
    safe_answer_frame: "Keep it as a reflection prompt with a rights hold visible."
  },
  {
    id: "identity-context",
    query: "How should beginners approach Atman and Brahman carefully?",
    intent: "self inquiry",
    expected_source_ids: ["chandogya-6-8-7-identity"],
    boundary: "Do not turn metaphysics into self-esteem slogans or psychological advice.",
    safe_answer_frame: "Invite context, commentary lanes, and humility."
  },
  {
    id: "plurality",
    query: "Does the Rigveda support religious pluralism?",
    intent: "plural expression",
    expected_source_ids: ["rigveda-1-164-46-many-names"],
    boundary: "Do not claim all traditions say the same thing or erase debate.",
    safe_answer_frame: "Name the source as a Vedic hymn and separate text, interpretation, and modern analogy."
  }
];

const releases = [
  ["v2.2.5", "v2.2.5 query desk", "retrievalquery", "Query", "VedaPath Retrieval Query Desk", "Retrieval query", "Query desk", "Ask the library before answering.", "A query desk that turns a user question into a source-library search over curated records, without pretending retrieval is final answer authority.", "How can I act calmly when results are uncertain?", "steady action", "Retrieval query prototype, not an AI answer engine.", 10, "steady action", "Source Candidate Ranker", "Route modern questions into the curated source library.", "Retrieval Query Desk starts the search layer over VedaPath's curated source records."],
  ["v2.2.6", "v2.2.6 ranker", "candidateranker", "Rank", "VedaPath Source Candidate Ranker", "Candidate ranker", "Candidate ranker", "Rank candidates with visible reasons.", "A candidate ranker that scores source records using theme, tag, question, and citation matches while keeping readiness visible.", "What does the Gita suggest about steady effort?", "action", "Ranker prototype, not semantic retrieval.", 20, "action", "Reason Stack Viewer", "Make ranking explainable before answer drafting.", "Source Candidate Ranker makes source selection inspectable instead of mysterious."],
  ["v2.2.7", "v2.2.7 reasons", "reasonstack", "Reasons", "VedaPath Reason Stack Viewer", "Reason stack", "Reason stack", "Show why a source was selected.", "A reason stack that explains query matches, readiness state, rights state, and boundary warnings for every selected source.", "How do I tell short term comfort from a deeper good?", "discernment", "Reason stack preview, not evaluation proof.", 30, "discernment", "Boundary-Aware Answer Draft", "Show source-selection reasons in plain language.", "Reason Stack Viewer builds trust by making retrieval evidence visible."],
  ["v2.2.8", "v2.2.8 answer draft", "answerdraft", "Draft", "VedaPath Boundary-Aware Answer Draft", "Answer draft", "Answer draft", "Draft only inside the boundary.", "A draft preview that uses the top source candidate to assemble a careful, cited answer frame with no-go boundaries attached.", "How can I practice restraint without escaping responsibility?", "restraint", "Draft preview, not public answer generation.", 40, "restraint", "Citation Trace Panel", "Keep answer drafting subordinate to source limits.", "Boundary-Aware Answer Draft makes safe answer framing visible before any AI backend exists."],
  ["v2.2.9", "v2.2.9 citation trace", "citationtrace", "Trace", "VedaPath Citation Trace Panel", "Citation trace", "Citation trace", "Trace the answer back to source data.", "A citation trace panel that keeps source id, citation, family, rights state, readiness score, and boundary available beside the draft.", "How should beginners approach Atman and Brahman carefully?", "self inquiry", "Trace panel preview, not audit log.", 50, "self inquiry", "Retrieval Eval Cases", "Let every answer frame carry source provenance.", "Citation Trace Panel makes retrieval accountable at the record level."],
  ["v2.3.0", "v2.3.0 eval cases", "retrievaleval", "Eval", "VedaPath Retrieval Eval Cases", "Retrieval eval", "Eval cases", "Test retrieval before trusting it.", "An eval case room with expected source ids, visible matches, and mismatch boundaries for the starter source library.", "Does the Rigveda support religious pluralism?", "plural", "Eval preview, not formal benchmark.", 60, "plural", "Fallback Answer Guard", "Create starter retrieval test cases before backend work.", "Retrieval Eval Cases gives VedaPath a simple quality loop for source selection."],
  ["v2.3.1", "v2.3.1 fallback guard", "fallbackguard", "Fallback", "VedaPath Fallback Answer Guard", "Fallback guard", "Fallback guard", "Say when the library is not ready.", "A fallback guard that tells the product when no record is ready enough, rather than forcing a weak answer.", "Can scripture help me choose without telling me what to do?", "agency", "Fallback preview, not model safety system.", 70, "agency", "Search History Preview", "Prefer honest fallback over weak source claims.", "Fallback Answer Guard protects VedaPath from answer pressure when retrieval is uncertain."],
  ["v2.3.2", "v2.3.2 search history", "searchhistory", "History", "VedaPath Search History Preview", "Search history", "Search history", "Remember searches only on this device.", "A device-local history preview that records query, top source, score, and trace text without claiming accounts or durable memory.", "What does Hindu philosophy mean by different kinds of knowledge?", "knowledge", "Browser-only history preview, not account storage.", 80, "knowledge", "Mobile Retrieval Polish", "Test retrieval habit before accounts and backend storage.", "Search History Preview keeps iteration fast while preserving privacy boundaries."],
  ["v2.3.3", "v2.3.3 retrieval mobile", "retrievalmobile", "Mobile", "VedaPath Mobile Retrieval Polish", "Retrieval mobile", "Mobile polish", "Keep retrieval calm on a phone.", "A mobile polish pass for the Retrieval Lab with stacked controls, stable source cards, and full-width trace actions.", "How do I tell short term comfort from a deeper good?", "comfort good", "Mobile retrieval preview, not final app shell.", 90, "comfort good", "Retrieval Lab Control Room", "Protect the retrieval workflow on small screens.", "Mobile Retrieval Polish keeps source search usable without visual noise."],
  ["v2.3.4", "v2.3.4 retrieval lab", "retrievallab", "Lab", "VedaPath Retrieval Lab Control Room", "Retrieval lab", "Retrieval control", "Search sources. Show reasons. Keep boundaries.", "A retrieval control room that searches curated source records, ranks candidates, shows reason stacks, drafts a bounded answer frame, stores local search history, and exports trace packets.", "How can I act calmly when results are uncertain?", "calm action", "Retrieval lab prototype, not production RAG or AI authority.", 100, "calm action", "Founder instruction", "Use the lab to plan the first real retrieval implementation.", "Retrieval Lab Control Room completes the source-to-answer bridge for the trusted MVP."]
].map(([version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, family, stance, sprintPercent, defaultQuery, next, primaryAsk, summary]) => ({
  version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, family, stance, sprintPercent, defaultQuery, next, primaryAsk, summary,
  items: [
    ["Query path", "User language is matched to curated source records.", "Keeps answers source-led."],
    ["Reason path", "Ranking reasons and readiness stay visible.", "Makes retrieval inspectable."],
    ["Boundary path", "No-go language travels with each candidate.", "Prevents overclaim."],
    ["Trace path", "The chosen source can be copied as a trace packet.", "Supports review."]
  ]
}));

const uptoArg = process.argv.find((arg) => arg.startsWith("--upto="));
const upto = uptoArg ? Number.parseInt(uptoArg.split("=")[1], 10) : releases.length - 1;
if (!Number.isInteger(upto) || upto < 0 || upto >= releases.length) throw new Error(`Use --upto=0 through --upto=${releases.length - 1}`);

const visible = releases.slice(0, upto + 1);
const future = releases.slice(upto + 1);
const active = visible.at(-1);

function file(rel) { return path.join(root, rel); }
function read(rel) { return readFileSync(file(rel), utf8); }
function write(rel, content) {
  const out = file(rel);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, content, utf8);
}
function safeJson(value) { return JSON.stringify(value, null, 2).replace(/</g, "\\u003c"); }
function shortTitle(item) { return item.title.replace(/^VedaPath\s+/, ""); }
function docName(item) { return shortTitle(item).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, ""); }
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function upsertBlock(content, start, end, body, insertAfter) {
  const block = `${start}\n${body}\n${end}`;
  if (content.includes(start)) return content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), block);
  if (insertAfter && content.includes(insertAfter)) return content.replace(insertAfter, `${insertAfter}\n${block}`);
  return `${content.trimEnd()}\n\n${block}\n`;
}
function modesFor(item) {
  return {
    brief: [["Retrieval promise", item.summary], ["Founder move", item.primaryAsk], ["Trust move", `Keep this boundary visible: ${item.stance}`]],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No oracle claim", "Do not imply retrieval is final truth, spiritual authority, therapy, or diagnosis."],
      ["No production claim", "This is not production RAG, model evaluation, durable account history, or scholar approval."],
      ["No source stretch", "If the top source is weak or held, use fallback language instead of forcing an answer."]
    ]
  };
}
function retrievalNav(prefix = "", rel = "") {
  const isRetrievalPage = visible.some((item) => rel === `${item.slug}.html`);
  return `          <a class="link${isRetrievalPage ? " active" : ""}" href="${prefix}${active.slug}.html">Retrieval</a>`;
}
function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV END -->";
  const nav = retrievalNav(prefix, rel);
  if (content.includes(start)) content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  else if (content.includes("          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV END -->")) content = content.replace("          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV END -->", `          <!-- VEDAPATH SOURCE LIBRARY SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  else if (content.includes("<span class=\"version\">")) content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}
function retrievalData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "retrieval lab prototype",
    warning: "Prototype retrieval fixtures only. This is not production RAG, scholar approval, therapy, ritual instruction, or spiritual authority.",
    fixtures: retrievalFixtures
  };
}
function pageHtml(item) {
  const rooms = visible.map(({ version, slug, nav }) => ({ version, slug, nav }));
  const data = { ...item, modes: modesFor(item), rooms };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${item.title}</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-retrieval-lab.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div><strong>VedaPath AI</strong><span>${item.pageLabel}</span></div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="sourcereader.html">Reader</a>
          <a class="link" href="reviewerstudio.html">Reviewer</a>
          <a class="link" href="sourcelibrary.html">Sources</a>
          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV START -->
${retrievalNav("", `${item.slug}.html`)}
          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Retrieval lab sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten rooms connect source records to answer traces without pretending the AI is an authority.</p>
          <div class="room-list" id="roomList"></div>
        </aside>

        <section class="panel">
          <div class="hero-grid">
            <div>
              <span class="eyebrow">${item.eyebrow}</span>
              <h1>${item.h1}</h1>
              <p class="muted">${item.lead}</p>
            </div>
            <div class="mark-stage"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath ${item.nav} logo"></div>
          </div>

          <div class="source-block" aria-label="Release source card">
            <div><span class="source-meta">Release</span><span class="source-value">${item.version}</span></div>
            <div><span class="source-meta">Sample query</span><span class="source-value">${item.source}</span></div>
            <div><span class="source-meta">Intent lane</span><span class="source-value">${item.family}</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">${item.stance}</span></div>
          </div>

          <section class="retrieval-lab" id="retrievalLab" data-query="${item.defaultQuery}" aria-label="Retrieval lab">
            <div class="retrieval-head">
              <div>
                <span class="eyebrow">Source-backed retrieval</span>
                <h2>Retrieval Lab</h2>
                <p class="muted">Reads <strong>data/vedapath-source-library.json</strong> and <strong>data/vedapath-retrieval-fixtures.json</strong>. Results are explainable prototype matches, not AI authority.</p>
              </div>
              <div id="retrievalStats" class="retrieval-stats" aria-live="polite"></div>
            </div>

            <div class="retrieval-tools">
              <label for="retrievalQuery">Question</label>
              <textarea id="retrievalQuery" aria-label="Retrieval question"></textarea>
              <div id="fixtureButtons" class="fixture-buttons" aria-label="Sample questions"></div>
              <div class="retrieval-actions">
                <button class="button primary" id="runRetrieval" type="button">Run Retrieval</button>
                <button class="button safe" id="copyRetrievalTrace" type="button">Copy Trace</button>
                <button class="button" id="clearRetrievalHistory" type="button">Clear History</button>
              </div>
            </div>

            <div class="retrieval-layout">
              <div id="candidateList" class="candidate-list" aria-label="Ranked source candidates"></div>
              <div>
                <div id="candidateDetail" class="candidate-detail"></div>
                <div id="answerDraft" class="answer-draft"></div>
                <label class="retrieval-label" for="retrievalTrace">Retrieval trace</label>
                <textarea id="retrievalTrace" readonly aria-label="Retrieval trace output"></textarea>
                <div id="retrievalHistory" class="retrieval-history" aria-label="Local retrieval history"></div>
              </div>
            </div>
          </section>

          <h2>Retrieval Signals</h2>
          <div class="item-list" id="itemList"></div>

          <div class="tabs" role="tablist" aria-label="${item.title} layers">
            <button class="tab active" type="button" data-mode="brief">Brief</button>
            <button class="tab" type="button" data-mode="checklist">Checklist</button>
            <button class="tab" type="button" data-mode="boundary">Boundary</button>
          </div>
          <div id="modePanel"></div>
          <div class="button-row" style="margin-top: 14px;">
            <button class="button primary" id="copyBrief" type="button">Copy Brief</button>
            <button class="button safe" id="copyJson" type="button">Copy JSON</button>
            <button class="button" id="copyBoundary" type="button">Copy Boundary</button>
          </div>
          <textarea id="output" readonly aria-label="${item.title} output"></textarea>
        </section>

        <aside class="panel tight" aria-label="${item.title} sprint rail">
          <span class="badge green">Retrieval lab</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent"><div class="bar" style="--score:${item.sprintPercent}%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${item.version}</strong></div>
            <div class="metric"><span>Sprint</span><strong>${visible.length}/10</strong></div>
            <div class="metric"><span>Fixtures</span><strong>${retrievalFixtures.length}</strong></div>
            <div class="metric"><span>Next</span><strong>${item.next}</strong></div>
          </div>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Query</strong><p>Capture user language.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Rank</strong><p>Find source candidates.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Explain</strong><p>Show reasons and boundaries.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Trace</strong><p>Export answer evidence.</p></div></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Retrieval Boundary</h2>
            <p class="muted">This lab is not production RAG, model truth, scholar approval, therapy, ritual instruction, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>
    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-retrieval-lab.js"></script>
  </body>
</html>
`;
}
function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Retrieval Focus

- Sample query: ${item.source}
- Intent lane: ${item.family}
- Boundary: ${item.stance}

## Retrieval Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Sources

- data/vedapath-source-library.json
- data/vedapath-retrieval-fixtures.json

## No-Go Boundary

This release should not imply production RAG, model truth, scholar approval, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
`;
}
function writeRetrievalAssets() {
  write("data/vedapath-retrieval-fixtures.json", `${safeJson(retrievalData())}\n`);
  write("assets/vedapath-retrieval-lab.css", `/* VedaPath retrieval lab */
.retrieval-lab{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:8px;background:rgba(255,253,248,.88)}
.retrieval-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(190px,280px);gap:14px;align-items:start}
.retrieval-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.retrieval-stat,.candidate-card,.candidate-detail,.answer-draft,.history-card{border:1px solid var(--line);border-radius:8px;background:var(--surface)}
.retrieval-stat{padding:10px}.retrieval-stat span,.candidate-detail span,.history-card span,.retrieval-tools label{display:block;color:var(--muted);font-size:12px}.retrieval-stat strong{display:block;font-size:22px;line-height:1.1}
.retrieval-tools textarea,.retrieval-tools input,#retrievalTrace{width:100%;border:1px solid #efc1aa;border-radius:8px;background:#fffaf4;color:var(--ink);padding:12px;font-weight:700}
#retrievalQuery{min-height:92px;resize:vertical}.fixture-buttons,.retrieval-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.fixture-button{min-height:34px;border:1px solid #efb899;border-radius:8px;background:var(--surface);color:var(--ochre);padding:7px 10px;font-weight:850}
.retrieval-layout{display:grid;grid-template-columns:minmax(230px,.9fr) minmax(0,1.1fr);gap:14px;align-items:start}.candidate-list{display:grid;gap:8px}.candidate-card{width:100%;padding:11px;color:inherit;text-align:left}.candidate-card.active,.candidate-card:hover,.candidate-card:focus-visible{border-color:#f09f79;background:#fff0e7;outline:none}.candidate-card strong,.candidate-card span{display:block}.candidate-card span{color:var(--muted);font-size:12px}
.match-line{display:flex;align-items:center;gap:8px;margin-top:7px}.match-track{flex:1;height:8px;border-radius:999px;overflow:hidden;background:#f1dcd2}.match-fill{height:100%;width:var(--score);background:linear-gradient(90deg,var(--bhagwa),var(--gold))}
.candidate-detail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px;border-left:4px solid var(--green)}.candidate-detail .wide{grid-column:1/-1}.answer-draft{margin:12px 0;padding:12px;border-left:4px solid var(--bhagwa)}
.retrieval-label{display:block;margin:14px 0 6px;color:var(--muted);font-size:13px;font-weight:850}#retrievalTrace{min-height:190px;resize:vertical}.retrieval-history{display:grid;gap:8px;margin-top:12px}.history-card{padding:12px}
@media(max-width:860px){.retrieval-head,.retrieval-stats,.retrieval-layout,.candidate-detail{grid-template-columns:1fr}.retrieval-actions .button,.fixture-button{width:100%}}
`);
  write("assets/vedapath-retrieval-lab.js", `const retrievalRoot = document.getElementById("retrievalLab");
if (retrievalRoot) initRetrievalLab().catch((error)=>{retrievalRoot.innerHTML='<p class="muted">Retrieval lab could not load source data.</p>';console.error(error);});
async function loadRetrievalJson(url){const response=await fetch(url);if(!response.ok)throw new Error("Unable to load "+url);return response.json();}
function safeText(value){return value===0?"0":String(value||"");}
function safeHtml(value){return safeText(value).replace(/[&<>"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));}
function retrievalStorageKey(){return "vedapath-retrieval-lab-history";}
function readHistory(){try{return JSON.parse(localStorage.getItem(retrievalStorageKey())||"[]");}catch(error){return [];}}
function writeHistory(history){localStorage.setItem(retrievalStorageKey(),JSON.stringify(history.slice(0,20)));}
function tokenize(text){return safeText(text).toLowerCase().replace(/[^a-z0-9\\s]/g," ").split(/\\s+/).filter((word)=>word.length>2);}
function recordText(record){return [record.title,record.source,record.source_family,record.theme,record.tags.join(" "),record.question_examples.join(" "),record.source_note].join(" ").toLowerCase();}
function scoreRecord(query,record){const tokens=tokenize(query);const haystack=recordText(record);let score=0;const reasons=[];for(const token of tokens){if(haystack.includes(token)){score+=8;reasons.push("Matched "+token);}}if(haystack.includes(record.theme.toLowerCase())){score+=10;reasons.push("Theme lane: "+record.theme);}if(record.readiness==="preview-ready"){score+=12;reasons.push("Preview-ready source");}if(record.readiness==="rights-hold"){score-=10;reasons.push("Rights hold caution");}score+=Math.round(record.score/10);return {score:Math.max(0,Math.min(100,score)),reasons:[...new Set(reasons)].slice(0,6)};}
function rankRecords(query,records){return records.map((record)=>({record,...scoreRecord(query,record)})).sort((a,b)=>b.score-a.score);}
function fallbackNeeded(match){return !match||match.score<28||match.record.readiness==="rights-hold";}
function traceText(query,match,history){if(!match)return "VedaPath Retrieval Trace\\nNo source candidate.";const record=match.record;return ["VedaPath Retrieval Trace","Query: "+query,"Top source: "+record.source,"Record id: "+record.id,"Family: "+record.source_family,"Readiness: "+record.readiness+" | "+record.score+"/100","Match score: "+match.score,"Reasons: "+match.reasons.join(" | "),"Rights: "+record.rights_state,"Boundary: "+record.answer_boundary,"Fallback needed: "+(fallbackNeeded(match)?"yes":"no"),"Local history count: "+history.length,"","Boundary: retrieval lab prototype; not production RAG, model truth, scholar approval, therapy, ritual instruction, emergency support, or spiritual authority."].join("\\n");}
function answerFrame(query,match){if(!match)return "<strong>No candidate yet</strong><p class=\\"muted\\">Run retrieval to draft a bounded frame.</p>";const record=match.record;if(fallbackNeeded(match))return "<strong>Fallback answer guard</strong><p>The library has a weak or held candidate. Say that VedaPath does not yet have a ready source-backed answer for this question.</p><p class=\\"muted\\">Closest source: "+safeHtml(record.source)+" | "+safeHtml(record.readiness)+"</p>";return "<strong>Bounded answer frame</strong><p>Start with "+safeHtml(record.source)+" as a source candidate. Explain the plain meaning gently, then give one careful reflection question.</p><p class=\\"muted\\">Do not overclaim: "+safeHtml(record.answer_boundary)+"</p>";}
async function initRetrievalLab(){const [sourceData,fixtureData]=await Promise.all([loadRetrievalJson("data/vedapath-source-library.json"),loadRetrievalJson("data/vedapath-retrieval-fixtures.json")]);const records=sourceData.records||[];const fixtures=fixtureData.fixtures||[];const queryInput=retrievalRoot.querySelector("#retrievalQuery");const buttonsNode=retrievalRoot.querySelector("#fixtureButtons");const listNode=retrievalRoot.querySelector("#candidateList");const detailNode=retrievalRoot.querySelector("#candidateDetail");const draftNode=retrievalRoot.querySelector("#answerDraft");const traceNode=retrievalRoot.querySelector("#retrievalTrace");const historyNode=retrievalRoot.querySelector("#retrievalHistory");const state={query:retrievalRoot.dataset.query||fixtures[0]?.query||"",activeId:""};queryInput.value=state.query;buttonsNode.innerHTML=fixtures.slice(0,4).map((fixture)=>'<button class="fixture-button" type="button" data-query="'+safeHtml(fixture.query)+'">'+safeHtml(fixture.intent)+'</button>').join("");
function ranked(){return rankRecords(state.query,records);}function activeMatch(){const list=ranked();return list.find((match)=>match.record.id===state.activeId)||list[0];}
function renderStats(list,history){const ready=list.filter((match)=>match.record.readiness==="preview-ready").length;retrievalRoot.querySelector("#retrievalStats").innerHTML=[["Sources",records.length],["Candidates",list.length],["Ready",ready],["History",history.length]].map((row)=>'<div class="retrieval-stat"><span>'+safeHtml(row[0])+'</span><strong>'+safeHtml(row[1])+'</strong></div>').join("");}
function renderList(list,active){listNode.innerHTML=list.slice(0,6).map((match)=>'<button class="candidate-card'+(active&&match.record.id===active.record.id?' active':'')+'" type="button" data-record-id="'+safeHtml(match.record.id)+'"><strong>'+safeHtml(match.record.title)+'</strong><span>'+safeHtml(match.record.source)+'</span><span>'+safeHtml(match.record.source_family+" | "+match.record.readiness)+'</span><div class="match-line"><span>'+safeHtml(match.score)+'</span><div class="match-track"><div class="match-fill" style="--score:'+safeHtml(match.score)+'%"></div></div></div></button>').join("");}
function renderDetail(match){if(!match){detailNode.innerHTML="";return;}const record=match.record;detailNode.innerHTML=[["Source",record.source],["Family",record.source_family],["Match score",match.score+"/100"],["Readiness",record.readiness],["Reasons",match.reasons.join(" | ")||"No strong lexical reason","wide"],["Rights",record.rights_state,"wide"],["Boundary",record.answer_boundary,"wide"]].map((row)=>'<div class="'+(row[2]||"")+'"><span>'+safeHtml(row[0])+'</span><strong>'+safeHtml(row[1])+'</strong></div>').join("");}
function renderHistory(history){if(!history.length){historyNode.innerHTML='<article class="history-card"><strong>No local searches yet</strong><p class="muted">Run retrieval and the local trace preview will begin.</p></article>';return;}historyNode.innerHTML=history.slice(0,4).map((row)=>'<article class="history-card"><strong>'+safeHtml(row.query)+'</strong><span>'+safeHtml(row.source)+'</span><p class="muted">'+safeHtml(row.score)+" | "+safeHtml(row.date)+'</p></article>').join("");}
function render(){const history=readHistory();const list=ranked();const active=activeMatch();state.activeId=active&&active.record.id;renderStats(list,history);renderList(list,active);renderDetail(active);draftNode.innerHTML=answerFrame(state.query,active);traceNode.value=traceText(state.query,active,history);renderHistory(history);}
buttonsNode.addEventListener("click",(event)=>{const button=event.target.closest("[data-query]");if(!button)return;state.query=button.dataset.query;queryInput.value=state.query;state.activeId="";render();});queryInput.addEventListener("input",()=>{state.query=queryInput.value;state.activeId="";render();});listNode.addEventListener("click",(event)=>{const button=event.target.closest("[data-record-id]");if(!button)return;state.activeId=button.dataset.recordId;render();});retrievalRoot.querySelector("#runRetrieval").addEventListener("click",()=>{const match=activeMatch();const history=readHistory();if(match)history.unshift({query:state.query,source:match.record.source,score:match.score,date:new Date().toISOString().slice(0,10)});writeHistory(history);render();});retrievalRoot.querySelector("#clearRetrievalHistory").addEventListener("click",()=>{localStorage.removeItem(retrievalStorageKey());render();});retrievalRoot.querySelector("#copyRetrievalTrace").addEventListener("click",()=>{traceNode.focus();traceNode.select();const button=retrievalRoot.querySelector("#copyRetrievalTrace");const original=button.textContent;const done=()=>{button.textContent="Copied Trace";window.setTimeout(()=>{button.textContent=original;},1400);};const fallback=()=>{try{document.execCommand("copy");}catch(error){return;}done();};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(traceNode.value).then(done).catch(fallback);return;}fallback();});render();}
`);
}
function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH RETRIEVAL LAB SPRINT LINKS START -->", "<!-- VEDAPATH RETRIEVAL LAB SPRINT LINKS END -->", links, "<!-- VEDAPATH SOURCE LIBRARY SPRINT LINKS END -->");
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH RETRIEVAL LAB SPRINT FEATURES START -->", "<!-- VEDAPATH RETRIEVAL LAB SPRINT FEATURES END -->", features, "<!-- VEDAPATH SOURCE LIBRARY SPRINT FEATURES END -->");
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}
function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH RETRIEVAL LAB SPRINT NOTES START -->", "<!-- VEDAPATH RETRIEVAL LAB SPRINT NOTES END -->", notes, "<!-- VEDAPATH SOURCE LIBRARY SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", content);
}
function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH RETRIEVAL LAB SPRINT SUMMARY START -->", "<!-- VEDAPATH RETRIEVAL LAB SPRINT SUMMARY END -->", summary, "<!-- VEDAPATH SOURCE LIBRARY SPRINT SUMMARY END -->");
  const sections = visible.map((item, index) => `### ${208 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep retrieval explainable, source-bound, and honest about fallback

${shortTitle(item)} should never claim production RAG, model truth, scholar endorsement, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(content, "<!-- VEDAPATH RETRIEVAL LAB SPRINT BLUEPRINT START -->", "<!-- VEDAPATH RETRIEVAL LAB SPRINT BLUEPRINT END -->", sections, "<!-- VEDAPATH SOURCE LIBRARY SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", content);
}
function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes(`href="${active.slug}.html">Retrieval</a>`)) content = content.replace(/href="[^"]+\.html">Sources<\/a>/, `href="sourcelibrary.html">Sources</a> | <a href="${active.slug}.html">Retrieval</a>`);
  else content = content.replace(/href="[^"]+\.html">Retrieval<\/a>/, `href="${active.slug}.html">Retrieval</a>`);
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${active.version}</strong>\n          <p>Retrieval lab sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Retrieval lab sprint progress: ${visible.length}/10 rooms complete. The MVP now has a source-to-answer trace prototype.</p>`);
  const vision = Math.min(100, 90 + visible.length);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>${vision}%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:${vision}%"></div></div>\n          <p>Retrieval path: query desk, candidate ranker, reason stack, answer draft, citation trace, eval cases, fallback guard, history, and mobile polish.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>${future[0]?.version || "Founder instruction"}</strong>\n          <p>${future[0] ? shortTitle(future[0]) : "Retrieval lab sprint complete. Next release waits for founder instruction."}</p>`);
  const phaseBody = visible.concat(future).map((item, index) => `            <article class="phase">\n              <span class="badge ${index <= upto ? "done" : "later"}">${index <= upto ? "Done" : "Later"}</span>\n              <div>\n                <strong>Phase ${189 + index}: ${shortTitle(item)}</strong>\n                <p>${item.summary}</p>\n              </div>\n              <div class="percent">${index <= upto ? "100%" : "0%"}</div>\n            </article>`).join("\n");
  content = upsertBlock(content, "            <!-- VEDAPATH RETRIEVAL LAB SPRINT PHASES START -->", "            <!-- VEDAPATH RETRIEVAL LAB SPRINT PHASES END -->", phaseBody, "            <!-- VEDAPATH SOURCE LIBRARY SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${189 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.2.4 Source Library Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Retrieval lab sprint complete" : `${visible.length}/10 retrieval lab rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>\n              <li><span class="dot"></span><span>Keep the path simple: query, rank, reason, draft, trace, eval, fallback, history, mobile polish.</span></li>\n              <li><span class="dot"></span><span>Do not claim production RAG, model truth, scholar endorsement, therapy, ritual instruction, or spiritual authority.</span></li>\n              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing production retrieval, accounts, or scholar operations."}</span></li>\n            </ul>`);
  write("build-status.html", content);
}
function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">\n            <h2>${item.nav}</h2>\n            <p class="muted">${item.summary}</p>\n            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>\n          </section>`).join("\n\n");
  content = upsertBlock(content, "          <!-- VEDAPATH RETRIEVAL LAB SPRINT HOME START -->", "          <!-- VEDAPATH RETRIEVAL LAB SPRINT HOME END -->", cards, "          <!-- VEDAPATH SOURCE LIBRARY SPRINT HOME END -->");
  write("index.html", content);
}
function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">\n            <h3>${shortTitle(item)}</h3>\n            <p>${item.summary}</p>\n          </div>`).join("\n");
  content = upsertBlock(content, "          <!-- VEDAPATH RETRIEVAL LAB SPRINT FEATURES START -->", "          <!-- VEDAPATH RETRIEVAL LAB SPRINT FEATURES END -->", cards, "          <!-- VEDAPATH SOURCE LIBRARY SPRINT FEATURES END -->");
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeRetrievalAssets();
for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) addSprintNavToHtml(rel);
if (existsSync(file("brand/brand-board.html"))) addSprintNavToHtml("brand/brand-board.html", "../");
updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();
console.log(`Generated retrieval-lab sprint through ${active.version} (${visible.length}/10).`);

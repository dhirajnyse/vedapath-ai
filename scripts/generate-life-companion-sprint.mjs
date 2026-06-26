import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const scenarios = [
  {
    id: "arrival-restless",
    state: "Restless",
    domain: "Personal",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    signal: "Too many thoughts, not enough stillness.",
    reflection: "What is the next honest action I can do without demanding a certain result?",
    carry: "Do one small duty slowly before opening the next tab, message, or worry.",
    boundary: "Reflection support only; not therapy, medical advice, emergency support, or spiritual authority.",
    confidence: 84
  },
  {
    id: "relationship-pause",
    state: "Tense conversation",
    domain: "Relationship",
    source: "Bhagavad Gita 17.15",
    family: "Bhagavad Gita | Smriti",
    signal: "You need to reply, but speed may create harm.",
    reflection: "Can I make this reply truthful, useful, and less sharp?",
    carry: "Write the reply, wait one minute, remove one sentence that only tries to win.",
    boundary: "Not conflict mediation, legal advice, safety planning, or a replacement for human help.",
    confidence: 66
  },
  {
    id: "work-pressure",
    state: "Work pressure",
    domain: "Work",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    signal: "The outcome feels bigger than the next step.",
    reflection: "Which part of the work is mine to do now, and which part is not mine to control?",
    carry: "Choose the next 20-minute task and define a clean stopping point.",
    boundary: "Not productivity coaching, career advice, legal advice, or a promise of success.",
    confidence: 79
  },
  {
    id: "family-care",
    state: "Family care",
    domain: "Family",
    source: "Taittiriya Upanishad 1.11.2",
    family: "Upanishad | Shruti",
    signal: "Care is present, but pressure and expectation are tangled.",
    reflection: "What is one respectful action I can take without trying to control everyone?",
    carry: "Offer one specific help, then leave space for the other person to respond.",
    boundary: "Not family therapy, legal guidance, medical advice, or a rule for every household.",
    confidence: 58
  },
  {
    id: "decision-fog",
    state: "Decision fog",
    domain: "Decision",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    signal: "The pleasant and the beneficial are mixed together.",
    reflection: "Which option only soothes the moment, and which option also serves clarity?",
    carry: "Write the two options. Name one cost and one responsibility for each.",
    boundary: "Not moral policing, financial advice, legal advice, or a command.",
    confidence: 70
  },
  {
    id: "night-release",
    state: "Night release",
    domain: "Evening",
    source: "Bhagavad Gita 6.26",
    family: "Bhagavad Gita | Smriti",
    signal: "The mind keeps returning to unfinished loops.",
    reflection: "What can be placed down for tonight without pretending it no longer matters?",
    carry: "Write one unfinished item for tomorrow, then close the loop for tonight.",
    boundary: "Not sleep treatment, clinical care, diagnosis, or emergency support.",
    confidence: 63
  }
];

const releases = [
  ["v2.5.5", "v2.5.5 life arrival", "lifearrival", "Arrive", "VedaPath Life Arrival", "Life arrival", "Arrive honestly", "Start where life actually is.", "A life arrival room that lets a user name the present state, choose one source candidate, and leave with one grounded action.", "Personal steadiness", "arrival-restless", 10, "Life Domain Map", "Create the first source-bounded life entry.", "Life Arrival makes calm personal without pretending VedaPath is a therapist or guru."],
  ["v2.5.6", "v2.5.6 domain map", "lifedomainmap", "Domains", "VedaPath Life Domain Map", "Life domains", "Life domain map", "Map calm across real life.", "A domain map for personal, family, relationship, work, decision, and evening moments, each with source, boundary, and carry action.", "Personal, family, work, evening", "family-care", 20, "Steadiness Check", "Define where the moment belongs before answering.", "Life Domain Map keeps everyday calm grounded in context."],
  ["v2.5.7", "v2.5.7 steadiness check", "steadinesscheck", "Steady", "VedaPath Steadiness Check", "Steadiness check", "Steadiness check", "Check the next action before the whole life.", "A steadiness check that turns restless moments into one honest action, one source card, and one boundary line.", "Restless personal moment", "arrival-restless", 30, "Relationship Pause", "Make action smaller than anxiety.", "Steadiness Check gives users a practical source-backed pause."],
  ["v2.5.8", "v2.5.8 relationship pause", "relationshippause", "Relate", "VedaPath Relationship Pause", "Relationship pause", "Relationship pause", "Slow the reply before it becomes harm.", "A relationship pause that helps users draft a less reactive reply while keeping safety, therapy, and legal boundaries visible.", "Tense conversation", "relationship-pause", 40, "Work Dharma Room", "Add a careful pause before difficult replies.", "Relationship Pause brings calm into speech without pretending to mediate conflict."],
  ["v2.5.9", "v2.5.9 work dharma", "workdharma", "Work", "VedaPath Work Dharma Room", "Work dharma", "Work dharma", "Do the next clean piece of work.", "A work room that separates duty, outcome anxiety, and the next practical task without becoming productivity pressure.", "Work pressure", "work-pressure", 50, "Family Care Room", "Turn work pressure into one clean task.", "Work Dharma Room translates source-backed steadiness into a simple work surface."],
  ["v2.6.0", "v2.6.0 family care", "familycare", "Family", "VedaPath Family Care Room", "Family care", "Family care", "Care without control.", "A family care room that keeps respect, practical help, and personal boundary separate so calm does not become control.", "Family care", "family-care", 60, "Decision Pause", "Help without taking over another person.", "Family Care Room brings humility into personal support."],
  ["v2.6.1", "v2.6.1 decision pause", "decisionpause", "Decide", "VedaPath Decision Pause", "Decision pause", "Decision pause", "Separate pleasant from beneficial.", "A decision pause that uses source-backed discernment to separate comfort, clarity, cost, and responsibility.", "Decision fog", "decision-fog", 70, "Night Release", "Make one decision clearer without issuing a command.", "Decision Pause turns confusion into a small, reviewable reflection."],
  ["v2.6.2", "v2.6.2 night release", "nightrelease", "Evening", "VedaPath Night Release", "Night release", "Night release", "Close the day without erasing it.", "An evening release room that lets the user place one unfinished loop into tomorrow and leave the night lighter.", "Evening restlessness", "night-release", 80, "Mobile Life Companion", "Create a calm evening close without medical claims.", "Night Release makes the day easier to put down without pretending to solve sleep."],
  ["v2.6.3", "v2.6.3 life mobile", "mobilelifecompanion", "Mobile", "VedaPath Mobile Life Companion", "Life mobile", "Mobile life", "Keep personal calm usable on a phone.", "A mobile polish room for stable life cards, full-width actions, compact source ribbons, and readable boundaries on small screens.", "Mobile personal use", "arrival-restless", 90, "Life Companion Control Room", "Protect the personal calm workflow on small screens.", "Mobile Life Companion keeps everyday reflection simple in real life."],
  ["v2.6.4", "v2.6.4 life companion", "lifecompanionlab", "Life", "VedaPath Life Companion Control Room", "Life companion", "Life companion control", "Bring the source into ordinary life.", "A life companion control room that combines arrival, domains, source cards, boundaries, local rhythm, carry actions, and copyable life packets.", "Daily personal calm", "arrival-restless", 100, "Founder instruction", "Use this as the first personal calm standard for the trusted MVP.", "Life Companion Control Room completes the personal-life calm layer for VedaPath AI."]
].map(([version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, defaultScenario, sprintPercent, next, primaryAsk, summary]) => ({
  version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, defaultScenario, sprintPercent, next, primaryAsk, summary,
  items: [
    ["Arrive", "Name the moment without judging it.", "Reduces pressure."],
    ["Source", "Keep citation, family, confidence, and boundary visible.", "Protects trust."],
    ["Carry", "Leave with one small action.", "Makes calm practical."],
    ["Memory", "Save entries only in this browser.", "Protects privacy."]
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
    brief: [["Life promise", item.summary], ["Founder move", item.primaryAsk], ["Trust move", "Keep therapy, diagnosis, emergency, legal, and spiritual authority boundaries visible."]],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No therapy claim", "This is reflection support, not therapy, diagnosis, clinical care, or emergency support."],
      ["No authority voice", "Do not frame the product as guru, priest, counselor, parent, or judge."],
      ["No hidden memory", "Local preview memory stays in this browser and can be cleared."]
    ]
  };
}
function compactNav(rel) {
  const prefix = rel.startsWith("brand/") ? "../" : "";
  const activeName = path.basename(rel);
  const routes = [
    ["index.html", "Home"],
    ["build-status.html", "Build"],
    ["brand/brand-board.html", "Brand"],
    ["blueprint.html", "Blueprint"],
    ["sourcelibrary.html", "Sources"],
    ["retrievallab.html", "Retrieval"],
    ["citedanswerlab.html", "Answers"],
    ["mantralenslab.html", "Mantra"],
    [active.slug + ".html", "Life"],
    ["calm.html", "Calm"],
    ["daily.html", "Daily"]
  ];
  const links = routes.map(([href, label]) => {
    const normalized = href.replace(/^brand\//, "");
    const activeClass = activeName === path.basename(normalized) || (rel === "brand/brand-board.html" && href === "brand/brand-board.html") ? " active" : "";
    return `          <a class="link${activeClass}" href="${prefix}${href}">${label}</a>`;
  });
  links.push(`          <span class="version">${active.badge}</span>`);
  return `        <nav class="nav" aria-label="Project links">\n${links.join("\n")}\n        </nav>`;
}
function addCompactCss(content) {
  if (content.includes("/* VEDAPATH COMPACT NAV */")) return content;
  const css = `\n      /* VEDAPATH COMPACT NAV */\n      .nav {\n        max-width: 840px;\n      }\n\n      .nav .link,\n      .nav .version {\n        white-space: nowrap;\n      }\n\n      @media (max-width: 780px) {\n        .nav {\n          gap: 6px;\n        }\n\n        .nav .link,\n        .nav .version {\n          min-height: 32px;\n          padding: 5px 9px;\n          font-size: 12px;\n        }\n      }\n`;
  return content.replace(/(\s*)<\/style>/, `${css}$1</style>`);
}
function normalizeNav(rel) {
  let content = read(rel);
  content = content.replace(/\s*<nav class="nav" aria-label="Project links">[\s\S]*?<\/nav>/, `\n${compactNav(rel)}`);
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  content = addCompactCss(content);
  write(rel, content);
}
function lifeData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "life companion prototype",
    warning: "Prototype reflection support only. Not therapy, diagnosis, medical advice, legal advice, emergency support, ritual instruction, or spiritual authority.",
    scenarios
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
    <link rel="stylesheet" href="assets/vedapath-life-companion.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div><strong>VedaPath AI</strong><span>${item.pageLabel}</span></div>
        </a>
${compactNav(`${item.slug}.html`)}
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Life Companion sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten rooms bring source-bounded steadiness into ordinary personal life.</p>
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

          <div class="source-block" aria-label="Release life card">
            <div><span class="source-meta">Release</span><span class="source-value">${item.version}</span></div>
            <div><span class="source-meta">Moment</span><span class="source-value">${item.source}</span></div>
            <div><span class="source-meta">Founder move</span><span class="source-value">${item.primaryAsk}</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">Reflection support, not authority.</span></div>
          </div>

          <section class="life-companion" id="lifeCompanion" data-scenario="${item.defaultScenario}" aria-label="Life Companion">
            <div class="life-head">
              <div>
                <span class="eyebrow">Source-bounded daily support</span>
                <h2>Life Companion</h2>
                <p class="muted">Reads <strong>data/vedapath-life-companion.json</strong>. Entries stay local to this browser.</p>
              </div>
              <div id="lifeStats" class="life-stats" aria-live="polite"></div>
            </div>

            <div class="life-tools">
              <label for="scenarioSelect">Moment</label>
              <select id="scenarioSelect"></select>
              <label for="domainSelect">Domain</label>
              <select id="domainSelect">
                <option value="All">All domains</option>
                <option value="Personal">Personal</option>
                <option value="Relationship">Relationship</option>
                <option value="Work">Work</option>
                <option value="Family">Family</option>
                <option value="Decision">Decision</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div class="life-layout">
              <div>
                <div id="lifeCard" class="life-card"></div>
                <div class="life-actions">
                  <button class="button primary" id="saveLifeEntry" type="button">Save Entry</button>
                  <button class="button safe" id="copyLifePacket" type="button">Copy Life Packet</button>
                  <button class="button" id="clearLifeEntries" type="button">Clear Local</button>
                </div>
              </div>
              <div>
                <div id="domainRail" class="domain-rail"></div>
                <label class="life-label" for="lifeNote">One honest line</label>
                <textarea id="lifeNote" aria-label="Life reflection note"></textarea>
                <label class="life-label" for="lifePacket">Life packet</label>
                <textarea id="lifePacket" readonly aria-label="Life Companion packet"></textarea>
                <div id="lifeHistory" class="life-history" aria-label="Local life entries"></div>
              </div>
            </div>
          </section>

          <h2>Life Signals</h2>
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
          <span class="badge green">Life Companion</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent"><div class="bar" style="--score:${item.sprintPercent}%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${item.version}</strong></div>
            <div class="metric"><span>Sprint</span><strong>${visible.length}/10</strong></div>
            <div class="metric"><span>Moments</span><strong>${scenarios.length}</strong></div>
            <div class="metric"><span>Next</span><strong>${item.next}</strong></div>
          </div>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Arrive</strong><p>Name the moment.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Source</strong><p>Show context.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Carry</strong><p>One action.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Memory</strong><p>Local only.</p></div></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Life Boundary</h2>
            <p class="muted">This lab is not therapy, diagnosis, emergency support, legal advice, ritual instruction, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>
    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-life-companion.js"></script>
  </body>
</html>
`;
}
function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Life Focus

- Moment: ${item.source}
- Founder action: ${item.primaryAsk}
- Boundary: reflection support only, not authority

## Product Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Data Sources

- data/vedapath-life-companion.json
- data/vedapath-answer-patterns.json
- data/vedapath-source-library.json

## No-Go Boundary

This release should not imply therapy, diagnosis, emergency support, legal advice, ritual instruction, or spiritual authority.
`;
}
function writeLifeAssets() {
  write("data/vedapath-life-companion.json", `${safeJson(lifeData())}\n`);
  write("assets/vedapath-life-companion.css", `/* VedaPath Life Companion */
.life-companion{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:8px;background:rgba(255,253,248,.9)}
.life-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,280px);gap:14px;align-items:start}.life-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.life-stat,.life-card,.domain-card,.history-card{border:1px solid var(--line);border-radius:8px;background:var(--surface)}.life-stat{padding:10px}.life-stat span,.domain-card span,.history-card span,.life-tools label,.life-label{display:block;color:var(--muted);font-size:12px}.life-stat strong{display:block;font-size:22px;line-height:1.1}
.life-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}.life-tools select,#lifeNote,#lifePacket{width:100%;border:1px solid #efc1aa;border-radius:8px;background:#fffaf4;color:var(--ink);padding:12px;font-weight:750}
.life-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,1fr);gap:14px;align-items:start}.life-card{padding:18px;border-left:4px solid var(--bhagwa)}.life-card h2{font-size:30px;line-height:1.05}.life-ribbon{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.life-ribbon span{border:1px solid #efc1aa;border-radius:999px;padding:5px 9px;color:var(--ochre);font-size:12px;font-weight:900;background:#fff8f2}.confidence-track{height:9px;border-radius:999px;overflow:hidden;background:#f1dcd2;margin-top:10px}.confidence-fill{height:100%;width:var(--score);background:linear-gradient(90deg,var(--bhagwa),var(--gold))}
.domain-rail,.life-history{display:grid;gap:8px}.domain-card,.history-card{padding:11px}.domain-card.active{border-color:#f09f79;background:#fff0e7}.life-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.life-label{margin:12px 0 6px;font-weight:850}#lifeNote{min-height:92px;resize:vertical}#lifePacket{min-height:180px;resize:vertical}
@media(max-width:860px){.life-head,.life-stats,.life-tools,.life-layout{grid-template-columns:1fr}.life-actions .button{width:100%}.life-card h2{font-size:24px}}
`);
  write("assets/vedapath-life-companion.js", `const lifeRoot=document.getElementById("lifeCompanion");
if(lifeRoot)initLifeCompanion().catch((error)=>{lifeRoot.innerHTML='<p class="muted">Life Companion could not load local data.</p>';console.error(error);});
async function loadLifeJson(url){const response=await fetch(url);if(!response.ok)throw new Error("Unable to load "+url);return response.json();}
function lifeText(value){return value===0?"0":String(value||"");}
function lifeSafe(value){return lifeText(value).replace(/[&<>"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));}
function lifeStorageKey(){return "vedapath-life-companion-entries";}
function readLife(){try{return JSON.parse(localStorage.getItem(lifeStorageKey())||"[]");}catch(error){return[];}}
function writeLife(rows){localStorage.setItem(lifeStorageKey(),JSON.stringify(rows.slice(0,30)));}
function packetText(item,rows,note){return ["VedaPath Life Companion Packet","State: "+item.state,"Domain: "+item.domain,"Source: "+item.source,"Family: "+item.family,"Signal: "+item.signal,"Reflection: "+item.reflection,"Carry: "+item.carry,"Boundary: "+item.boundary,"Local entries: "+rows.length,"Current note: "+(note||"None"),"","Boundary: reflection support only; not therapy, diagnosis, medical advice, legal advice, emergency support, ritual instruction, or spiritual authority."].join("\\n");}
function renderStats(items,rows){const domains=[...new Set(items.map((item)=>item.domain))].length;lifeRoot.querySelector("#lifeStats").innerHTML=[["Moments",items.length],["Domains",domains],["Local",rows.length],["Actions",items.length]].map((row)=>'<div class="life-stat"><span>'+lifeSafe(row[0])+'</span><strong>'+lifeSafe(row[1])+'</strong></div>').join("");}
function cardHtml(item){return '<div class="life-ribbon"><span>'+lifeSafe(item.domain)+'</span><span>'+lifeSafe(item.source)+'</span><span>'+lifeSafe(item.family)+'</span></div><h2>'+lifeSafe(item.state)+'</h2><p>'+lifeSafe(item.signal)+'</p><strong>Reflection</strong><p>'+lifeSafe(item.reflection)+'</p><strong>Carry action</strong><p>'+lifeSafe(item.carry)+'</p><p class="muted">'+lifeSafe(item.boundary)+'</p><div class="confidence-track"><div class="confidence-fill" style="--score:'+lifeSafe(item.confidence)+'%"></div></div>';}
function renderDomains(items,active){const domains=[...new Set(items.map((item)=>item.domain))];lifeRoot.querySelector("#domainRail").innerHTML=domains.map((domain)=>{const count=items.filter((item)=>item.domain===domain).length;return '<article class="domain-card '+(domain===active.domain?'active':'')+'"><span>'+lifeSafe(domain)+'</span><strong>'+lifeSafe(count)+' moment'+(count===1?'':'s')+'</strong></article>';}).join("");}
function renderHistory(rows){const node=lifeRoot.querySelector("#lifeHistory");if(!rows.length){node.innerHTML='<article class="history-card"><strong>No local entries yet</strong><p class="muted">Save one entry and the local rhythm will begin.</p></article>';return;}node.innerHTML=rows.slice(0,4).map((row)=>'<article class="history-card"><strong>'+lifeSafe(row.state)+'</strong><span>'+lifeSafe(row.source)+'</span><p class="muted">'+lifeSafe(row.note)+' | '+lifeSafe(row.date)+'</p></article>').join("");}
async function initLifeCompanion(){const data=await loadLifeJson("data/vedapath-life-companion.json");const all=data.scenarios||[];const scenarioSelect=lifeRoot.querySelector("#scenarioSelect");const domainSelect=lifeRoot.querySelector("#domainSelect");const note=lifeRoot.querySelector("#lifeNote");const packet=lifeRoot.querySelector("#lifePacket");const state={id:lifeRoot.dataset.scenario||all[0]?.id||"",domain:"All"};function visible(){return state.domain==="All"?all:all.filter((item)=>item.domain===state.domain);}function selected(){return visible().find((item)=>item.id===state.id)||visible()[0]||all[0];}
function fillScenarioOptions(){const options=visible();scenarioSelect.innerHTML=options.map((item)=>'<option value="'+lifeSafe(item.id)+'">'+lifeSafe(item.domain+" | "+item.state)+'</option>').join("");}
function render(){const rows=readLife();fillScenarioOptions();const item=selected();if(!item)return;state.id=item.id;scenarioSelect.value=item.id;domainSelect.value=state.domain;renderStats(all,rows);lifeRoot.querySelector("#lifeCard").innerHTML=cardHtml(item);renderDomains(all,item);packet.value=packetText(item,rows,note.value.trim());renderHistory(rows);}
scenarioSelect.addEventListener("change",()=>{state.id=scenarioSelect.value;render();});domainSelect.addEventListener("change",()=>{state.domain=domainSelect.value;state.id="";render();});note.addEventListener("input",render);lifeRoot.querySelector("#saveLifeEntry").addEventListener("click",()=>{const item=selected();const rows=readLife();rows.unshift({state:item.state,domain:item.domain,source:item.source,note:note.value.trim()||item.carry,date:new Date().toISOString().slice(0,10)});writeLife(rows);note.value="";render();});lifeRoot.querySelector("#clearLifeEntries").addEventListener("click",()=>{localStorage.removeItem(lifeStorageKey());render();});lifeRoot.querySelector("#copyLifePacket").addEventListener("click",()=>{packet.focus();packet.select();const button=lifeRoot.querySelector("#copyLifePacket");const original=button.textContent;const done=()=>{button.textContent="Copied Packet";window.setTimeout(()=>{button.textContent=original;},1400);};const fallback=()=>{try{document.execCommand("copy");}catch(error){return;}done();};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(packet.value).then(done).catch(fallback);return;}fallback();});render();}
`);
}
function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH LIFE COMPANION SPRINT LINKS START -->", "<!-- VEDAPATH LIFE COMPANION SPRINT LINKS END -->", links, "<!-- VEDAPATH MANTRA LENS SPRINT LINKS END -->");
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH LIFE COMPANION SPRINT FEATURES START -->", "<!-- VEDAPATH LIFE COMPANION SPRINT FEATURES END -->", features, "<!-- VEDAPATH MANTRA LENS SPRINT FEATURES END -->");
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}
function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH LIFE COMPANION SPRINT NOTES START -->", "<!-- VEDAPATH LIFE COMPANION SPRINT NOTES END -->", notes, "<!-- VEDAPATH MANTRA LENS SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", content);
}
function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH LIFE COMPANION SPRINT SUMMARY START -->", "<!-- VEDAPATH LIFE COMPANION SPRINT SUMMARY END -->", summary, "<!-- VEDAPATH MANTRA LENS SPRINT SUMMARY END -->");
  const sections = visible.map((item, index) => `### ${238 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: reflection support only, not authority
- keep personal entries local until explicit accounts and consent exist

${shortTitle(item)} should never claim therapy, diagnosis, medical advice, legal advice, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(content, "<!-- VEDAPATH LIFE COMPANION SPRINT BLUEPRINT START -->", "<!-- VEDAPATH LIFE COMPANION SPRINT BLUEPRINT END -->", sections, "<!-- VEDAPATH MANTRA LENS SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", content);
}
function updateBuildStatus() {
  let content = read("build-status.html");
  const meta = `Updated June 26, 2026 | Branch main | <strong>${active.badge}</strong> | <a href="index.html">Home</a> | <a href="blueprint.html">Blueprint</a> | <a href="sourcelibrary.html">Sources</a> | <a href="retrievallab.html">Retrieval</a> | <a href="citedanswerlab.html">Answers</a> | <a href="mantralenslab.html">Mantra</a> | <a href="${active.slug}.html">Life</a>`;
  content = content.replace(/<div class="meta">[\s\S]*?<\/div>\s*<\/header>/, `<div class="meta">${meta}</div>\n      </header>`);
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${active.version}</strong>\n          <p>Life Companion sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Life Companion sprint progress: ${visible.length}/10 rooms complete. The MVP now has a personal calm standard.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Life path: arrival, domains, steadiness, relationship, work, family, decisions, evening, and mobile polish.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>${future[0]?.version || "Founder instruction"}</strong>\n          <p>${future[0] ? shortTitle(future[0]) : "Life Companion sprint complete. Next release waits for founder instruction."}</p>`);
  const phaseBody = visible.concat(future).map((item, index) => `            <article class="phase">\n              <span class="badge ${index <= upto ? "done" : "later"}">${index <= upto ? "Done" : "Later"}</span>\n              <div>\n                <strong>Phase ${219 + index}: ${shortTitle(item)}</strong>\n                <p>${item.summary}</p>\n              </div>\n              <div class="percent">${index <= upto ? "100%" : "0%"}</div>\n            </article>`).join("\n");
  content = upsertBlock(content, "            <!-- VEDAPATH LIFE COMPANION SPRINT PHASES START -->", "            <!-- VEDAPATH LIFE COMPANION SPRINT PHASES END -->", phaseBody, "            <!-- VEDAPATH MANTRA LENS SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${219 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.5.4 Mantra Lens Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Life Companion sprint complete" : `${visible.length}/10 Life Companion rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>\n              <li><span class="dot"></span><span>Keep the path simple: arrive, source, carry, local memory.</span></li>\n              <li><span class="dot"></span><span>Do not claim therapy, diagnosis, emergency support, legal advice, ritual instruction, or spiritual authority.</span></li>\n              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before production accounts, clinical boundaries, or durable memory."}</span></li>\n            </ul>`);
  write("build-status.html", content);
}
function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">\n            <h2>${item.nav}</h2>\n            <p class="muted">${item.summary}</p>\n            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>\n          </section>`).join("\n\n");
  content = upsertBlock(content, "          <!-- VEDAPATH LIFE COMPANION SPRINT HOME START -->", "          <!-- VEDAPATH LIFE COMPANION SPRINT HOME END -->", cards, "          <!-- VEDAPATH MANTRA LENS SPRINT HOME END -->");
  write("index.html", content);
}
function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">\n            <h3>${shortTitle(item)}</h3>\n            <p>${item.summary}</p>\n          </div>`).join("\n");
  content = upsertBlock(content, "          <!-- VEDAPATH LIFE COMPANION SPRINT FEATURES START -->", "          <!-- VEDAPATH LIFE COMPANION SPRINT FEATURES END -->", cards, "          <!-- VEDAPATH MANTRA LENS SPRINT FEATURES END -->");
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeLifeAssets();
for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) normalizeNav(rel);
if (existsSync(file("brand/brand-board.html"))) normalizeNav("brand/brand-board.html");
updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();
console.log(`Generated life-companion sprint through ${active.version} (${visible.length}/10).`);

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const signals = [
  {
    id: "work-pressure",
    label: "Work pressure",
    domain: "Work",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    pattern: "Outcome worry appears before the next action is clear.",
    helpful: "Choose one owned task and one clean request.",
    reflection: "Which part is mine to do now, and which part needs a request?",
    boundary: "Not career advice, HR guidance, legal advice, or a success promise.",
    confidence: 78
  },
  {
    id: "reply-heat",
    label: "Reply heat",
    domain: "Conversation",
    source: "Bhagavad Gita 17.15",
    family: "Bhagavad Gita | Smriti",
    pattern: "The first reply is usually faster than the truest reply.",
    helpful: "Wait, remove one sharp line, then send only what is useful.",
    reflection: "Can this be truthful, useful, and less agitating?",
    boundary: "Not mediation, legal advice, safety planning, therapy, or spiritual authority.",
    confidence: 68
  },
  {
    id: "family-pull",
    label: "Family pull",
    domain: "Family",
    source: "Taittiriya Upanishad 1.11.2",
    family: "Upanishad | Shruti",
    pattern: "Care and control can become mixed when the stakes feel personal.",
    helpful: "Offer one concrete help and leave space for the other person.",
    reflection: "What is respectful care, and what is control wearing care's language?",
    boundary: "Not family therapy, medical advice, elder-care instruction, or legal advice.",
    confidence: 55
  },
  {
    id: "night-loop",
    label: "Night loop",
    domain: "Evening",
    source: "Bhagavad Gita 6.26",
    family: "Bhagavad Gita | Smriti",
    pattern: "The mind returns to unfinished loops when the day has no landing place.",
    helpful: "Write one tomorrow item and close the rest for tonight.",
    reflection: "What can be placed down for tonight without pretending it is solved?",
    boundary: "Not sleep treatment, clinical care, diagnosis, or emergency support.",
    confidence: 63
  },
  {
    id: "decision-fog",
    label: "Decision fog",
    domain: "Decision",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    pattern: "The pleasant and beneficial are hard to separate under pressure.",
    helpful: "Name one comfort, one cost, and one responsibility for each option.",
    reflection: "Which option only soothes the moment, and which also serves clarity?",
    boundary: "Not moral policing, financial advice, legal advice, or a command.",
    confidence: 70
  },
  {
    id: "gratitude-signal",
    label: "Gratitude signal",
    domain: "Thanks",
    source: "Taittiriya Upanishad 1.11.2",
    family: "Upanishad | Shruti",
    pattern: "Specific thanks makes helpfulness easier to notice and repeat.",
    helpful: "Name the concrete gift and why it mattered.",
    reflection: "Can gratitude name the gift without demanding anything back?",
    boundary: "Not ritual instruction, social scripting for every culture, or obligation.",
    confidence: 54
  }
];

const sampleEntries = [
  { date: "2026-06-20", signal: "work-pressure", source: "Bhagavad Gita 2.47", note: "Next owned task before outcome worry." },
  { date: "2026-06-21", signal: "reply-heat", source: "Bhagavad Gita 17.15", note: "Removed one sharp sentence before sending." },
  { date: "2026-06-22", signal: "night-loop", source: "Bhagavad Gita 6.26", note: "Moved one item to tomorrow." },
  { date: "2026-06-23", signal: "gratitude-signal", source: "Taittiriya Upanishad 1.11.2", note: "Sent specific thanks." }
];

const releases = [
  ["v2.7.5", "v2.7.5 pattern arrival", "patternarrival", "Arrival", "VedaPath Pattern Arrival", "Pattern arrival", "Private pattern seed", "Let use become learning.", "A first pattern room that shows how local entries can become gentle product insight without accounts or silent profiling.", "Local calm pattern", "reply-heat", 10, "Local Signal Map", "Create the first local pattern doorway.", "Pattern Arrival starts the learning layer while keeping identity and memory local."],
  ["v2.7.6", "v2.7.6 local signal map", "localsignalmap", "Signals", "VedaPath Local Signal Map", "Local signal map", "Private signals", "Map what keeps returning.", "A local signal map that groups repeated life and conversation moments by domain, source family, and helpful action.", "Local signal map", "work-pressure", 20, "Calm Heatmap", "Add domain and source-family patterning.", "Local Signal Map shows how VedaPath can learn from use without storing a user in the cloud."],
  ["v2.7.7", "v2.7.7 calm heatmap", "calmheatmap", "Heatmap", "VedaPath Calm Heatmap", "Calm heatmap", "Weekly rhythm", "See the week without judging it.", "A calm heatmap that turns saved entries into a simple weekly rhythm view, with no diagnosis or score of the person.", "Weekly calm rhythm", "night-loop", 30, "Situation Lens", "Add a simple seven-day pattern view.", "Calm Heatmap makes repeated moments visible without turning life into a performance metric."],
  ["v2.7.8", "v2.7.8 situation lens", "situationlens", "Lens", "VedaPath Situation Lens", "Situation lens", "Context before conclusion", "Name the situation before naming the self.", "A situation lens that keeps patterns tied to context, not identity, so the user is never labeled as the problem.", "Context patterning", "family-pull", 40, "Helpful Action Library", "Add context-first pattern language.", "Situation Lens protects dignity by describing conditions and actions instead of labeling the user."],
  ["v2.7.9", "v2.7.9 helpful action library", "helpfulactionlibrary", "Actions", "VedaPath Helpful Action Library", "Helpful action library", "What helped before", "Return to the action that helped.", "A helpful action library that remembers small source-backed actions, then offers them again when similar signals return.", "Helpful action memory", "gratitude-signal", 50, "Source Match Memory", "Create reusable helpful-action cards.", "Helpful Action Library gives the product a memory of what actually helped, not just what was asked."],
  ["v2.8.0", "v2.8.0 source match memory", "sourcematchmemory", "Source", "VedaPath Source Match Memory", "Source match memory", "Source fit over novelty", "Match sources by need, not novelty.", "A source match memory that shows which source candidates helped which kinds of moments, with confidence and boundaries.", "Source patterning", "decision-fog", 60, "Weekly Reflection", "Add source-to-signal matching.", "Source Match Memory makes citations feel alive while staying careful about overclaim."],
  ["v2.8.1", "v2.8.1 weekly reflection", "weeklyreflection", "Week", "VedaPath Weekly Reflection", "Weekly reflection", "One week, one insight", "Look back softly, carry forward simply.", "A weekly reflection room that summarizes patterns, helpful actions, and one next carry action without moralizing the week.", "Weekly insight", "work-pressure", 70, "Privacy Export", "Add weekly pattern summary.", "Weekly Reflection turns product memory into one humane review instead of endless dashboards."],
  ["v2.8.2", "v2.8.2 privacy export", "privacyexport", "Privacy", "VedaPath Privacy Export", "Privacy export", "User owns memory", "Export or clear without friction.", "A privacy export room that previews download/delete thinking for local pattern memory before real accounts and consent exist.", "Memory rights", "reply-heat", 80, "Mobile Pattern", "Add export and clear boundaries.", "Privacy Export makes trust tangible by giving the user control over local pattern memory."],
  ["v2.8.3", "v2.8.3 mobile pattern", "mobilepattern", "Mobile", "VedaPath Mobile Pattern", "Mobile pattern", "Patterns on a phone", "Tiny screen, clear insight.", "A mobile pattern room that keeps insights readable, actions thumb-friendly, and memory controls visible on small screens.", "Mobile pattern review", "night-loop", 90, "Pattern Companion Control Room", "Protect pattern learning on mobile.", "Mobile Pattern keeps the learning loop usable where calm moments actually happen."],
  ["v2.8.4", "v2.8.4 pattern companion", "patterncompanionlab", "Pattern", "VedaPath Pattern Companion Control Room", "Pattern companion", "Local wisdom loop", "Let calm remember what helped.", "A control room that combines signal map, weekly rhythm, situation lens, helpful actions, source match, privacy export, and mobile pattern review.", "Private pattern learning", "reply-heat", 100, "Founder instruction", "Use this as the first local learning standard for the trusted MVP.", "Pattern Companion Control Room completes the private local learning layer for VedaPath AI."]
].map(([version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, defaultSignal, sprintPercent, next, primaryAsk, summary]) => ({
  version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, defaultSignal, sprintPercent, next, primaryAsk, summary,
  items: [
    ["Collect", "Read local preview entries and sample signals.", "Starts gently."],
    ["Group", "Show domains, sources, and helpful actions.", "Finds patterns."],
    ["Reflect", "Offer one weekly insight without judging.", "Keeps dignity."],
    ["Control", "Let the user copy, export, or clear memory.", "Protects trust."]
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
    brief: [
      ["Pattern promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", "Pattern memory must remain local, visible, copyable, and clearable until explicit account consent exists."]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No diagnosis", "Do not label the user, infer mental health, or predict personal outcomes."],
      ["No hidden profile", "Do not silently sync, sell, or reuse pattern memory."],
      ["No authority voice", "Offer reflective pattern candidates, not commands or moral verdicts."]
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
    ["citedanswerlab.html", "Answers"],
    ["mantralenslab.html", "Mantra"],
    ["lifecompanionlab.html", "Life"],
    ["conversationcompanionlab.html", "Talk"],
    [active.slug + ".html", "Pattern"],
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
  const css = `
      /* VEDAPATH COMPACT NAV */
      .nav { max-width: 840px; }
      .nav .link, .nav .version { white-space: nowrap; }
      @media (max-width: 780px) {
        .nav { gap: 6px; }
        .nav .link, .nav .version {
          min-height: 32px;
          padding: 5px 9px;
          font-size: 12px;
        }
      }
`;
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
function patternData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "pattern companion prototype",
    warning: "Prototype local pattern support only. Not diagnosis, therapy, legal advice, medical advice, surveillance, scoring, or spiritual authority.",
    localStorageKeys: [
      "vedapath-life-companion-entries",
      "vedapath-conversation-companion-drafts",
      "vedapath-pattern-companion-entries"
    ],
    signals,
    sampleEntries
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
    <link rel="stylesheet" href="assets/vedapath-pattern-companion.css">
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
          <span class="eyebrow">Pattern sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten rooms let VedaPath learn from use while memory stays visible and local.</p>
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

          <div class="source-block" aria-label="Release pattern card">
            <div><span class="source-meta">Release</span><span class="source-value">${item.version}</span></div>
            <div><span class="source-meta">Use case</span><span class="source-value">${item.source}</span></div>
            <div><span class="source-meta">Founder move</span><span class="source-value">${item.primaryAsk}</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">Local pattern, not profile.</span></div>
          </div>

          <section class="pattern-companion" id="patternCompanion" data-signal="${item.defaultSignal}" aria-label="Pattern Companion">
            <div class="pattern-head">
              <div>
                <span class="eyebrow">Local learning support</span>
                <h2>Pattern Companion</h2>
                <p class="muted">Reads source-backed sample signals plus local preview entries from Life and Conversation rooms.</p>
              </div>
              <div id="patternStats" class="pattern-stats" aria-live="polite"></div>
            </div>

            <div class="pattern-tools">
              <label for="signalSelect">Signal</label>
              <select id="signalSelect"></select>
              <label for="domainSelect">Domain</label>
              <select id="domainSelect">
                <option value="All">All domains</option>
                <option value="Work">Work</option>
                <option value="Conversation">Conversation</option>
                <option value="Family">Family</option>
                <option value="Evening">Evening</option>
                <option value="Decision">Decision</option>
                <option value="Thanks">Thanks</option>
              </select>
            </div>

            <div class="pattern-layout">
              <div>
                <div id="patternCard" class="pattern-card"></div>
                <label class="pattern-label" for="patternNote">One local observation</label>
                <textarea id="patternNote" aria-label="Pattern note" placeholder="What helped today?"></textarea>
                <div class="pattern-actions">
                  <button class="button primary" id="savePatternEntry" type="button">Save Signal</button>
                  <button class="button safe" id="copyPatternReport" type="button">Copy Report</button>
                  <button class="button" id="clearPatternEntries" type="button">Clear Pattern Memory</button>
                </div>
              </div>
              <div>
                <div id="patternRail" class="pattern-rail"></div>
                <label class="pattern-label" for="patternReport">Pattern report</label>
                <textarea id="patternReport" readonly aria-label="Pattern Companion report"></textarea>
                <div id="patternHistory" class="pattern-history" aria-label="Local pattern entries"></div>
              </div>
            </div>
          </section>

          <h2>Pattern Signals</h2>
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
          <span class="badge green">Pattern Companion</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent"><div class="bar" style="--score:${item.sprintPercent}%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${item.version}</strong></div>
            <div class="metric"><span>Sprint</span><strong>${visible.length}/10</strong></div>
            <div class="metric"><span>Signals</span><strong>${signals.length}</strong></div>
            <div class="metric"><span>Next</span><strong>${item.next}</strong></div>
          </div>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Collect</strong><p>Local entries.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Group</strong><p>Patterns.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Reflect</strong><p>One insight.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Control</strong><p>Copy or clear.</p></div></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Pattern Boundary</h2>
            <p class="muted">This lab is not diagnosis, therapy, legal advice, medical advice, surveillance, scoring, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>
    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-pattern-companion.js"></script>
  </body>
</html>
`;
}
function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Pattern Focus

- Use case: ${item.source}
- Founder action: ${item.primaryAsk}
- Boundary: local pattern support only, not profiling

## Product Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Data Sources

- data/vedapath-pattern-companion.json
- localStorage: vedapath-life-companion-entries
- localStorage: vedapath-conversation-companion-drafts
- localStorage: vedapath-pattern-companion-entries

## No-Go Boundary

This release should not imply diagnosis, therapy, legal advice, medical advice, surveillance, scoring, or spiritual authority.
`;
}
function writePatternAssets() {
  write("data/vedapath-pattern-companion.json", `${safeJson(patternData())}\n`);
  write("assets/vedapath-pattern-companion.css", `/* VedaPath Pattern Companion */
.pattern-companion{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:8px;background:rgba(255,253,248,.9)}
.pattern-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,280px);gap:14px;align-items:start}.pattern-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.pattern-stat,.pattern-card,.pattern-mini,.pattern-history-card{border:1px solid var(--line);border-radius:8px;background:var(--surface)}.pattern-stat{padding:10px}.pattern-stat span,.pattern-mini span,.pattern-history-card span,.pattern-tools label,.pattern-label{display:block;color:var(--muted);font-size:12px}.pattern-stat strong{display:block;font-size:22px;line-height:1.1}
.pattern-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}.pattern-tools select,#patternNote,#patternReport{width:100%;border:1px solid #efc1aa;border-radius:8px;background:#fffaf4;color:var(--ink);padding:12px;font-weight:750}
.pattern-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,1fr);gap:14px;align-items:start}.pattern-card{padding:18px;border-left:4px solid var(--bhagwa)}.pattern-card h2{font-size:30px;line-height:1.05}.pattern-ribbon{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.pattern-ribbon span{border:1px solid #efc1aa;border-radius:999px;padding:5px 9px;color:var(--ochre);font-size:12px;font-weight:900;background:#fff8f2}.confidence-track{height:9px;border-radius:999px;overflow:hidden;background:#f1dcd2;margin-top:10px}.confidence-fill{height:100%;width:var(--score);background:linear-gradient(90deg,var(--bhagwa),var(--gold))}
.pattern-rail,.pattern-history{display:grid;gap:8px}.pattern-mini,.pattern-history-card{padding:11px}.pattern-mini.active{border-color:#f09f79;background:#fff0e7}.pattern-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.pattern-label{margin:12px 0 6px;font-weight:850}#patternNote{min-height:92px;resize:vertical}#patternReport{min-height:230px;resize:vertical}
@media(max-width:860px){.pattern-head,.pattern-stats,.pattern-tools,.pattern-layout{grid-template-columns:1fr}.pattern-actions .button{width:100%}.pattern-card h2{font-size:24px}}
`);
  write("assets/vedapath-pattern-companion.js", `const patternRoot=document.getElementById("patternCompanion");
if(patternRoot)initPatternCompanion().catch((error)=>{patternRoot.innerHTML='<p class="muted">Pattern Companion could not load local data.</p>';console.error(error);});
async function loadPatternJson(url){const response=await fetch(url);if(!response.ok)throw new Error("Unable to load "+url);return response.json();}
function patternText(value){return value===0?"0":String(value||"");}
function patternSafe(value){return patternText(value).replace(/[&<>"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));}
function patternKey(){return "vedapath-pattern-companion-entries";}
function readPatternKey(key){try{return JSON.parse(localStorage.getItem(key)||"[]");}catch(error){return[];}}
function writePattern(rows){localStorage.setItem(patternKey(),JSON.stringify(rows.slice(0,60)));}
function normalizeRows(rows,kind){return rows.map((row)=>({date:row.date||new Date().toISOString().slice(0,10),signal:row.signal||row.state||row.domain||kind,source:row.source||"Local preview",note:row.note||row.draft||row.carry||"Local preview entry",kind}));}
function allRows(data){return [].concat(data.sampleEntries||[],normalizeRows(readPatternKey("vedapath-life-companion-entries"),"life"),normalizeRows(readPatternKey("vedapath-conversation-companion-drafts"),"conversation"),normalizeRows(readPatternKey(patternKey()),"pattern"));}
function countBy(rows,key){return rows.reduce((acc,row)=>{const value=row[key]||"Unknown";acc[value]=(acc[value]||0)+1;return acc;},{});}
function topValue(map){return Object.entries(map).sort((a,b)=>b[1]-a[1])[0]||["None",0];}
function cardHtml(item){return '<div class="pattern-ribbon"><span>'+patternSafe(item.domain)+'</span><span>'+patternSafe(item.source)+'</span><span>'+patternSafe(item.family)+'</span></div><h2>'+patternSafe(item.label)+'</h2><p>'+patternSafe(item.pattern)+'</p><strong>Helpful action</strong><p>'+patternSafe(item.helpful)+'</p><strong>Reflection</strong><p>'+patternSafe(item.reflection)+'</p><p class="muted">'+patternSafe(item.boundary)+'</p><div class="confidence-track"><div class="confidence-fill" style="--score:'+patternSafe(item.confidence)+'%"></div></div>';}
function reportText(item,rows,filtered){const topSignal=topValue(countBy(rows,"signal"));const topSource=topValue(countBy(rows,"source"));return ["VedaPath Pattern Companion Report","Selected signal: "+item.label,"Domain: "+item.domain,"Source candidate: "+item.source,"Total local/sample entries: "+rows.length,"Visible entries: "+filtered.length,"Most repeated signal: "+topSignal[0]+" ("+topSignal[1]+")","Most repeated source: "+topSource[0]+" ("+topSource[1]+")","Helpful action: "+item.helpful,"Reflection: "+item.reflection,"","Boundary: local pattern support only; not diagnosis, therapy, legal advice, medical advice, surveillance, scoring, or spiritual authority."].join("\\n");}
function renderStats(rows,filtered){const topSignal=topValue(countBy(rows,"signal"));const topKind=topValue(countBy(rows,"kind"));patternRoot.querySelector("#patternStats").innerHTML=[["Entries",rows.length],["Visible",filtered.length],["Top signal",topSignal[0]],["Memory",topKind[0]]].map((row)=>'<div class="pattern-stat"><span>'+patternSafe(row[0])+'</span><strong>'+patternSafe(row[1])+'</strong></div>').join("");}
function renderRail(signals,active,rows){const counts=countBy(rows,"signal");patternRoot.querySelector("#patternRail").innerHTML=signals.map((signal)=>'<article class="pattern-mini '+(signal.id===active.id?'active':'')+'"><span>'+patternSafe(signal.domain)+'</span><strong>'+patternSafe(signal.label)+'</strong><p class="muted">'+patternSafe((counts[signal.id]||0)+" matching entries")+'</p></article>').join("");}
function renderHistory(rows){const node=patternRoot.querySelector("#patternHistory");if(!rows.length){node.innerHTML='<article class="pattern-history-card"><strong>No local pattern entries yet</strong><p class="muted">Save one signal and the local learning loop will begin.</p></article>';return;}node.innerHTML=rows.slice(0,5).map((row)=>'<article class="pattern-history-card"><strong>'+patternSafe(row.signal)+'</strong><span>'+patternSafe(row.source)+'</span><p class="muted">'+patternSafe(row.note)+' | '+patternSafe(row.date)+'</p></article>').join("");}
async function initPatternCompanion(){const data=await loadPatternJson("data/vedapath-pattern-companion.json");const signals=data.signals||[];const signalSelect=patternRoot.querySelector("#signalSelect");const domainSelect=patternRoot.querySelector("#domainSelect");const note=patternRoot.querySelector("#patternNote");const report=patternRoot.querySelector("#patternReport");const state={id:patternRoot.dataset.signal||signals[0]?.id||"",domain:"All"};function visibleSignals(){return state.domain==="All"?signals:signals.filter((item)=>item.domain===state.domain);}function selected(){return visibleSignals().find((item)=>item.id===state.id)||visibleSignals()[0]||signals[0];}
function fillSignals(){signalSelect.innerHTML=visibleSignals().map((item)=>'<option value="'+patternSafe(item.id)+'">'+patternSafe(item.domain+" | "+item.label)+'</option>').join("");}
function filteredRows(rows,item){return rows.filter((row)=>state.domain==="All"||row.signal===item.id||row.signal===item.label||row.kind===state.domain.toLowerCase());}
function render(){const rows=allRows(data);fillSignals();const item=selected();if(!item)return;state.id=item.id;signalSelect.value=item.id;domainSelect.value=state.domain;const filtered=filteredRows(rows,item);renderStats(rows,filtered);patternRoot.querySelector("#patternCard").innerHTML=cardHtml(item);renderRail(signals,item,rows);report.value=reportText(item,rows,filtered);renderHistory(rows);}
signalSelect.addEventListener("change",()=>{state.id=signalSelect.value;render();});domainSelect.addEventListener("change",()=>{state.domain=domainSelect.value;state.id="";render();});note.addEventListener("input",render);
patternRoot.querySelector("#savePatternEntry").addEventListener("click",()=>{const item=selected();const rows=readPatternKey(patternKey());rows.unshift({date:new Date().toISOString().slice(0,10),signal:item.id,source:item.source,note:note.value.trim()||item.helpful,kind:"pattern"});writePattern(rows);note.value="";render();});
patternRoot.querySelector("#clearPatternEntries").addEventListener("click",()=>{localStorage.removeItem(patternKey());render();});
patternRoot.querySelector("#copyPatternReport").addEventListener("click",()=>{report.focus();report.select();const button=patternRoot.querySelector("#copyPatternReport");const original=button.textContent;const done=()=>{button.textContent="Copied Report";window.setTimeout(()=>{button.textContent=original;},1400);};const fallback=()=>{try{document.execCommand("copy");}catch(error){return;}done();};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(report.value).then(done).catch(fallback);return;}fallback();});
render();}
`);
}
function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH PATTERN COMPANION SPRINT LINKS START -->", "<!-- VEDAPATH PATTERN COMPANION SPRINT LINKS END -->", links, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT LINKS END -->");
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH PATTERN COMPANION SPRINT FEATURES START -->", "<!-- VEDAPATH PATTERN COMPANION SPRINT FEATURES END -->", features, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT FEATURES END -->");
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}
function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH PATTERN COMPANION SPRINT NOTES START -->", "<!-- VEDAPATH PATTERN COMPANION SPRINT NOTES END -->", notes, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", content);
}
function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH PATTERN COMPANION SPRINT SUMMARY START -->", "<!-- VEDAPATH PATTERN COMPANION SPRINT SUMMARY END -->", summary, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT SUMMARY END -->");
  const sections = visible.map((item, index) => `### ${258 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: local pattern support only, not profiling
- keep pattern memory visible, copyable, and clearable

${shortTitle(item)} should never claim diagnosis, therapy, legal advice, medical advice, surveillance, scoring, or spiritual authority.`).join("\n\n");
  content = upsertBlock(content, "<!-- VEDAPATH PATTERN COMPANION SPRINT BLUEPRINT START -->", "<!-- VEDAPATH PATTERN COMPANION SPRINT BLUEPRINT END -->", sections, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", content);
}
function updateBuildStatus() {
  let content = read("build-status.html");
  const meta = `Updated June 26, 2026 | Branch main | <strong>${active.badge}</strong> | <a href="index.html">Home</a> | <a href="blueprint.html">Blueprint</a> | <a href="citedanswerlab.html">Answers</a> | <a href="mantralenslab.html">Mantra</a> | <a href="lifecompanionlab.html">Life</a> | <a href="conversationcompanionlab.html">Talk</a> | <a href="${active.slug}.html">Pattern</a>`;
  content = content.replace(/<div class="meta">[\s\S]*?<\/div>\s*<\/header>/, `<div class="meta">${meta}</div>\n      </header>`);
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${active.version}</strong>\n          <p>Pattern Companion sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Pattern Companion sprint progress: ${visible.length}/10 rooms complete. The MVP now has a local learning standard.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Pattern path: signal map, weekly rhythm, context lens, helpful action library, source match, privacy export, and mobile review.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>${future[0]?.version || "Founder instruction"}</strong>\n          <p>${future[0] ? shortTitle(future[0]) : "Pattern Companion sprint complete. Next release waits for founder instruction."}</p>`);
  const phaseBody = visible.concat(future).map((item, index) => `            <article class="phase">\n              <span class="badge ${index <= upto ? "done" : "later"}">${index <= upto ? "Done" : "Later"}</span>\n              <div>\n                <strong>Phase ${239 + index}: ${shortTitle(item)}</strong>\n                <p>${item.summary}</p>\n              </div>\n              <div class="percent">${index <= upto ? "100%" : "0%"}</div>\n            </article>`).join("\n");
  content = upsertBlock(content, "            <!-- VEDAPATH PATTERN COMPANION SPRINT PHASES START -->", "            <!-- VEDAPATH PATTERN COMPANION SPRINT PHASES END -->", phaseBody, "            <!-- VEDAPATH CONVERSATION COMPANION SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${239 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.7.4 Conversation Companion Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Pattern Companion sprint complete" : `${visible.length}/10 Pattern rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>\n              <li><span class="dot"></span><span>Keep the path simple: collect, group, reflect, control.</span></li>\n              <li><span class="dot"></span><span>Do not claim diagnosis, therapy, legal advice, medical advice, surveillance, scoring, or spiritual authority.</span></li>\n              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before production accounts, cloud memory, or reviewer analytics."}</span></li>\n            </ul>`);
  write("build-status.html", content);
}
function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">\n            <h2>${item.nav}</h2>\n            <p class="muted">${item.summary}</p>\n            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>\n          </section>`).join("\n\n");
  content = upsertBlock(content, "          <!-- VEDAPATH PATTERN COMPANION SPRINT HOME START -->", "          <!-- VEDAPATH PATTERN COMPANION SPRINT HOME END -->", cards, "          <!-- VEDAPATH CONVERSATION COMPANION SPRINT HOME END -->");
  write("index.html", content);
}
function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">\n            <h3>${shortTitle(item)}</h3>\n            <p>${item.summary}</p>\n          </div>`).join("\n");
  content = upsertBlock(content, "          <!-- VEDAPATH PATTERN COMPANION SPRINT FEATURES START -->", "          <!-- VEDAPATH PATTERN COMPANION SPRINT FEATURES END -->", cards, "          <!-- VEDAPATH CONVERSATION COMPANION SPRINT FEATURES END -->");
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writePatternAssets();
for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) normalizeNav(rel);
if (existsSync(file("brand/brand-board.html"))) normalizeNav("brand/brand-board.html");
updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();
console.log(`Generated pattern-companion sprint through ${active.version} (${visible.length}/10).`);

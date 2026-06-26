import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const situations = [
  {
    id: "reply-pause",
    state: "Reply pause",
    relation: "Any message",
    source: "Bhagavad Gita 17.15",
    family: "Bhagavad Gita | Smriti",
    signal: "You need to respond, but the first reply may be sharper than the real need.",
    draft: "I want to answer carefully, not react quickly. Give me a little time and I will come back with a clearer response.",
    reflection: "Can this reply be truthful, useful, and less agitating?",
    boundary: "Reflection support only. Not mediation, legal advice, safety planning, therapy, or spiritual authority.",
    tone: "steady",
    confidence: 68
  },
  {
    id: "truth-kindness",
    state: "Truth with care",
    relation: "Difficult truth",
    source: "Bhagavad Gita 17.15",
    family: "Bhagavad Gita | Smriti",
    signal: "Something true needs to be said without turning truth into a weapon.",
    draft: "I want to be honest and respectful. Here is what I am seeing, and I am open to hearing what I may be missing.",
    reflection: "Is the message true, timely, and useful, or only emotionally satisfying?",
    boundary: "Not a command to speak in every situation. Safety and context matter.",
    tone: "direct",
    confidence: 70
  },
  {
    id: "apology-repair",
    state: "Apology draft",
    relation: "Repair",
    source: "Bhagavad Gita 16.2",
    family: "Bhagavad Gita | Smriti",
    signal: "You see your part and want to repair without performing guilt.",
    draft: "I am sorry for my part in this. I can see how it affected you. I will be more careful with this specific action next time.",
    reflection: "What part is mine to own clearly, without explaining it away?",
    boundary: "Not legal advice, confession handling, clinical repair, or pressure for forgiveness.",
    tone: "humble",
    confidence: 56
  },
  {
    id: "boundary-no",
    state: "Boundary reply",
    relation: "No with respect",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    signal: "You need to say no without becoming cold or overexplaining.",
    draft: "I cannot take this on right now. I respect the need, but I need to keep my boundary clear.",
    reflection: "Can the no be clear, kind, and free from unnecessary defense?",
    boundary: "Not safety planning, legal advice, workplace HR guidance, or family mediation.",
    tone: "firm",
    confidence: 66
  },
  {
    id: "family-message",
    state: "Family message",
    relation: "Family",
    source: "Taittiriya Upanishad 1.11.2",
    family: "Upanishad | Shruti",
    signal: "Care, expectation, and old patterns are mixed together.",
    draft: "I care about this relationship, and I want to speak with respect. I can help with one concrete thing, but I cannot carry the whole situation.",
    reflection: "What is respectful care, and what is control wearing the language of care?",
    boundary: "Not family therapy, medical advice, elder-care instruction, legal advice, or a rule for every household.",
    tone: "warm",
    confidence: 55
  },
  {
    id: "work-message",
    state: "Work message",
    relation: "Work",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    signal: "Work pressure is making the message either defensive or vague.",
    draft: "Here is what I can own, here is the next step, and here is what I need from the team to move cleanly.",
    reflection: "Which part of this work is mine to do, and which part needs a clear request?",
    boundary: "Not employment advice, HR guidance, legal advice, or a promise of success.",
    tone: "clear",
    confidence: 78
  },
  {
    id: "gratitude-note",
    state: "Gratitude note",
    relation: "Thanks",
    source: "Taittiriya Upanishad 1.11.2",
    family: "Upanishad | Shruti",
    signal: "You want to thank someone without making it dramatic or transactional.",
    draft: "Thank you for what you did. It mattered to me because it made this specific part of life easier.",
    reflection: "Can gratitude name the concrete gift without demanding anything back?",
    boundary: "Not ritual instruction, social scripting for every culture, or emotional obligation.",
    tone: "grateful",
    confidence: 54
  },
  {
    id: "repair-followup",
    state: "Repair loop",
    relation: "After conflict",
    source: "Bhagavad Gita 6.26",
    family: "Bhagavad Gita | Smriti",
    signal: "The mind keeps replaying the conversation and needs a clean next step.",
    draft: "I have thought about our conversation. One thing I want to repair is this: I should have listened before responding.",
    reflection: "What one repair action can I take without trying to control the outcome?",
    boundary: "Not mediation, safety planning, therapy, legal advice, or pressure to reconnect.",
    tone: "repair",
    confidence: 62
  }
];

const tones = [
  ["steady", "Steady", "Slower, calmer, and less reactive."],
  ["direct", "Direct", "Clear truth without unnecessary heat."],
  ["warm", "Warm", "Careful, humane, and relational."],
  ["firm", "Firm", "Respectful boundary with fewer explanations."],
  ["humble", "Humble", "Owns your part without self-erasing."]
];

const releases = [
  ["v2.6.5", "v2.6.5 reply arrival", "replyarrival", "Reply", "VedaPath Reply Arrival", "Reply arrival", "Arrive before replying", "A pause before the message becomes harm.", "A conversation entry room that lets users name the reply situation, choose a tone, and generate a source-bounded first draft.", "Reply pause", "reply-pause", 10, "Speech Filter", "Create the first calm reply doorway.", "Reply Arrival makes VedaPath useful at the exact moment a person is about to send something."],
  ["v2.6.6", "v2.6.6 speech filter", "speechfilter", "Speech", "VedaPath Speech Filter", "Speech filter", "Truth with usefulness", "Filter the message before it filters the relationship.", "A speech filter that separates truth, usefulness, warmth, timing, and overclaim before a user sends a difficult message.", "Careful speech", "truth-kindness", 20, "Apology Draft", "Add a truth-usefulness-kindness check.", "Speech Filter turns the source card into a practical message lens."],
  ["v2.6.7", "v2.6.7 apology draft", "apologydraft", "Apology", "VedaPath Apology Draft", "Apology draft", "Own one clear part", "Apology without performance.", "An apology draft room that helps users own a specific action, name the effect, and avoid demanding forgiveness.", "Repair", "apology-repair", 30, "Boundary Reply", "Build a careful apology surface.", "Apology Draft gives calm a repair voice while keeping serious human boundaries clear."],
  ["v2.6.8", "v2.6.8 boundary reply", "boundaryreply", "Boundary", "VedaPath Boundary Reply", "Boundary reply", "No with respect", "Clear no, less smoke.", "A boundary reply room for respectful refusal, fewer explanations, and visible limits around safety, legal, and mediation concerns.", "Respectful no", "boundary-no", 40, "Family Message", "Create the boundary reply standard.", "Boundary Reply protects personal agency without turning calm into coldness."],
  ["v2.6.9", "v2.6.9 family message", "familymessage", "Family", "VedaPath Family Message", "Family message", "Care without control", "Family care in one grounded message.", "A family message room that separates respect, practical help, and control so care stays honest.", "Family care", "family-message", 50, "Work Message", "Add a family-care reply room.", "Family Message brings the calm path into the hardest everyday relationships."],
  ["v2.7.0", "v2.7.0 work message", "workmessage", "Work", "VedaPath Work Message", "Work message", "Duty without defensiveness", "A clean work reply under pressure.", "A work message room that frames ownership, next step, and request without becoming career, HR, or legal advice.", "Work clarity", "work-message", 60, "Gratitude Note", "Add source-bounded work communication.", "Work Message keeps pressure from turning into vague or defensive speech."],
  ["v2.7.1", "v2.7.1 gratitude note", "gratitudenote", "Thanks", "VedaPath Gratitude Note", "Gratitude note", "Specific thanks", "Gratitude that names the gift.", "A gratitude note room that makes thanks specific, warm, and non-transactional.", "Gratitude", "gratitude-note", 70, "Repair Loop", "Add a gratitude communication room.", "Gratitude Note gives VedaPath a gentle outward-facing use case."],
  ["v2.7.2", "v2.7.2 repair loop", "repairloop", "Repair", "VedaPath Repair Loop", "Repair loop", "Return after conflict", "One repair action, not a whole trial.", "A repair loop room that helps users return to a conversation with one clean repair action and no outcome control.", "Follow-up repair", "repair-followup", 80, "Mobile Conversation", "Add follow-up repair after conflict.", "Repair Loop keeps relationship calm practical without pretending to mediate."],
  ["v2.7.3", "v2.7.3 mobile conversation", "mobileconversation", "Mobile", "VedaPath Mobile Conversation", "Mobile conversation", "Small screen, softer send", "Make calm replies usable on the phone.", "A mobile polish room with compact cards, full-width buttons, readable source ribbons, and simple copy handoff.", "Mobile replies", "reply-pause", 90, "Conversation Companion Control Room", "Protect the reply workflow on mobile.", "Mobile Conversation makes the product feel useful in the place messages actually happen."],
  ["v2.7.4", "v2.7.4 conversation companion", "conversationcompanionlab", "Conversation", "VedaPath Conversation Companion Control Room", "Conversation companion", "Speak from source", "Speak with source, care, and boundary.", "A control room that combines reply arrival, speech filter, apology, boundary, family, work, gratitude, repair, local memory, and copyable message packets.", "Everyday speech", "reply-pause", 100, "Founder instruction", "Use this as the first conversation standard for the trusted MVP.", "Conversation Companion Control Room completes the source-bounded speech layer for VedaPath AI."]
].map(([version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, defaultSituation, sprintPercent, next, primaryAsk, summary]) => ({
  version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, defaultSituation, sprintPercent, next, primaryAsk, summary,
  items: [
    ["Arrive", "Name the message situation before drafting.", "Reduces reactivity."],
    ["Source", "Show citation, family, confidence, and boundary.", "Protects trust."],
    ["Draft", "Offer one editable message, not a command.", "Keeps agency."],
    ["Review", "Save only local drafts until accounts and consent exist.", "Protects privacy."]
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
      ["Conversation promise", item.summary],
      ["Founder move", item.primaryAsk],
      ["Trust move", "Keep user agency visible: offer drafts, source candidates, and boundaries, not commands."]
    ],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No authority voice", "Do not frame the product as judge, counselor, mediator, priest, or final moral authority."],
      ["No safety claim", "Do not replace emergency support, legal advice, workplace HR, therapy, or family mediation."],
      ["No hidden memory", "Preview memory stays in this browser and can be cleared."]
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
    ["citedanswerlab.html", "Answers"],
    ["mantralenslab.html", "Mantra"],
    ["lifecompanionlab.html", "Life"],
    [active.slug + ".html", "Talk"],
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
      .nav {
        max-width: 840px;
      }

      .nav .link,
      .nav .version {
        white-space: nowrap;
      }

      @media (max-width: 780px) {
        .nav {
          gap: 6px;
        }

        .nav .link,
        .nav .version {
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
function conversationData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "conversation companion prototype",
    warning: "Prototype conversation support only. Not mediation, legal advice, safety planning, therapy, emergency support, ritual instruction, or spiritual authority.",
    tones,
    situations
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
    <link rel="stylesheet" href="assets/vedapath-conversation-companion.css">
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
          <span class="eyebrow">Conversation sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten rooms turn source-backed calm into careful speech.</p>
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

          <div class="source-block" aria-label="Release conversation card">
            <div><span class="source-meta">Release</span><span class="source-value">${item.version}</span></div>
            <div><span class="source-meta">Use case</span><span class="source-value">${item.source}</span></div>
            <div><span class="source-meta">Founder move</span><span class="source-value">${item.primaryAsk}</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">Draft support, not authority.</span></div>
          </div>

          <section class="conversation-companion" id="conversationCompanion" data-situation="${item.defaultSituation}" aria-label="Conversation Companion">
            <div class="conversation-head">
              <div>
                <span class="eyebrow">Source-bounded speech support</span>
                <h2>Conversation Companion</h2>
                <p class="muted">Reads <strong>data/vedapath-conversation-companion.json</strong>. Draft memory stays local to this browser.</p>
              </div>
              <div id="conversationStats" class="conversation-stats" aria-live="polite"></div>
            </div>

            <div class="conversation-tools">
              <label for="situationSelect">Situation</label>
              <select id="situationSelect"></select>
              <label for="toneSelect">Tone</label>
              <select id="toneSelect"></select>
            </div>

            <div class="conversation-layout">
              <div>
                <div id="conversationCard" class="conversation-card"></div>
                <label class="conversation-label" for="userLine">Your raw line</label>
                <textarea id="userLine" aria-label="Raw message line" placeholder="Type the message impulse here."></textarea>
                <div class="conversation-actions">
                  <button class="button primary" id="saveConversationDraft" type="button">Save Draft</button>
                  <button class="button safe" id="copyConversationPacket" type="button">Copy Packet</button>
                  <button class="button" id="clearConversationDrafts" type="button">Clear Local</button>
                </div>
              </div>
              <div>
                <div id="toneRail" class="tone-rail"></div>
                <label class="conversation-label" for="messageDraft">Editable message draft</label>
                <textarea id="messageDraft" aria-label="Conversation message draft"></textarea>
                <label class="conversation-label" for="conversationPacket">Conversation packet</label>
                <textarea id="conversationPacket" readonly aria-label="Conversation Companion packet"></textarea>
                <div id="conversationHistory" class="conversation-history" aria-label="Local conversation drafts"></div>
              </div>
            </div>
          </section>

          <h2>Conversation Signals</h2>
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
          <span class="badge green">Conversation Companion</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent"><div class="bar" style="--score:${item.sprintPercent}%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${item.version}</strong></div>
            <div class="metric"><span>Sprint</span><strong>${visible.length}/10</strong></div>
            <div class="metric"><span>Situations</span><strong>${situations.length}</strong></div>
            <div class="metric"><span>Next</span><strong>${item.next}</strong></div>
          </div>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Arrive</strong><p>Name the message.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Filter</strong><p>Truth and care.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Draft</strong><p>Offer editable words.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Review</strong><p>Keep boundaries visible.</p></div></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Conversation Boundary</h2>
            <p class="muted">This lab is not mediation, legal advice, safety planning, therapy, emergency support, ritual instruction, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>
    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-conversation-companion.js"></script>
  </body>
</html>
`;
}
function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Conversation Focus

- Use case: ${item.source}
- Founder action: ${item.primaryAsk}
- Boundary: draft support only, not authority

## Product Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Data Sources

- data/vedapath-conversation-companion.json
- data/vedapath-life-companion.json
- data/vedapath-answer-patterns.json
- data/vedapath-source-library.json

## No-Go Boundary

This release should not imply mediation, legal advice, safety planning, therapy, emergency support, ritual instruction, or spiritual authority.
`;
}
function writeConversationAssets() {
  write("data/vedapath-conversation-companion.json", `${safeJson(conversationData())}\n`);
  write("assets/vedapath-conversation-companion.css", `/* VedaPath Conversation Companion */
.conversation-companion{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:8px;background:rgba(255,253,248,.9)}
.conversation-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,280px);gap:14px;align-items:start}.conversation-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.conversation-stat,.conversation-card,.tone-card,.conversation-history-card{border:1px solid var(--line);border-radius:8px;background:var(--surface)}.conversation-stat{padding:10px}.conversation-stat span,.tone-card span,.conversation-history-card span,.conversation-tools label,.conversation-label{display:block;color:var(--muted);font-size:12px}.conversation-stat strong{display:block;font-size:22px;line-height:1.1}
.conversation-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}.conversation-tools select,#userLine,#messageDraft,#conversationPacket{width:100%;border:1px solid #efc1aa;border-radius:8px;background:#fffaf4;color:var(--ink);padding:12px;font-weight:750}
.conversation-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,1fr);gap:14px;align-items:start}.conversation-card{padding:18px;border-left:4px solid var(--bhagwa)}.conversation-card h2{font-size:30px;line-height:1.05}.conversation-ribbon{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.conversation-ribbon span{border:1px solid #efc1aa;border-radius:999px;padding:5px 9px;color:var(--ochre);font-size:12px;font-weight:900;background:#fff8f2}.confidence-track{height:9px;border-radius:999px;overflow:hidden;background:#f1dcd2;margin-top:10px}.confidence-fill{height:100%;width:var(--score);background:linear-gradient(90deg,var(--bhagwa),var(--gold))}
.tone-rail,.conversation-history{display:grid;gap:8px}.tone-card,.conversation-history-card{padding:11px}.tone-card.active{border-color:#f09f79;background:#fff0e7}.conversation-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.conversation-label{margin:12px 0 6px;font-weight:850}#userLine{min-height:78px;resize:vertical}#messageDraft{min-height:116px;resize:vertical}#conversationPacket{min-height:180px;resize:vertical}
@media(max-width:860px){.conversation-head,.conversation-stats,.conversation-tools,.conversation-layout{grid-template-columns:1fr}.conversation-actions .button{width:100%}.conversation-card h2{font-size:24px}}
`);
  write("assets/vedapath-conversation-companion.js", `const conversationRoot=document.getElementById("conversationCompanion");
if(conversationRoot)initConversationCompanion().catch((error)=>{conversationRoot.innerHTML='<p class="muted">Conversation Companion could not load local data.</p>';console.error(error);});
async function loadConversationJson(url){const response=await fetch(url);if(!response.ok)throw new Error("Unable to load "+url);return response.json();}
function conversationText(value){return value===0?"0":String(value||"");}
function conversationSafe(value){return conversationText(value).replace(/[&<>"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));}
function conversationStorageKey(){return "vedapath-conversation-companion-drafts";}
function readConversation(){try{return JSON.parse(localStorage.getItem(conversationStorageKey())||"[]");}catch(error){return[];}}
function writeConversation(rows){localStorage.setItem(conversationStorageKey(),JSON.stringify(rows.slice(0,30)));}
function draftFor(item,tone,raw){const prefix=raw?("Raw line: "+raw+"\\n\\n"):"";const toneLine=tone?("Tone: "+tone.label+" - "+tone.note+"\\n"):"";return prefix+toneLine+item.draft;}
function packetText(item,tone,rows,raw,draft){return ["VedaPath Conversation Companion Packet","Situation: "+item.state,"Relation: "+item.relation,"Tone: "+(tone?.label||item.tone),"Source: "+item.source,"Family: "+item.family,"Signal: "+item.signal,"Reflection: "+item.reflection,"Draft: "+draft,"Boundary: "+item.boundary,"Local drafts: "+rows.length,"Raw line: "+(raw||"None"),"","Boundary: draft support only; not mediation, legal advice, safety planning, therapy, emergency support, ritual instruction, or spiritual authority."].join("\\n");}
function renderStats(items,rows){const relations=[...new Set(items.map((item)=>item.relation))].length;conversationRoot.querySelector("#conversationStats").innerHTML=[["Situations",items.length],["Relations",relations],["Local",rows.length],["Drafts",items.length]].map((row)=>'<div class="conversation-stat"><span>'+conversationSafe(row[0])+'</span><strong>'+conversationSafe(row[1])+'</strong></div>').join("");}
function cardHtml(item){return '<div class="conversation-ribbon"><span>'+conversationSafe(item.relation)+'</span><span>'+conversationSafe(item.source)+'</span><span>'+conversationSafe(item.family)+'</span></div><h2>'+conversationSafe(item.state)+'</h2><p>'+conversationSafe(item.signal)+'</p><strong>Reflection</strong><p>'+conversationSafe(item.reflection)+'</p><strong>Boundary</strong><p>'+conversationSafe(item.boundary)+'</p><div class="confidence-track"><div class="confidence-fill" style="--score:'+conversationSafe(item.confidence)+'%"></div></div>';}
function renderTones(tones,activeTone){conversationRoot.querySelector("#toneRail").innerHTML=tones.map((tone)=>'<article class="tone-card '+(tone.id===activeTone.id?'active':'')+'"><span>'+conversationSafe(tone.label)+'</span><strong>'+conversationSafe(tone.note)+'</strong></article>').join("");}
function renderHistory(rows){const node=conversationRoot.querySelector("#conversationHistory");if(!rows.length){node.innerHTML='<article class="conversation-history-card"><strong>No local drafts yet</strong><p class="muted">Save one draft and the local rhythm will begin.</p></article>';return;}node.innerHTML=rows.slice(0,4).map((row)=>'<article class="conversation-history-card"><strong>'+conversationSafe(row.state)+'</strong><span>'+conversationSafe(row.source)+'</span><p class="muted">'+conversationSafe(row.draft)+' | '+conversationSafe(row.date)+'</p></article>').join("");}
async function initConversationCompanion(){const data=await loadConversationJson("data/vedapath-conversation-companion.json");const all=data.situations||[];const tones=(data.tones||[]).map((tone)=>({id:tone[0],label:tone[1],note:tone[2]}));const situationSelect=conversationRoot.querySelector("#situationSelect");const toneSelect=conversationRoot.querySelector("#toneSelect");const raw=conversationRoot.querySelector("#userLine");const draft=conversationRoot.querySelector("#messageDraft");const packet=conversationRoot.querySelector("#conversationPacket");const state={id:conversationRoot.dataset.situation||all[0]?.id||"",tone:tones[0]?.id||""};function selected(){return all.find((item)=>item.id===state.id)||all[0];}function selectedTone(){return tones.find((tone)=>tone.id===state.tone)||tones[0];}
function fillOptions(){situationSelect.innerHTML=all.map((item)=>'<option value="'+conversationSafe(item.id)+'">'+conversationSafe(item.relation+" | "+item.state)+'</option>').join("");toneSelect.innerHTML=tones.map((tone)=>'<option value="'+conversationSafe(tone.id)+'">'+conversationSafe(tone.label)+'</option>').join("");}
function render(){const rows=readConversation();fillOptions();const item=selected();const tone=selectedTone();if(!item||!tone)return;state.id=item.id;state.tone=tone.id;situationSelect.value=item.id;toneSelect.value=tone.id;renderStats(all,rows);conversationRoot.querySelector("#conversationCard").innerHTML=cardHtml(item);renderTones(tones,tone);if(!draft.dataset.touched)draft.value=draftFor(item,tone,raw.value.trim());packet.value=packetText(item,tone,rows,raw.value.trim(),draft.value.trim());renderHistory(rows);}
situationSelect.addEventListener("change",()=>{state.id=situationSelect.value;draft.dataset.touched="";render();});toneSelect.addEventListener("change",()=>{state.tone=toneSelect.value;draft.dataset.touched="";render();});raw.addEventListener("input",()=>{draft.dataset.touched="";render();});draft.addEventListener("input",()=>{draft.dataset.touched="true";const item=selected();const tone=selectedTone();packet.value=packetText(item,tone,readConversation(),raw.value.trim(),draft.value.trim());});
conversationRoot.querySelector("#saveConversationDraft").addEventListener("click",()=>{const item=selected();const rows=readConversation();rows.unshift({state:item.state,relation:item.relation,source:item.source,draft:draft.value.trim()||item.draft,date:new Date().toISOString().slice(0,10)});writeConversation(rows);render();});
conversationRoot.querySelector("#clearConversationDrafts").addEventListener("click",()=>{localStorage.removeItem(conversationStorageKey());render();});
conversationRoot.querySelector("#copyConversationPacket").addEventListener("click",()=>{packet.focus();packet.select();const button=conversationRoot.querySelector("#copyConversationPacket");const original=button.textContent;const done=()=>{button.textContent="Copied Packet";window.setTimeout(()=>{button.textContent=original;},1400);};const fallback=()=>{try{document.execCommand("copy");}catch(error){return;}done();};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(packet.value).then(done).catch(fallback);return;}fallback();});
render();}
`);
}
function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT LINKS START -->", "<!-- VEDAPATH CONVERSATION COMPANION SPRINT LINKS END -->", links, "<!-- VEDAPATH LIFE COMPANION SPRINT LINKS END -->");
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT FEATURES START -->", "<!-- VEDAPATH CONVERSATION COMPANION SPRINT FEATURES END -->", features, "<!-- VEDAPATH LIFE COMPANION SPRINT FEATURES END -->");
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}
function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT NOTES START -->", "<!-- VEDAPATH CONVERSATION COMPANION SPRINT NOTES END -->", notes, "<!-- VEDAPATH LIFE COMPANION SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", content);
}
function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT SUMMARY START -->", "<!-- VEDAPATH CONVERSATION COMPANION SPRINT SUMMARY END -->", summary, "<!-- VEDAPATH LIFE COMPANION SPRINT SUMMARY END -->");
  const sections = visible.map((item, index) => `### ${248 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: draft support only, not authority
- keep drafts local until explicit accounts and consent exist

${shortTitle(item)} should never claim mediation, legal advice, safety planning, therapy, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(content, "<!-- VEDAPATH CONVERSATION COMPANION SPRINT BLUEPRINT START -->", "<!-- VEDAPATH CONVERSATION COMPANION SPRINT BLUEPRINT END -->", sections, "<!-- VEDAPATH LIFE COMPANION SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", content);
}
function updateBuildStatus() {
  let content = read("build-status.html");
  const meta = `Updated June 26, 2026 | Branch main | <strong>${active.badge}</strong> | <a href="index.html">Home</a> | <a href="blueprint.html">Blueprint</a> | <a href="sourcelibrary.html">Sources</a> | <a href="retrievallab.html">Retrieval</a> | <a href="citedanswerlab.html">Answers</a> | <a href="mantralenslab.html">Mantra</a> | <a href="lifecompanionlab.html">Life</a> | <a href="${active.slug}.html">Talk</a>`;
  content = content.replace(/<div class="meta">[\s\S]*?<\/div>\s*<\/header>/, `<div class="meta">${meta}</div>\n      </header>`);
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${active.version}</strong>\n          <p>Conversation Companion sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Conversation Companion sprint progress: ${visible.length}/10 rooms complete. The MVP now has a source-bounded speech standard.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Conversation path: reply pause, truth filter, apology, boundaries, family, work, gratitude, repair, and mobile polish.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>${future[0]?.version || "Founder instruction"}</strong>\n          <p>${future[0] ? shortTitle(future[0]) : "Conversation Companion sprint complete. Next release waits for founder instruction."}</p>`);
  const phaseBody = visible.concat(future).map((item, index) => `            <article class="phase">\n              <span class="badge ${index <= upto ? "done" : "later"}">${index <= upto ? "Done" : "Later"}</span>\n              <div>\n                <strong>Phase ${229 + index}: ${shortTitle(item)}</strong>\n                <p>${item.summary}</p>\n              </div>\n              <div class="percent">${index <= upto ? "100%" : "0%"}</div>\n            </article>`).join("\n");
  content = upsertBlock(content, "            <!-- VEDAPATH CONVERSATION COMPANION SPRINT PHASES START -->", "            <!-- VEDAPATH CONVERSATION COMPANION SPRINT PHASES END -->", phaseBody, "            <!-- VEDAPATH LIFE COMPANION SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${229 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.6.4 Life Companion Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Conversation Companion sprint complete" : `${visible.length}/10 Conversation rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>\n              <li><span class="dot"></span><span>Keep the path simple: arrive, source, draft, review.</span></li>\n              <li><span class="dot"></span><span>Do not claim mediation, legal advice, safety planning, therapy, emergency support, ritual instruction, or spiritual authority.</span></li>\n              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before production accounts, message history, or human review flows."}</span></li>\n            </ul>`);
  write("build-status.html", content);
}
function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">\n            <h2>${item.nav}</h2>\n            <p class="muted">${item.summary}</p>\n            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>\n          </section>`).join("\n\n");
  content = upsertBlock(content, "          <!-- VEDAPATH CONVERSATION COMPANION SPRINT HOME START -->", "          <!-- VEDAPATH CONVERSATION COMPANION SPRINT HOME END -->", cards, "          <!-- VEDAPATH LIFE COMPANION SPRINT HOME END -->");
  write("index.html", content);
}
function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">\n            <h3>${shortTitle(item)}</h3>\n            <p>${item.summary}</p>\n          </div>`).join("\n");
  content = upsertBlock(content, "          <!-- VEDAPATH CONVERSATION COMPANION SPRINT FEATURES START -->", "          <!-- VEDAPATH CONVERSATION COMPANION SPRINT FEATURES END -->", cards, "          <!-- VEDAPATH LIFE COMPANION SPRINT FEATURES END -->");
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeConversationAssets();
for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) normalizeNav(rel);
if (existsSync(file("brand/brand-board.html"))) normalizeNav("brand/brand-board.html");
updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();
console.log(`Generated conversation-companion sprint through ${active.version} (${visible.length}/10).`);

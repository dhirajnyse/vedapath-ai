import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const answerPatterns = [
  {
    id: "steady-action-answer",
    question: "How can I act calmly when results are uncertain?",
    source_id: "bg-2-48-steadiness",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    confidence: "High",
    confidence_score: 86,
    direct_answer: "Begin with the next honest action, not the result you cannot control.",
    plain_meaning: "The source candidate supports steadiness in action and caution about clinging to outcomes.",
    deeper_layer: "In a fuller tradition-specific reading, this belongs near karma-yoga and disciplined action.",
    boundary: "Reflection support only; not therapy, medical advice, ritual instruction, or a promise of peace.",
    carry_action: "Choose one small duty. Do it slowly, clearly, and without checking for praise.",
    no_go: "Do not imply guaranteed calm, diagnosis, treatment, or spiritual authority.",
    view_notes: ["Beginner answer", "Source card", "Boundary", "Carry action"],
    feedback_prompt: "Did this answer stay useful without becoming a command?"
  },
  {
    id: "discernment-answer",
    question: "How do I tell short term comfort from a deeper good?",
    source_id: "katha-1-2-1-discernment",
    citation: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    confidence: "Medium",
    confidence_score: 70,
    direct_answer: "Pause long enough to ask whether the choice only soothes the moment or also serves clarity.",
    plain_meaning: "The source candidate can support a careful distinction between the pleasant and the beneficial.",
    deeper_layer: "It needs context around shreyas and preyas before the product uses it broadly.",
    boundary: "Do not use this for moral policing, shame, emergency decisions, or judging another person's life.",
    carry_action: "Write the choice in one line, then name what it protects and what it avoids.",
    no_go: "Do not turn discernment into superiority or social control.",
    view_notes: ["Beginner answer", "Upanishad context", "No moral policing", "One question"],
    feedback_prompt: "Did this preserve discernment without judgment?"
  },
  {
    id: "knowledge-answer",
    question: "What does Hindu philosophy mean by different kinds of knowledge?",
    source_id: "mundaka-1-1-4-knowledge",
    citation: "Mundaka Upanishad 1.1.4",
    family: "Upanishad | Shruti",
    confidence: "Medium",
    confidence_score: 64,
    direct_answer: "The source candidate points to layers of knowing, but VedaPath should explain them without dismissing practical learning.",
    plain_meaning: "It can introduce a distinction between forms of knowledge, while keeping category labels careful.",
    deeper_layer: "Sanskrit terms and commentary differences need review before a confident public answer.",
    boundary: "Not anti-science, not anti-scholarship, and not a ranking of people.",
    carry_action: "Ask what kind of knowing the current question needs: facts, practice, meaning, or realization.",
    no_go: "Do not frame modern knowledge as inferior or useless.",
    view_notes: ["Concept answer", "Category caution", "Scholarly layer", "No anti-science claim"],
    feedback_prompt: "Did this explain layers without flattening them?"
  },
  {
    id: "restraint-answer",
    question: "How can I practice restraint without escaping responsibility?",
    source_id: "isha-1-restraint",
    citation: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    confidence: "Low",
    confidence_score: 52,
    direct_answer: "Use this only as a reflection candidate until rights and interpretation review are complete.",
    plain_meaning: "The source can point toward restraint, but the product must not pressure withdrawal from responsibility.",
    deeper_layer: "This record needs rights review and school-specific interpretation boundaries.",
    boundary: "Not renunciation advice, legal advice, financial advice, or a command to abandon duties.",
    carry_action: "Name one attachment you can soften without neglecting safety, work, or people.",
    no_go: "Do not tell users to give up shelter, property, family responsibilities, or safety.",
    view_notes: ["Hold state", "Rights caution", "Responsibility boundary", "Gentle reflection"],
    feedback_prompt: "Did this keep restraint connected to responsibility?"
  }
];

const releases = [
  ["v2.3.5", "v2.3.5 answer intent", "answerintentlab", "Intent", "VedaPath Answer Intent Lab", "Answer intent", "Intent lab", "Start every answer with intent.", "A cited answer lab room that separates the user's question, intent, source candidate, and answer boundary before any prose is shown.", "How can I act calmly when results are uncertain?", "Bhagavad Gita 2.48", "Answer intent prototype, not AI generation.", 10, "steady-action-answer", "Source Context Card", "Separate question intent from answer prose.", "Answer Intent Lab starts the answer layer by making intent and boundaries explicit."],
  ["v2.3.6", "v2.3.6 source context", "sourcecontextcard", "Context", "VedaPath Source Context Card", "Source context", "Source context", "Put the source beside the answer.", "A source context card that keeps citation, family, confidence, plain meaning, deeper layer, and no-go line visible beside a draft answer.", "How can I act calmly when results are uncertain?", "Bhagavad Gita 2.48", "Source context preview, not commentary authority.", 20, "steady-action-answer", "Citation Ribbon Lab", "Make source context impossible to miss.", "Source Context Card keeps VedaPath's answer surface source-first."],
  ["v2.3.7", "v2.3.7 citation ribbon", "citationribbonlab", "Ribbon", "VedaPath Citation Ribbon Lab", "Citation ribbon", "Citation ribbon", "Let citation travel with the answer.", "A citation ribbon that pins source family, confidence, and boundary above every answer card so users see what kind of source is speaking.", "What does Hindu philosophy mean by different kinds of knowledge?", "Mundaka Upanishad 1.1.4", "Citation ribbon preview, not final answer shell.", 30, "knowledge-answer", "Answer Card Lab", "Make citation a visible answer component.", "Citation Ribbon Lab prevents answer prose from floating away from source identity."],
  ["v2.3.8", "v2.3.8 answer card", "answercardlab", "Card", "VedaPath Answer Card Lab", "Answer card", "Answer card", "Make answers calm, cited, and bounded.", "An answer card lab that assembles direct answer, plain meaning, deeper layer, boundary, and carry action into one readable card.", "How do I tell short term comfort from a deeper good?", "Katha Upanishad 1.2.1", "Answer card preview, not public AI response.", 40, "discernment-answer", "Confidence Briefing", "Build the first complete answer card pattern.", "Answer Card Lab turns retrieval output into a humane answer format."],
  ["v2.3.9", "v2.3.9 confidence brief", "confidencebriefing", "Confidence", "VedaPath Confidence Briefing", "Confidence brief", "Confidence brief", "Show certainty without pretending authority.", "A confidence briefing that labels high, medium, and low answer readiness with visible reasons and a source-safe next step.", "How can I practice restraint without escaping responsibility?", "Isha Upanishad 1", "Confidence preview, not quality certification.", 50, "restraint-answer", "Boundary Rewriter", "Make confidence understandable to non-experts.", "Confidence Briefing makes uncertainty a product feature, not a footnote."],
  ["v2.4.0", "v2.4.0 boundary rewrite", "boundaryrewriter", "Rewrite", "VedaPath Boundary Rewriter", "Boundary rewrite", "Boundary rewrite", "Rewrite overclaims before they ship.", "A boundary rewriting room that transforms risky answer claims into careful answer language with source category, no-go line, and safer phrasing.", "How can I practice restraint without escaping responsibility?", "Isha Upanishad 1", "Boundary rewrite preview, not safety certification.", 60, "restraint-answer", "View Comparison Lab", "Turn risky answer language into bounded language.", "Boundary Rewriter keeps the product calm when a source is sensitive."],
  ["v2.4.1", "v2.4.1 comparison views", "viewcomparisonlab", "Views", "VedaPath Answer View Comparison Lab", "Answer views", "Comparison views", "Compare beginner, source, and boundary views.", "A comparison room that lets the same answer be inspected as beginner summary, source context, deeper layer, or boundary warning.", "What does Hindu philosophy mean by different kinds of knowledge?", "Mundaka Upanishad 1.1.4", "Comparison preview, not school-complete commentary.", 70, "knowledge-answer", "Feedback Capture Lab", "Let users inspect answer layers without clutter.", "Answer View Comparison Lab adds progressive depth without sacrificing simplicity."],
  ["v2.4.2", "v2.4.2 feedback capture", "feedbackcapturelab", "Feedback", "VedaPath Feedback Capture Lab", "Feedback capture", "Feedback capture", "Turn answer concerns into review tickets.", "A feedback capture room that converts answer concerns into local review tickets with source id, confidence, boundary, and user prompt.", "How do I tell short term comfort from a deeper good?", "Katha Upanishad 1.2.1", "Feedback preview, not durable support queue.", 80, "discernment-answer", "Mobile Answer Polish", "Make answer feedback reviewable instead of invisible.", "Feedback Capture Lab closes the answer loop without silently rewriting knowledge."],
  ["v2.4.3", "v2.4.3 answer mobile", "answermobilelab", "Mobile", "VedaPath Mobile Answer Polish", "Answer mobile", "Mobile polish", "Keep cited answers readable on a phone.", "A mobile polish room for stable answer cards, full-width controls, compact citation ribbon, and readable boundaries on small screens.", "How can I act calmly when results are uncertain?", "Bhagavad Gita 2.48", "Mobile answer preview, not final app layout.", 90, "steady-action-answer", "Cited Answer Control Room", "Protect cited answer UX on small screens.", "Mobile Answer Polish keeps the calm answer format usable in real life."],
  ["v2.4.4", "v2.4.4 cited answer", "citedanswerlab", "Answer", "VedaPath Cited Answer Control Room", "Cited answer", "Cited answer control", "Answer with source, confidence, and restraint.", "A cited answer control room that turns retrieval candidates into source-carded answer drafts with confidence, boundaries, feedback capture, and copyable answer packets.", "How can I act calmly when results are uncertain?", "Bhagavad Gita 2.48", "Cited answer lab prototype, not production AI authority.", 100, "steady-action-answer", "Founder instruction", "Use this as the first answer-card standard for the trusted MVP.", "Cited Answer Control Room completes the retrieval-to-answer bridge with a source-first answer pattern."]
].map(([version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, family, stance, sprintPercent, defaultPattern, next, primaryAsk, summary]) => ({
  version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, family, stance, sprintPercent, defaultPattern, next, primaryAsk, summary,
  items: [
    ["Intent", "Keep the user question and answer intent visible.", "Prevents generic advice."],
    ["Source", "Keep citation, family, and confidence near the answer.", "Protects trust."],
    ["Boundary", "Show what the answer must not become.", "Prevents overclaim."],
    ["Feedback", "Turn concerns into reviewable local tickets.", "Keeps learning alive."]
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
    brief: [["Answer promise", item.summary], ["Founder move", item.primaryAsk], ["Trust move", `Keep this boundary visible: ${item.stance}`]],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No authority claim", "Do not imply answer cards are guru voice, therapy, diagnosis, ritual instruction, or emergency support."],
      ["No hidden source", "Do not show answer prose without source family, confidence, and boundary nearby."],
      ["No silent rewrite", "Feedback creates review tickets; it does not silently change accepted knowledge."]
    ]
  };
}
function answerNav(prefix = "", rel = "") {
  const isAnswerPage = visible.some((item) => rel === `${item.slug}.html`);
  return `          <a class="link${isAnswerPage ? " active" : ""}" href="${prefix}${active.slug}.html">Answers</a>`;
}
function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH CITED ANSWER SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH CITED ANSWER SPRINT NAV END -->";
  const nav = answerNav(prefix, rel);
  if (content.includes(start)) content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  else if (content.includes("          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV END -->")) content = content.replace("          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV END -->", `          <!-- VEDAPATH RETRIEVAL LAB SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  else if (content.includes("<span class=\"version\">")) content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}
function answerData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "cited answer lab prototype",
    warning: "Prototype cited answer patterns only. Not production AI, therapy, ritual instruction, emergency support, or spiritual authority.",
    patterns: answerPatterns
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
    <link rel="stylesheet" href="assets/vedapath-cited-answer-lab.css">
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
          <a class="link" href="retrievallab.html">Retrieval</a>
          <!-- VEDAPATH CITED ANSWER SPRINT NAV START -->
${answerNav("", `${item.slug}.html`)}
          <!-- VEDAPATH CITED ANSWER SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Cited answer sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten rooms turn retrieval traces into calm, cited, bounded answer cards.</p>
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

          <div class="source-block" aria-label="Release answer card">
            <div><span class="source-meta">Release</span><span class="source-value">${item.version}</span></div>
            <div><span class="source-meta">Sample question</span><span class="source-value">${item.source}</span></div>
            <div><span class="source-meta">Source lane</span><span class="source-value">${item.family}</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">${item.stance}</span></div>
          </div>

          <section class="answer-lab" id="citedAnswerLab" data-pattern="${item.defaultPattern}" aria-label="Cited answer lab">
            <div class="answer-head">
              <div>
                <span class="eyebrow">Source-carded answer draft</span>
                <h2>Cited Answer Lab</h2>
                <p class="muted">Reads <strong>data/vedapath-answer-patterns.json</strong>. Answer cards are prototype patterns, not final AI output.</p>
              </div>
              <div id="answerStats" class="answer-stats" aria-live="polite"></div>
            </div>

            <div class="answer-tools">
              <label for="patternSelect">Answer pattern</label>
              <select id="patternSelect"></select>
              <label for="viewSelect">View</label>
              <select id="viewSelect">
                <option value="full">Full card</option>
                <option value="beginner">Beginner</option>
                <option value="source">Source</option>
                <option value="boundary">Boundary</option>
              </select>
            </div>

            <div class="answer-layout">
              <div>
                <div id="answerCard" class="answer-card"></div>
                <div class="answer-actions">
                  <button class="button primary" id="saveFeedback" type="button">Save Feedback</button>
                  <button class="button safe" id="copyAnswerPacket" type="button">Copy Packet</button>
                  <button class="button" id="clearAnswerFeedback" type="button">Clear Feedback</button>
                </div>
              </div>
              <div>
                <div id="sourceContext" class="source-context"></div>
                <label class="answer-label" for="feedbackText">Feedback note</label>
                <textarea id="feedbackText" aria-label="Answer feedback note"></textarea>
                <label class="answer-label" for="answerPacket">Answer packet</label>
                <textarea id="answerPacket" readonly aria-label="Answer packet output"></textarea>
                <div id="feedbackList" class="feedback-list" aria-label="Local feedback preview"></div>
              </div>
            </div>
          </section>

          <h2>Answer Signals</h2>
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
          <span class="badge green">Cited answer</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent"><div class="bar" style="--score:${item.sprintPercent}%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${item.version}</strong></div>
            <div class="metric"><span>Sprint</span><strong>${visible.length}/10</strong></div>
            <div class="metric"><span>Patterns</span><strong>${answerPatterns.length}</strong></div>
            <div class="metric"><span>Next</span><strong>${item.next}</strong></div>
          </div>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Intent</strong><p>Read the question.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Source</strong><p>Show citation.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Answer</strong><p>Draft with restraint.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Feedback</strong><p>Capture concerns.</p></div></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Answer Boundary</h2>
            <p class="muted">This lab is not production AI, guru voice, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>
    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-cited-answer-lab.js"></script>
  </body>
</html>
`;
}
function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Answer Focus

- Sample question: ${item.source}
- Source lane: ${item.family}
- Boundary: ${item.stance}

## Answer Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## Data Sources

- data/vedapath-answer-patterns.json
- data/vedapath-retrieval-fixtures.json
- data/vedapath-source-library.json

## No-Go Boundary

This release should not imply production AI, guru voice, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.
`;
}
function writeAnswerAssets() {
  write("data/vedapath-answer-patterns.json", `${safeJson(answerData())}\n`);
  write("assets/vedapath-cited-answer-lab.css", `/* VedaPath cited answer lab */
.answer-lab{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:8px;background:rgba(255,253,248,.88)}
.answer-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(190px,280px);gap:14px;align-items:start}.answer-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.answer-stat,.answer-card,.source-context,.feedback-card{border:1px solid var(--line);border-radius:8px;background:var(--surface)}.answer-stat{padding:10px}.answer-stat span,.source-context span,.feedback-card span,.answer-tools label{display:block;color:var(--muted);font-size:12px}.answer-stat strong{display:block;font-size:22px;line-height:1.1}
.answer-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}.answer-tools select,#feedbackText,#answerPacket{width:100%;border:1px solid #efc1aa;border-radius:8px;background:#fffaf4;color:var(--ink);padding:12px;font-weight:750}
.answer-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(260px,.95fr);gap:14px;align-items:start}.answer-card{padding:16px;border-left:4px solid var(--bhagwa)}.citation-ribbon{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.citation-ribbon span{border:1px solid #efc1aa;border-radius:999px;padding:5px 9px;color:var(--ochre);font-size:12px;font-weight:900;background:#fff8f2}.answer-direct{font-size:24px;line-height:1.16;margin:8px 0 12px;font-weight:900}.answer-section{border-top:1px solid var(--line);padding-top:10px;margin-top:10px}.answer-section strong{display:block;margin-bottom:4px}.confidence-track{height:9px;border-radius:999px;overflow:hidden;background:#f1dcd2;margin-top:8px}.confidence-fill{height:100%;width:var(--score);background:linear-gradient(90deg,var(--bhagwa),var(--gold))}
.source-context{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px;border-left:4px solid var(--green)}.source-context .wide{grid-column:1/-1}.answer-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.answer-label{display:block;margin:14px 0 6px;color:var(--muted);font-size:13px;font-weight:850}#feedbackText{min-height:92px;resize:vertical}#answerPacket{min-height:190px;resize:vertical}.feedback-list{display:grid;gap:8px;margin-top:12px}.feedback-card{padding:12px}
@media(max-width:860px){.answer-head,.answer-stats,.answer-tools,.answer-layout,.source-context{grid-template-columns:1fr}.answer-actions .button{width:100%}.answer-direct{font-size:21px}}
`);
  write("assets/vedapath-cited-answer-lab.js", `const citedAnswerRoot=document.getElementById("citedAnswerLab");
if(citedAnswerRoot)initCitedAnswerLab().catch((error)=>{citedAnswerRoot.innerHTML='<p class="muted">Cited answer lab could not load answer patterns.</p>';console.error(error);});
async function loadAnswerJson(url){const response=await fetch(url);if(!response.ok)throw new Error("Unable to load "+url);return response.json();}
function answerText(value){return value===0?"0":String(value||"");}
function answerSafe(value){return answerText(value).replace(/[&<>"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));}
function answerStorageKey(){return "vedapath-cited-answer-feedback";}
function readAnswerFeedback(){try{return JSON.parse(localStorage.getItem(answerStorageKey())||"[]");}catch(error){return[];}}
function writeAnswerFeedback(rows){localStorage.setItem(answerStorageKey(),JSON.stringify(rows.slice(0,20)));}
function answerPacketText(pattern,view,feedback){return ["VedaPath Cited Answer Packet","Question: "+pattern.question,"Source: "+pattern.citation,"Family: "+pattern.family,"Confidence: "+pattern.confidence+" | "+pattern.confidence_score+"/100","View: "+view,"Direct answer: "+pattern.direct_answer,"Plain meaning: "+pattern.plain_meaning,"Deeper layer: "+pattern.deeper_layer,"Boundary: "+pattern.boundary,"Carry action: "+pattern.carry_action,"No-go: "+pattern.no_go,"Feedback tickets: "+feedback.length,"","Boundary: cited answer prototype; not production AI, guru voice, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority."].join("\\n");}
function renderAnswerStats(patterns,feedback){const high=patterns.filter((pattern)=>pattern.confidence==="High").length;citedAnswerRoot.querySelector("#answerStats").innerHTML=[["Patterns",patterns.length],["High",high],["Feedback",feedback.length],["Views",4]].map((row)=>'<div class="answer-stat"><span>'+answerSafe(row[0])+'</span><strong>'+answerSafe(row[1])+'</strong></div>').join("");}
function cardHtml(pattern,view){const sections={beginner:[["Plain meaning",pattern.plain_meaning],["Carry action",pattern.carry_action]],source:[["Source context",pattern.deeper_layer],["Citation use",pattern.family]],boundary:[["Boundary",pattern.boundary],["No-go",pattern.no_go]],full:[["Plain meaning",pattern.plain_meaning],["Deeper layer",pattern.deeper_layer],["Boundary",pattern.boundary],["Carry action",pattern.carry_action]]}[view]||[];return '<div class="citation-ribbon"><span>'+answerSafe(pattern.citation)+'</span><span>'+answerSafe(pattern.family)+'</span><span>'+answerSafe(pattern.confidence)+'</span></div><div class="answer-direct">'+answerSafe(pattern.direct_answer)+'</div><div class="confidence-track"><div class="confidence-fill" style="--score:'+answerSafe(pattern.confidence_score)+'%"></div></div>'+sections.map((row)=>'<div class="answer-section"><strong>'+answerSafe(row[0])+'</strong><p>'+answerSafe(row[1])+'</p></div>').join("");}
function renderSourceContext(pattern){citedAnswerRoot.querySelector("#sourceContext").innerHTML=[["Source",pattern.citation],["Family",pattern.family],["Confidence",pattern.confidence+" | "+pattern.confidence_score+"/100"],["Source id",pattern.source_id],["Question",pattern.question,"wide"],["No-go",pattern.no_go,"wide"],["Feedback prompt",pattern.feedback_prompt,"wide"]].map((row)=>'<div class="'+(row[2]||"")+'"><span>'+answerSafe(row[0])+'</span><strong>'+answerSafe(row[1])+'</strong></div>').join("");}
function renderFeedback(rows){const node=citedAnswerRoot.querySelector("#feedbackList");if(!rows.length){node.innerHTML='<article class="feedback-card"><strong>No local feedback yet</strong><p class="muted">Save a note and the local review-ticket preview will begin.</p></article>';return;}node.innerHTML=rows.slice(0,4).map((row)=>'<article class="feedback-card"><strong>'+answerSafe(row.question)+'</strong><span>'+answerSafe(row.source)+'</span><p class="muted">'+answerSafe(row.note)+' | '+answerSafe(row.date)+'</p></article>').join("");}
async function initCitedAnswerLab(){const data=await loadAnswerJson("data/vedapath-answer-patterns.json");const patterns=data.patterns||[];const patternSelect=citedAnswerRoot.querySelector("#patternSelect");const viewSelect=citedAnswerRoot.querySelector("#viewSelect");const feedbackText=citedAnswerRoot.querySelector("#feedbackText");const packet=citedAnswerRoot.querySelector("#answerPacket");const state={patternId:citedAnswerRoot.dataset.pattern||patterns[0]?.id||"",view:"full"};patternSelect.innerHTML=patterns.map((pattern)=>'<option value="'+answerSafe(pattern.id)+'">'+answerSafe(pattern.question)+'</option>').join("");
function selected(){return patterns.find((pattern)=>pattern.id===state.patternId)||patterns[0];}
function render(){const pattern=selected();const feedback=readAnswerFeedback();if(!pattern)return;patternSelect.value=pattern.id;viewSelect.value=state.view;renderAnswerStats(patterns,feedback);citedAnswerRoot.querySelector("#answerCard").innerHTML=cardHtml(pattern,state.view);renderSourceContext(pattern);packet.value=answerPacketText(pattern,state.view,feedback);renderFeedback(feedback);}
patternSelect.addEventListener("change",()=>{state.patternId=patternSelect.value;render();});viewSelect.addEventListener("change",()=>{state.view=viewSelect.value;render();});citedAnswerRoot.querySelector("#saveFeedback").addEventListener("click",()=>{const pattern=selected();const note=feedbackText.value.trim()||pattern.feedback_prompt;const rows=readAnswerFeedback();rows.unshift({question:pattern.question,source:pattern.citation,note,date:new Date().toISOString().slice(0,10)});writeAnswerFeedback(rows);feedbackText.value="";render();});citedAnswerRoot.querySelector("#clearAnswerFeedback").addEventListener("click",()=>{localStorage.removeItem(answerStorageKey());render();});citedAnswerRoot.querySelector("#copyAnswerPacket").addEventListener("click",()=>{packet.focus();packet.select();const button=citedAnswerRoot.querySelector("#copyAnswerPacket");const original=button.textContent;const done=()=>{button.textContent="Copied Packet";window.setTimeout(()=>{button.textContent=original;},1400);};const fallback=()=>{try{document.execCommand("copy");}catch(error){return;}done();};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(packet.value).then(done).catch(fallback);return;}fallback();});render();}
`);
}
function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CITED ANSWER SPRINT LINKS START -->", "<!-- VEDAPATH CITED ANSWER SPRINT LINKS END -->", links, "<!-- VEDAPATH RETRIEVAL LAB SPRINT LINKS END -->");
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CITED ANSWER SPRINT FEATURES START -->", "<!-- VEDAPATH CITED ANSWER SPRINT FEATURES END -->", features, "<!-- VEDAPATH RETRIEVAL LAB SPRINT FEATURES END -->");
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}
function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CITED ANSWER SPRINT NOTES START -->", "<!-- VEDAPATH CITED ANSWER SPRINT NOTES END -->", notes, "<!-- VEDAPATH RETRIEVAL LAB SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", content);
}
function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH CITED ANSWER SPRINT SUMMARY START -->", "<!-- VEDAPATH CITED ANSWER SPRINT SUMMARY END -->", summary, "<!-- VEDAPATH RETRIEVAL LAB SPRINT SUMMARY END -->");
  const sections = visible.map((item, index) => `### ${218 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep answer cards source-first, confidence-labeled, and feedback-reviewable

${shortTitle(item)} should never claim production AI authority, guru voice, legal clearance, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.`).join("\n\n");
  content = upsertBlock(content, "<!-- VEDAPATH CITED ANSWER SPRINT BLUEPRINT START -->", "<!-- VEDAPATH CITED ANSWER SPRINT BLUEPRINT END -->", sections, "<!-- VEDAPATH RETRIEVAL LAB SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", content);
}
function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes(`href="${active.slug}.html">Answers</a>`)) content = content.replace(/href="[^"]+\.html">Retrieval<\/a>/, `href="retrievallab.html">Retrieval</a> | <a href="${active.slug}.html">Answers</a>`);
  else content = content.replace(/href="[^"]+\.html">Answers<\/a>/, `href="${active.slug}.html">Answers</a>`);
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${active.version}</strong>\n          <p>Cited answer sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Cited answer sprint progress: ${visible.length}/10 rooms complete. The MVP now has a source-carded answer standard.</p>`);
  const vision = Math.min(100, 95 + Math.floor(visible.length / 2));
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>${vision}%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:${vision}%"></div></div>\n          <p>Answer path: intent, source context, citation ribbon, answer card, confidence, boundary rewrite, comparison views, feedback, and mobile polish.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>${future[0]?.version || "Founder instruction"}</strong>\n          <p>${future[0] ? shortTitle(future[0]) : "Cited answer sprint complete. Next release waits for founder instruction."}</p>`);
  const phaseBody = visible.concat(future).map((item, index) => `            <article class="phase">\n              <span class="badge ${index <= upto ? "done" : "later"}">${index <= upto ? "Done" : "Later"}</span>\n              <div>\n                <strong>Phase ${199 + index}: ${shortTitle(item)}</strong>\n                <p>${item.summary}</p>\n              </div>\n              <div class="percent">${index <= upto ? "100%" : "0%"}</div>\n            </article>`).join("\n");
  content = upsertBlock(content, "            <!-- VEDAPATH CITED ANSWER SPRINT PHASES START -->", "            <!-- VEDAPATH CITED ANSWER SPRINT PHASES END -->", phaseBody, "            <!-- VEDAPATH RETRIEVAL LAB SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${199 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.3.4 Retrieval Lab Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Cited answer sprint complete" : `${visible.length}/10 cited answer rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>\n              <li><span class="dot"></span><span>Keep the path simple: intent, source context, citation ribbon, answer card, confidence, boundary rewrite, comparison views, feedback.</span></li>\n              <li><span class="dot"></span><span>Do not claim production AI authority, guru voice, therapy, ritual instruction, or spiritual authority.</span></li>\n              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing production backend, accounts, or scholar review operations."}</span></li>\n            </ul>`);
  write("build-status.html", content);
}
function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">\n            <h2>${item.nav}</h2>\n            <p class="muted">${item.summary}</p>\n            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>\n          </section>`).join("\n\n");
  content = upsertBlock(content, "          <!-- VEDAPATH CITED ANSWER SPRINT HOME START -->", "          <!-- VEDAPATH CITED ANSWER SPRINT HOME END -->", cards, "          <!-- VEDAPATH RETRIEVAL LAB SPRINT HOME END -->");
  write("index.html", content);
}
function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">\n            <h3>${shortTitle(item)}</h3>\n            <p>${item.summary}</p>\n          </div>`).join("\n");
  content = upsertBlock(content, "          <!-- VEDAPATH CITED ANSWER SPRINT FEATURES START -->", "          <!-- VEDAPATH CITED ANSWER SPRINT FEATURES END -->", cards, "          <!-- VEDAPATH RETRIEVAL LAB SPRINT FEATURES END -->");
  write("blueprint.html", content);
}
for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeAnswerAssets();
for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) addSprintNavToHtml(rel);
if (existsSync(file("brand/brand-board.html"))) addSprintNavToHtml("brand/brand-board.html", "../");
updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();
console.log(`Generated cited-answer sprint through ${active.version} (${visible.length}/10).`);

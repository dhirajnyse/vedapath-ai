import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const verses = [
  {
    id: "bg-2-48-mantra-lens",
    source: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    title: "Steady action",
    transliteration: "yogasthah kuru karmani sangam tyaktva dhananjaya",
    plain: "Stand in steadiness, act, and loosen the grip on result-attachment.",
    caution: "Use as a source candidate for reflection, not a command, diagnosis, or promise of peace.",
    words: [
      ["yogasthah", "standing in yoga or steadiness"],
      ["kuru", "do or act"],
      ["karmani", "actions or duties"],
      ["sangam", "attachment or clinging"],
      ["tyaktva", "having released"],
      ["dhananjaya", "address to Arjuna"]
    ],
    chant: "Read slowly. Do not imitate ritual recitation or claim pronunciation authority.",
    interpretations: ["Karma-yoga lane", "Calm action lens", "Do not turn this into productivity pressure."],
    carry: "Do one small duty slowly and clearly before checking the outcome.",
    confidence: 84
  },
  {
    id: "gayatri-3-62-10-lens",
    source: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    title: "Illumined attention",
    transliteration: "tat savitur varenyam bhargo devasya dhimahi",
    plain: "A revered Vedic mantra often approached as a meditation on illumination and discernment.",
    caution: "Sacred mantra handling needs lineage humility, rights awareness for translations, and pronunciation care.",
    words: [
      ["tat", "that"],
      ["savitur", "of Savitr"],
      ["varenyam", "worthy of choosing or revering"],
      ["bhargo", "radiance or splendor"],
      ["devasya", "of the divine"],
      ["dhimahi", "we meditate upon"]
    ],
    chant: "Show source and transliteration only. Avoid audio authority until licensed guidance exists.",
    interpretations: ["Vedic hymn lane", "Meditative attention lens", "Do not flatten into generic positivity."],
    carry: "Pause once today and ask what deserves clear attention.",
    confidence: 72
  },
  {
    id: "katha-1-2-1-lens",
    source: "Katha Upanishad 1.2.1",
    family: "Upanishad | Shruti",
    title: "Pleasant and beneficial",
    transliteration: "anyac chreyo anyad utaiva preyah",
    plain: "A source candidate for distinguishing what is merely pleasant from what is deeply beneficial.",
    caution: "Do not use this to shame choices, judge another life, or create moral superiority.",
    words: [
      ["anyat", "one thing or different"],
      ["shreyah", "the beneficial or higher good"],
      ["anyat", "another"],
      ["preyah", "the pleasant or immediately liked"],
      ["uta", "indeed or also"],
      ["eva", "just or certainly"]
    ],
    chant: "Use as study support, not recitation coaching.",
    interpretations: ["Discernment lane", "Ethical reflection lens", "No moral policing."],
    carry: "Name one choice and ask whether it only comforts the moment or also serves clarity.",
    confidence: 68
  },
  {
    id: "isha-1-lens",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    title: "Restraint with responsibility",
    transliteration: "isha vasyam idam sarvam",
    plain: "A compact source often discussed around seeing the world with reverence and restraint.",
    caution: "Keep this in review before public guidance; do not advise abandoning duties, safety, shelter, or care.",
    words: [
      ["isha", "by the Lord or the divine"],
      ["vasyam", "to be enveloped or inhabited"],
      ["idam", "this"],
      ["sarvam", "all"],
      ["tena", "by that"],
      ["tyaktena", "through relinquishment or restraint"]
    ],
    chant: "Mark as review-needed. No ritual, renunciation, or life-direction authority.",
    interpretations: ["Renunciation debate lane", "Responsibility boundary", "Needs commentary review."],
    carry: "Soften one attachment without neglecting a real responsibility.",
    confidence: 54
  }
];

const releases = [
  ["v2.4.5", "v2.4.5 mantra intake", "mantraintake", "Intake", "VedaPath Mantra Intake", "Mantra intake", "Verse intake", "Begin with the verse, not the vibe.", "A mantra intake room that asks which source, family, transliteration, plain sense, and boundary must be visible before any calm practice starts.", "Bhagavad Gita 2.48", "Source intake prototype, not recitation authority.", 10, "bg-2-48-mantra-lens", "Verse Focus Room", "Collect the minimum safe verse fields before practice.", "Mantra Intake gives VedaPath a careful doorway into verse-level study."],
  ["v2.4.6", "v2.4.6 verse focus", "versefocus", "Focus", "VedaPath Verse Focus Room", "Verse focus", "Verse focus", "Hold one verse in clean focus.", "A verse focus room that shows one source candidate, transliteration, plain sense, confidence, and caution without crowding the learner.", "Bhagavad Gita 2.48", "Verse focus preview, not commentary authority.", 20, "bg-2-48-mantra-lens", "Transliteration Lab", "Make the verse card quiet and readable.", "Verse Focus Room keeps Mantra Lens simple enough for everyday study."],
  ["v2.4.7", "v2.4.7 transliteration", "transliterationlab", "Translit", "VedaPath Transliteration Lab", "Transliteration", "Transliteration lab", "Read the sound layer with humility.", "A transliteration lab that separates source text handling, pronunciation humility, and learner-friendly reading support.", "Rigveda 3.62.10", "Transliteration support, not pronunciation certification.", 30, "gayatri-3-62-10-lens", "Word Meaning Rail", "Add transliteration without pretending audio mastery.", "Transliteration Lab opens Sanskrit study while keeping pronunciation claims restrained."],
  ["v2.4.8", "v2.4.8 word rail", "wordmeaningrail", "Words", "VedaPath Word Meaning Rail", "Word rail", "Word meaning rail", "Let key words carry meaning slowly.", "A word meaning rail that breaks a verse into small lexical cards so users can study without drowning in commentary.", "Katha Upanishad 1.2.1", "Word meaning preview, not dictionary authority.", 40, "katha-1-2-1-lens", "Chant Boundary", "Show word meanings as learning aids, not final translation.", "Word Meaning Rail adds progressive depth without visual noise."],
  ["v2.4.9", "v2.4.9 chant boundary", "chantboundary", "Boundary", "VedaPath Chant Boundary", "Chant boundary", "Chant boundary", "Respect chant without pretending to teach it.", "A chant boundary room that explains what the product can safely show now, and what needs licensed audio, lineage review, or human guidance later.", "Rigveda 3.62.10", "Chant boundary prototype, not ritual instruction.", 50, "gayatri-3-62-10-lens", "Meter Guide", "Make sacred handling explicit before adding practice.", "Chant Boundary keeps calm practice respectful and non-authoritative."],
  ["v2.5.0", "v2.5.0 meter guide", "meterguide", "Meter", "VedaPath Meter Guide", "Meter guide", "Meter guide", "Show rhythm as context, not performance.", "A meter guide preview that treats cadence as study context, not an audio lesson or ritual certification.", "Bhagavad Gita 2.48", "Meter preview, not chanting certification.", 60, "bg-2-48-mantra-lens", "Interpretation Stack", "Introduce rhythm carefully without performance claims.", "Meter Guide prepares verse study for future licensed audio and scholar review."],
  ["v2.5.1", "v2.5.1 interpretation stack", "interpretationstack", "Views", "VedaPath Interpretation Stack", "Interpretation stack", "Interpretation stack", "Compare meaning without flattening schools.", "An interpretation stack that lets users compare plain sense, tradition lane, modern reflection, and overclaim warning for the same verse.", "Isha Upanishad 1", "Interpretation stack preview, not school-complete commentary.", 70, "isha-1-lens", "Recitation Loop", "Separate plain sense, tradition lane, and modern reflection.", "Interpretation Stack protects plural readings without making every school sound identical."],
  ["v2.5.2", "v2.5.2 recitation loop", "recitationloop", "Practice", "VedaPath Recitation Loop Preview", "Recitation loop", "Recitation loop", "Practice quietly, save only locally.", "A device-local practice loop with a short timer, one verse, one reflection, and clear boundaries around recitation and advice.", "Bhagavad Gita 2.48", "Local practice preview, not ritual instruction.", 80, "bg-2-48-mantra-lens", "Mobile Mantra Lens", "Test the practice habit without accounts or audio claims.", "Recitation Loop Preview turns source study into a calm daily habit while preserving privacy."],
  ["v2.5.3", "v2.5.3 mantra mobile", "mobilemantralens", "Mobile", "VedaPath Mobile Mantra Lens", "Mantra mobile", "Mobile mantra", "Keep verse study calm on a phone.", "A mobile polish room for stable verse cards, full-width controls, compact word rails, and readable boundaries on small screens.", "Katha Upanishad 1.2.1", "Mobile mantra preview, not final app shell.", 90, "katha-1-2-1-lens", "Mantra Lens Control Room", "Protect mantra study on small screens.", "Mobile Mantra Lens keeps sacred study usable in real life."],
  ["v2.5.4", "v2.5.4 mantra lens", "mantralenslab", "Mantra", "VedaPath Mantra Lens Control Room", "Mantra lens", "Mantra Lens control", "Study a verse. Keep the boundary. Carry one action.", "A mantra lens control room that combines verse focus, transliteration, word meaning, chant boundary, interpretation stack, local practice memory, and copyable study packets.", "Bhagavad Gita 2.48", "Mantra Lens prototype, not recitation authority or spiritual instruction.", 100, "bg-2-48-mantra-lens", "Founder instruction", "Use this as the first Sanskrit Lens standard for the trusted MVP.", "Mantra Lens Control Room completes the verse-level study layer for VedaPath AI."]
].map(([version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, stance, sprintPercent, defaultVerse, next, primaryAsk, summary]) => ({
  version, badge, slug, nav, title, pageLabel, eyebrow, h1, lead, source, stance, sprintPercent, defaultVerse, next, primaryAsk, summary,
  items: [
    ["Source", "Show source family, citation, and confidence before practice.", "Keeps study grounded."],
    ["Words", "Break the verse into learner-sized word cards.", "Creates progressive depth."],
    ["Boundary", "Separate study support from ritual or pronunciation authority.", "Protects trust."],
    ["Practice", "Save local notes and completions only on the device.", "Tests habit safely."]
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
    brief: [["Mantra promise", item.summary], ["Founder move", item.primaryAsk], ["Trust move", `Keep this boundary visible: ${item.stance}`]],
    checklist: item.items.slice(0, 3).map((row) => [row[0], row[1]]),
    boundary: [
      ["No ritual authority", "Do not imply VedaPath teaches authorized chanting, initiation, ritual, or lineage practice."],
      ["No pronunciation claim", "Treat transliteration as study support until reviewed audio and teachers exist."],
      ["No therapy claim", "Calm practice is reflection support, not medical, clinical, emergency, or spiritual authority."]
    ]
  };
}
function mantraNav(prefix = "", rel = "") {
  const isMantraPage = visible.some((item) => rel === `${item.slug}.html`);
  return `          <a class="link${isMantraPage ? " active" : ""}" href="${prefix}${active.slug}.html">Mantra</a>`;
}
function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH MANTRA LENS SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH MANTRA LENS SPRINT NAV END -->";
  const nav = mantraNav(prefix, rel);
  if (content.includes(start)) content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  else if (content.includes("          <!-- VEDAPATH CITED ANSWER SPRINT NAV END -->")) content = content.replace("          <!-- VEDAPATH CITED ANSWER SPRINT NAV END -->", `          <!-- VEDAPATH CITED ANSWER SPRINT NAV END -->\n${start}\n${nav}\n${end}`);
  else if (content.includes("<span class=\"version\">")) content = content.replace("<span class=\"version\">", `${start}\n${nav}\n${end}\n          <span class=\"version\">`);
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}
function lensData() {
  return {
    product: "VedaPath AI",
    release: active.version,
    status: "mantra lens prototype",
    warning: "Prototype verse study only. Not ritual instruction, pronunciation certification, therapy, emergency support, or spiritual authority.",
    verses
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
    <link rel="stylesheet" href="assets/vedapath-mantra-lens.css">
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
          <a class="link" href="citedanswerlab.html">Answers</a>
          <!-- VEDAPATH MANTRA LENS SPRINT NAV START -->
${mantraNav("", `${item.slug}.html`)}
          <!-- VEDAPATH MANTRA LENS SPRINT NAV END -->
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Mantra Lens sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Ten rooms turn verse study into a calm, source-first practice surface.</p>
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

          <div class="source-block" aria-label="Release mantra card">
            <div><span class="source-meta">Release</span><span class="source-value">${item.version}</span></div>
            <div><span class="source-meta">Source candidate</span><span class="source-value">${item.source}</span></div>
            <div><span class="source-meta">Practice state</span><span class="source-value">${item.primaryAsk}</span></div>
            <div><span class="source-meta">Boundary</span><span class="source-value">${item.stance}</span></div>
          </div>

          <section class="mantra-lens" id="mantraLens" data-verse="${item.defaultVerse}" aria-label="Mantra Lens">
            <div class="mantra-head">
              <div>
                <span class="eyebrow">Verse-level source practice</span>
                <h2>Mantra Lens</h2>
                <p class="muted">Reads <strong>data/vedapath-mantra-lens.json</strong>. This is study support, not recitation authority.</p>
              </div>
              <div id="mantraStats" class="mantra-stats" aria-live="polite"></div>
            </div>

            <div class="mantra-tools">
              <label for="verseSelect">Source verse</label>
              <select id="verseSelect"></select>
              <label for="lensSelect">Lens</label>
              <select id="lensSelect">
                <option value="source">Source card</option>
                <option value="words">Word meanings</option>
                <option value="chant">Chant boundary</option>
                <option value="interpret">Interpretation stack</option>
                <option value="practice">Practice loop</option>
              </select>
            </div>

            <div class="mantra-layout">
              <div>
                <div id="verseCard" class="verse-card"></div>
                <div class="mantra-actions">
                  <button class="button primary" id="startPractice" type="button">Start 3:00</button>
                  <button class="button safe" id="completePractice" type="button">Complete</button>
                  <button class="button" id="clearPractice" type="button">Clear Local</button>
                </div>
                <div class="practice-clock" id="practiceClock">03:00</div>
              </div>
              <div>
                <div id="wordRail" class="word-rail"></div>
                <div id="lensPanel" class="lens-panel"></div>
                <label class="mantra-label" for="practiceNote">One line from practice</label>
                <textarea id="practiceNote" aria-label="Practice note"></textarea>
                <label class="mantra-label" for="lensPacket">Study packet</label>
                <textarea id="lensPacket" readonly aria-label="Mantra Lens study packet"></textarea>
                <button class="button safe" id="copyLensPacket" type="button">Copy Lens Packet</button>
              </div>
            </div>
          </section>

          <h2>Mantra Signals</h2>
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
          <span class="badge green">Mantra Lens</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.sprintPercent} percent"><div class="bar" style="--score:${item.sprintPercent}%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${item.version}</strong></div>
            <div class="metric"><span>Sprint</span><strong>${visible.length}/10</strong></div>
            <div class="metric"><span>Verses</span><strong>${verses.length}</strong></div>
            <div class="metric"><span>Next</span><strong>${item.next}</strong></div>
          </div>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Source</strong><p>Show citation.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Words</strong><p>Open meaning.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Respect chant.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Carry</strong><p>One action.</p></div></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Mantra Boundary</h2>
            <p class="muted">This lab is not ritual instruction, pronunciation certification, therapy, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>
    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
    <script src="assets/vedapath-mantra-lens.js"></script>
  </body>
</html>
`;
}
function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Mantra Focus

- Source candidate: ${item.source}
- Boundary: ${item.stance}
- Founder action: ${item.primaryAsk}

## Product Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Data Sources

- data/vedapath-mantra-lens.json
- data/vedapath-answer-patterns.json
- data/vedapath-source-library.json

## No-Go Boundary

This release should not imply ritual authority, pronunciation certification, therapy, emergency support, or spiritual authority.
`;
}
function writeMantraAssets() {
  write("data/vedapath-mantra-lens.json", `${safeJson(lensData())}\n`);
  write("assets/vedapath-mantra-lens.css", `/* VedaPath Mantra Lens */
.mantra-lens{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:8px;background:rgba(255,253,248,.9)}
.mantra-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,280px);gap:14px;align-items:start}.mantra-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.mantra-stat,.verse-card,.word-card,.lens-panel,.practice-card{border:1px solid var(--line);border-radius:8px;background:var(--surface)}.mantra-stat{padding:10px}.mantra-stat span,.word-card span,.lens-panel span,.mantra-tools label,.mantra-label{display:block;color:var(--muted);font-size:12px}.mantra-stat strong{display:block;font-size:22px;line-height:1.1}
.mantra-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0}.mantra-tools select,#practiceNote,#lensPacket{width:100%;border:1px solid #efc1aa;border-radius:8px;background:#fffaf4;color:var(--ink);padding:12px;font-weight:750}
.mantra-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,1fr);gap:14px;align-items:start}.verse-card{padding:18px;border-left:4px solid var(--bhagwa)}.verse-title{display:flex;justify-content:space-between;gap:10px;align-items:start;flex-wrap:wrap}.verse-title span{border:1px solid #efc1aa;border-radius:999px;padding:5px 9px;color:var(--ochre);font-size:12px;font-weight:900;background:#fff8f2}.transliteration{margin:14px 0;font-size:24px;line-height:1.2;font-weight:900}.confidence-track{height:9px;border-radius:999px;overflow:hidden;background:#f1dcd2}.confidence-fill{height:100%;width:var(--score);background:linear-gradient(90deg,var(--bhagwa),var(--gold))}
.word-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.word-card{padding:10px}.word-card strong{display:block;margin-top:4px}.lens-panel{margin-top:12px;padding:14px;border-left:4px solid var(--green)}.lens-panel ul{margin:8px 0 0;padding-left:18px}.mantra-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.practice-clock{display:grid;place-items:center;min-height:76px;border-radius:8px;border:1px solid #efc1aa;background:#fff2e8;font-size:34px;font-weight:950;color:var(--ochre)}#practiceNote{min-height:84px;resize:vertical}#lensPacket{min-height:170px;resize:vertical}.mantra-label{margin:12px 0 6px;font-weight:850}
@media(max-width:860px){.mantra-head,.mantra-stats,.mantra-tools,.mantra-layout,.word-rail{grid-template-columns:1fr}.mantra-actions .button,#copyLensPacket{width:100%}.transliteration{font-size:21px}}
`);
  write("assets/vedapath-mantra-lens.js", `const mantraRoot=document.getElementById("mantraLens");
if(mantraRoot)initMantraLens().catch((error)=>{mantraRoot.innerHTML='<p class="muted">Mantra Lens could not load verse data.</p>';console.error(error);});
async function loadMantraJson(url){const response=await fetch(url);if(!response.ok)throw new Error("Unable to load "+url);return response.json();}
function mantraText(value){return value===0?"0":String(value||"");}
function mantraSafe(value){return mantraText(value).replace(/[&<>"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));}
function mantraStorageKey(){return "vedapath-mantra-lens-practice";}
function readPractice(){try{return JSON.parse(localStorage.getItem(mantraStorageKey())||"[]");}catch(error){return[];}}
function writePractice(rows){localStorage.setItem(mantraStorageKey(),JSON.stringify(rows.slice(0,30)));}
function packetText(verse,lens,rows,note){return ["VedaPath Mantra Lens Study Packet","Source: "+verse.source,"Family: "+verse.family,"Title: "+verse.title,"Lens: "+lens,"Transliteration: "+verse.transliteration,"Plain sense: "+verse.plain,"Caution: "+verse.caution,"Carry: "+verse.carry,"Practice notes saved locally: "+rows.length,"Current note: "+(note||"None"),"","Boundary: study support only; not ritual instruction, pronunciation certification, therapy, emergency support, or spiritual authority."].join("\\n");}
function renderStats(verses,rows){const high=verses.filter((verse)=>verse.confidence>=70).length;mantraRoot.querySelector("#mantraStats").innerHTML=[["Verses",verses.length],["High",high],["Local",rows.length],["Lenses",5]].map((row)=>'<div class="mantra-stat"><span>'+mantraSafe(row[0])+'</span><strong>'+mantraSafe(row[1])+'</strong></div>').join("");}
function renderVerse(verse){mantraRoot.querySelector("#verseCard").innerHTML='<div class="verse-title"><h2>'+mantraSafe(verse.title)+'</h2><span>'+mantraSafe(verse.family)+'</span><span>'+mantraSafe(verse.source)+'</span></div><div class="transliteration">'+mantraSafe(verse.transliteration)+'</div><p>'+mantraSafe(verse.plain)+'</p><p class="muted">'+mantraSafe(verse.caution)+'</p><div class="confidence-track"><div class="confidence-fill" style="--score:'+mantraSafe(verse.confidence)+'%"></div></div>';}
function renderWords(verse){mantraRoot.querySelector("#wordRail").innerHTML=verse.words.map((word)=>'<article class="word-card"><span>'+mantraSafe(word[0])+'</span><strong>'+mantraSafe(word[1])+'</strong></article>').join("");}
function renderLens(verse,lens,rows){const panel=mantraRoot.querySelector("#lensPanel");if(lens==="words"){panel.innerHTML='<span>Word rail</span><strong>Study one word at a time.</strong><p class="muted">Meanings are learning aids, not final translations.</p>';return;}if(lens==="chant"){panel.innerHTML='<span>Chant boundary</span><strong>'+mantraSafe(verse.chant)+'</strong><p class="muted">Respect comes before feature ambition.</p>';return;}if(lens==="interpret"){panel.innerHTML='<span>Interpretation stack</span><strong>Compare without flattening.</strong><ul>'+verse.interpretations.map((item)=>'<li>'+mantraSafe(item)+'</li>').join("")+'</ul>';return;}if(lens==="practice"){panel.innerHTML='<span>Practice loop</span><strong>'+mantraSafe(verse.carry)+'</strong><p class="muted">Completed locally: '+mantraSafe(rows.length)+'</p>';return;}panel.innerHTML='<span>Source card</span><strong>'+mantraSafe(verse.source)+'</strong><p>'+mantraSafe(verse.plain)+'</p><p class="muted">'+mantraSafe(verse.caution)+'</p>';}
async function initMantraLens(){const data=await loadMantraJson("data/vedapath-mantra-lens.json");const verses=data.verses||[];const verseSelect=mantraRoot.querySelector("#verseSelect");const lensSelect=mantraRoot.querySelector("#lensSelect");const note=mantraRoot.querySelector("#practiceNote");const packet=mantraRoot.querySelector("#lensPacket");const clock=mantraRoot.querySelector("#practiceClock");const state={verseId:mantraRoot.dataset.verse||verses[0]?.id||"",lens:"source",seconds:180,timer:null};verseSelect.innerHTML=verses.map((verse)=>'<option value="'+mantraSafe(verse.id)+'">'+mantraSafe(verse.source+" | "+verse.title)+'</option>').join("");
function selected(){return verses.find((verse)=>verse.id===state.verseId)||verses[0];}
function drawClock(){const minutes=String(Math.floor(state.seconds/60)).padStart(2,"0");const seconds=String(state.seconds%60).padStart(2,"0");clock.textContent=minutes+":"+seconds;}
function stopTimer(){if(state.timer){window.clearInterval(state.timer);state.timer=null;}}
function render(){const verse=selected();const rows=readPractice();if(!verse)return;verseSelect.value=verse.id;lensSelect.value=state.lens;renderStats(verses,rows);renderVerse(verse);renderWords(verse);renderLens(verse,state.lens,rows);packet.value=packetText(verse,state.lens,rows,note.value.trim());drawClock();}
verseSelect.addEventListener("change",()=>{state.verseId=verseSelect.value;render();});lensSelect.addEventListener("change",()=>{state.lens=lensSelect.value;render();});note.addEventListener("input",render);mantraRoot.querySelector("#startPractice").addEventListener("click",()=>{stopTimer();state.seconds=180;drawClock();state.timer=window.setInterval(()=>{state.seconds=Math.max(0,state.seconds-1);drawClock();if(state.seconds===0)stopTimer();},1000);});mantraRoot.querySelector("#completePractice").addEventListener("click",()=>{const verse=selected();const rows=readPractice();rows.unshift({source:verse.source,title:verse.title,note:note.value.trim()||verse.carry,date:new Date().toISOString().slice(0,10)});writePractice(rows);note.value="";stopTimer();state.seconds=180;render();});mantraRoot.querySelector("#clearPractice").addEventListener("click",()=>{localStorage.removeItem(mantraStorageKey());stopTimer();state.seconds=180;render();});mantraRoot.querySelector("#copyLensPacket").addEventListener("click",()=>{packet.focus();packet.select();const button=mantraRoot.querySelector("#copyLensPacket");const original=button.textContent;const done=()=>{button.textContent="Copied Packet";window.setTimeout(()=>{button.textContent=original;},1400);};const fallback=()=>{try{document.execCommand("copy");}catch(error){return;}done();};if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(packet.value).then(done).catch(fallback);return;}fallback();});render();}
`);
}
function updateReadme() {
  let content = read("README.md");
  const links = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH MANTRA LENS SPRINT LINKS START -->", "<!-- VEDAPATH MANTRA LENS SPRINT LINKS END -->", links, "<!-- VEDAPATH CITED ANSWER SPRINT LINKS END -->");
  const features = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH MANTRA LENS SPRINT FEATURES START -->", "<!-- VEDAPATH MANTRA LENS SPRINT FEATURES END -->", features, "<!-- VEDAPATH CITED ANSWER SPRINT FEATURES END -->");
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}
function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const notes = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH MANTRA LENS SPRINT NOTES START -->", "<!-- VEDAPATH MANTRA LENS SPRINT NOTES END -->", notes, "<!-- VEDAPATH CITED ANSWER SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", content);
}
function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(content, "<!-- VEDAPATH MANTRA LENS SPRINT SUMMARY START -->", "<!-- VEDAPATH MANTRA LENS SPRINT SUMMARY END -->", summary, "<!-- VEDAPATH CITED ANSWER SPRINT SUMMARY END -->");
  const sections = visible.map((item, index) => `### ${228 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- keep verse study source-first, humble, and locally private

${shortTitle(item)} should never claim ritual authority, pronunciation certification, therapy, emergency support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(content, "<!-- VEDAPATH MANTRA LENS SPRINT BLUEPRINT START -->", "<!-- VEDAPATH MANTRA LENS SPRINT BLUEPRINT END -->", sections, "<!-- VEDAPATH CITED ANSWER SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", content);
}
function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes(`href="${active.slug}.html">Mantra</a>`)) content = content.replace(/href="[^"]+\.html">Answers<\/a>/, `href="citedanswerlab.html">Answers</a> | <a href="${active.slug}.html">Mantra</a>`);
  else content = content.replace(/href="[^"]+\.html">Mantra<\/a>/, `href="${active.slug}.html">Mantra</a>`);
  content = content.replace(/Updated [A-Za-z]+ \d{1,2}, \d{4} \| Branch main/, "Updated June 26, 2026 | Branch main");
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${active.version}</strong>\n          <p>Mantra Lens sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Mantra Lens sprint progress: ${visible.length}/10 rooms complete. The MVP now has a verse-level study standard.</p>`);
  const vision = Math.min(100, 97 + Math.floor(visible.length / 4));
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>${vision}%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:${vision}%"></div></div>\n          <p>Mantra path: verse intake, focus, transliteration, word rail, chant boundary, meter, interpretation, practice, and mobile polish.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>${future[0]?.version || "Founder instruction"}</strong>\n          <p>${future[0] ? shortTitle(future[0]) : "Mantra Lens sprint complete. Next release waits for founder instruction."}</p>`);
  const phaseBody = visible.concat(future).map((item, index) => `            <article class="phase">\n              <span class="badge ${index <= upto ? "done" : "later"}">${index <= upto ? "Done" : "Later"}</span>\n              <div>\n                <strong>Phase ${209 + index}: ${shortTitle(item)}</strong>\n                <p>${item.summary}</p>\n              </div>\n              <div class="percent">${index <= upto ? "100%" : "0%"}</div>\n            </article>`).join("\n");
  content = upsertBlock(content, "            <!-- VEDAPATH MANTRA LENS SPRINT PHASES START -->", "            <!-- VEDAPATH MANTRA LENS SPRINT PHASES END -->", phaseBody, "            <!-- VEDAPATH CITED ANSWER SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${209 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v2.4.4 Cited Answer Control Room"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Mantra Lens sprint complete" : `${visible.length}/10 Mantra Lens rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>\n              <li><span class="dot"></span><span>Keep the path simple: verse, transliteration, word rail, boundary, interpretation, local practice.</span></li>\n              <li><span class="dot"></span><span>Do not claim ritual authority, pronunciation certification, therapy, emergency support, or spiritual authority.</span></li>\n              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder instruction before choosing licensed audio, Sanskrit scholars, or production accounts."}</span></li>\n            </ul>`);
  write("build-status.html", content);
}
function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`);
  content = content.replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  const cards = visible.map((item) => `          <section class="rail-panel">\n            <h2>${item.nav}</h2>\n            <p class="muted">${item.summary}</p>\n            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>\n          </section>`).join("\n\n");
  content = upsertBlock(content, "          <!-- VEDAPATH MANTRA LENS SPRINT HOME START -->", "          <!-- VEDAPATH MANTRA LENS SPRINT HOME END -->", cards, "          <!-- VEDAPATH CITED ANSWER SPRINT HOME END -->");
  write("index.html", content);
}
function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">\n            <h3>${shortTitle(item)}</h3>\n            <p>${item.summary}</p>\n          </div>`).join("\n");
  content = upsertBlock(content, "          <!-- VEDAPATH MANTRA LENS SPRINT FEATURES START -->", "          <!-- VEDAPATH MANTRA LENS SPRINT FEATURES END -->", cards, "          <!-- VEDAPATH CITED ANSWER SPRINT FEATURES END -->");
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}
writeMantraAssets();
for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) addSprintNavToHtml(rel);
if (existsSync(file("brand/brand-board.html"))) addSprintNavToHtml("brand/brand-board.html", "../");
updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();
console.log(`Generated mantra-lens sprint through ${active.version} (${visible.length}/10).`);

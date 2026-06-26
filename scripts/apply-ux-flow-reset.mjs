import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";
const release = "v2.8.5";
const badge = "v2.8.5 UX flow";

function file(rel) { return path.join(root, rel); }
function read(rel) { return readFileSync(file(rel), utf8); }
function write(rel, content) {
  const out = file(rel);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, content, utf8);
}
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function upsertBlock(content, start, end, body, insertAfter) {
  const block = `${start}\n${body}\n${end}`;
  if (content.includes(start)) return content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), block);
  if (insertAfter && content.includes(insertAfter)) return content.replace(insertAfter, `${insertAfter}\n${block}`);
  return `${content.trimEnd()}\n\n${block}\n`;
}

const homeCss = `    <style>
      :root {
        --bhagwa: #d65a1f;
        --deep-ochre: #a83e12;
        --sacred-gold: #e0a83b;
        --warm-ivory: #fff7ea;
        --panel: #fffdf8;
        --panel-soft: rgba(255, 253, 248, 0.76);
        --ink: #1f1a17;
        --muted-brown: #604638;
        --peacock-green: #145c4a;
        --deep-indigo: #29335c;
        --line: rgba(91, 70, 56, 0.16);
        --soft-red: #fde8dd;
        --soft-green: #e8f0ea;
      }

      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        background: var(--warm-ivory);
        color: var(--ink);
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.55;
      }
      a { color: inherit; text-decoration: none; }
      button, textarea { font: inherit; }
      button { cursor: pointer; }

      .page {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        padding: 20px 0 48px;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--line);
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        flex: 0 0 auto;
      }

      .brand img {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;
      }

      .brand strong {
        display: block;
        font-size: 18px;
        line-height: 1.1;
        white-space: nowrap;
      }

      .brand span,
      .muted,
      .source-meta,
      .path-step p,
      .question-help,
      .small,
      .map-list span,
      .flow-step p {
        color: var(--muted-brown);
      }

      .brand span,
      .small,
      .source-meta,
      .map-list span {
        font-size: 13px;
      }

      .nav {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 7px;
        flex-wrap: wrap;
        max-width: 940px;
      }

      .link,
      .version,
      .button,
      .chip,
      .tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        border-radius: 8px;
        font-weight: 850;
        white-space: nowrap;
        font-size: 14px;
      }

      .link {
        padding: 7px 10px;
        color: #432414;
      }

      .link.active,
      .version {
        border: 1px solid #efb899;
        color: var(--deep-ochre);
        background: rgba(255, 253, 248, 0.76);
      }

      .version { padding: 7px 13px; }

      .home-intent {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
        gap: 18px;
        align-items: start;
        padding: 24px 0 18px;
      }

      .intent-copy,
      .flow-card,
      .panel,
      .answer-shell,
      .rail-panel,
      .source-block,
      .meter-step,
      .path-step,
      .footer-item,
      .map-card,
      .claim {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel-soft);
      }

      .intent-copy,
      .flow-card,
      .panel,
      .answer-shell,
      .rail-panel,
      .map-card {
        padding: 18px;
      }

      .intent-copy {
        display: grid;
        align-content: center;
      }

      h1,
      h2,
      h3,
      p {
        margin-top: 0;
      }

      h1 {
        max-width: 640px;
        margin: 12px 0 10px;
        font-size: clamp(40px, 5vw, 62px);
        line-height: 1;
        letter-spacing: 0;
      }

      h2 {
        margin-bottom: 10px;
        font-size: 24px;
        line-height: 1.1;
      }

      h3 {
        margin-bottom: 7px;
        font-size: 17px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        min-height: 28px;
        margin: 0 0 12px;
        border-radius: 999px;
        padding: 4px 10px;
        background: var(--soft-red);
        color: var(--deep-ochre);
        font-size: 12px;
        font-weight: 900;
      }

      .intent-actions,
      .button-row,
      .chips,
      .tabs,
      .source-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .intent-actions {
        margin-top: 4px;
      }

      .flow-card {
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .flow-card h2 {
        margin-bottom: 0;
      }

      .flow-steps {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 9px;
      }

      .flow-step {
        min-height: 118px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 12px;
      }

      .flow-step strong {
        display: block;
        margin: 8px 0 4px;
      }

      .flow-index,
      .path-index {
        display: inline-grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        background: var(--soft-green);
        color: var(--peacock-green);
        font-size: 12px;
        font-weight: 900;
      }

      .workspace {
        display: grid;
        grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.28fr) minmax(280px, 0.84fr);
        gap: 14px;
        align-items: start;
        padding-top: 4px;
      }

      .ask-panel,
      .answer-shell,
      .rail-panel {
        background: rgba(255, 253, 248, 0.88);
      }

      .ask-panel h2 {
        font-size: 32px;
        line-height: 1.05;
      }

      .question-box {
        display: grid;
        gap: 10px;
      }

      textarea {
        width: 100%;
        min-height: 116px;
        resize: vertical;
        border: 1px solid rgba(168, 62, 18, 0.28);
        border-radius: 8px;
        background: #fffaf4;
        color: var(--ink);
        padding: 13px;
      }

      textarea:focus {
        border-color: var(--bhagwa);
        outline: 3px solid rgba(214, 90, 31, 0.12);
      }

      .button,
      .chip,
      .tab {
        border: 1px solid rgba(168, 62, 18, 0.24);
        background: var(--panel);
        color: var(--deep-ochre);
        padding: 8px 11px;
      }

      .button.primary,
      .chip.active,
      .tab.active {
        border-color: var(--bhagwa);
        background: var(--bhagwa);
        color: white;
      }

      .button.secondary,
      .button.safe {
        color: var(--peacock-green);
        border-color: rgba(20, 92, 74, 0.24);
      }

      .question-help {
        margin: 10px 0 8px;
        font-size: 14px;
      }

      .answer-header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        align-items: start;
        margin-bottom: 14px;
      }

      .answer-header p {
        margin-bottom: 0;
        font-size: 17px;
      }

      .source-pill {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        border-radius: 999px;
        background: rgba(20, 92, 74, 0.12);
        color: var(--peacock-green);
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 900;
        white-space: nowrap;
      }

      .source-block {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin: 14px 0;
        padding: 12px;
        background: var(--panel);
        border-left: 4px solid var(--bhagwa);
      }

      .source-value {
        display: block;
        margin-top: 4px;
        font-weight: 900;
        line-height: 1.35;
      }

      .meter {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
      }

      .meter-step {
        min-height: 88px;
        padding: 10px;
        background: var(--panel);
      }

      .meter-step.active {
        border-color: rgba(214, 90, 31, 0.46);
        background: rgba(214, 90, 31, 0.1);
      }

      .meter-step strong,
      .meter-step span,
      .path-step strong,
      .path-step p {
        display: block;
      }

      .meter-step strong {
        margin-bottom: 5px;
        font-size: 13px;
      }

      .meter-step span,
      .path-step p,
      .footer-item p,
      .claim p {
        color: var(--muted-brown);
        font-size: 13px;
      }

      .tabs {
        margin: 14px 0 12px;
        border-top: 1px solid var(--line);
        padding-top: 14px;
      }

      .detail-area {
        min-height: 168px;
      }

      .detail-grid,
      .claim-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .detail-box {
        border-left: 3px solid rgba(214, 90, 31, 0.52);
        padding: 2px 0 2px 12px;
      }

      .claim {
        padding: 13px;
        background: var(--panel);
      }

      .rail {
        display: grid;
        gap: 12px;
      }

      .path-list {
        display: grid;
        gap: 9px;
      }

      .path-step {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr);
        gap: 10px;
        align-items: start;
        padding: 11px;
        background: var(--panel);
      }

      .path-step:hover,
      .path-step:focus-visible {
        border-color: #efb899;
        outline: none;
      }

      .mini-progress {
        height: 9px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(168, 62, 18, 0.14);
      }

      .mini-progress div {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--bhagwa), var(--sacred-gold));
      }

      .workspace-footer {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--line);
      }

      .footer-item {
        padding: 12px;
        background: var(--panel);
      }

      .experience-map {
        margin-top: 22px;
        padding-top: 20px;
        border-top: 1px solid var(--line);
      }

      .section-heading {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 16px;
        align-items: end;
        margin-bottom: 12px;
      }

      .section-heading p {
        max-width: 680px;
        margin-bottom: 0;
      }

      .map-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
      }

      .map-card {
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .map-list {
        display: grid;
        gap: 8px;
      }

      .map-list a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 9px 10px;
        font-weight: 850;
      }

      .map-list a:hover,
      .map-list a:focus-visible {
        border-color: #efb899;
        outline: none;
      }

      .correction {
        border-style: dashed;
      }

      [hidden] { display: none !important; }

      @media (max-width: 1080px) {
        .home-intent,
        .workspace,
        .map-grid {
          grid-template-columns: 1fr;
        }

        .flow-steps {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .page { width: min(100% - 24px, 1180px); }
        .topbar,
        .answer-header,
        .section-heading {
          align-items: flex-start;
          grid-template-columns: 1fr;
          flex-direction: column;
        }
        .nav {
          flex-wrap: nowrap;
          justify-content: flex-start;
          max-width: 100%;
          overflow-x: auto;
          padding-bottom: 4px;
          width: 100%;
        }
        .link,
        .version {
          flex: 0 0 auto;
        }
        .flow-steps,
        .source-block,
        .meter,
        .detail-grid,
        .claim-grid,
        .workspace-footer {
          grid-template-columns: 1fr;
        }
        h1 { font-size: clamp(34px, 10vw, 46px); }
      }
    </style>`;

const homeWorkspace = `      <section class="home-intent" aria-label="Product flow">
        <div class="intent-copy">
          <span class="eyebrow">UX flow reset</span>
          <h1>One question. One source. One next step.</h1>
          <p class="muted">VedaPath now opens with a simple route: ask clearly, see the source, choose a practice path, and let local patterns remember what helped.</p>
          <div class="intent-actions">
            <a class="button primary" href="#ask">Start with Ask</a>
            <a class="button secondary" href="patterncompanionlab.html">Open Pattern Companion</a>
          </div>
        </div>
        <div class="flow-card" aria-label="VedaPath flow">
          <h2>Guided Product Flow</h2>
          <div class="flow-steps">
            <div class="flow-step"><span class="flow-index">1</span><strong>Ask</strong><p>Begin with a real question or claim.</p></div>
            <div class="flow-step"><span class="flow-index">2</span><strong>Source</strong><p>Show citation, category, and caution.</p></div>
            <div class="flow-step"><span class="flow-index">3</span><strong>Practice</strong><p>Turn insight into one calm action.</p></div>
            <div class="flow-step"><span class="flow-index">4</span><strong>Remember</strong><p>Keep helpful patterns local and visible.</p></div>
          </div>
        </div>
      </section>

      <section class="workspace" aria-label="VedaPath AI prototype workspace">
        <aside class="panel ask-panel" id="ask">
          <span class="eyebrow">Ask first</span>
          <h2>Let us look at the source.</h2>
          <p class="muted">Ask a question or test a claim. The answer starts simple, then opens into source, Sanskrit, interpretation, and claim checking.</p>

          <div class="question-box">
            <label class="small" for="questionInput">Question</label>
            <textarea id="questionInput">What scripture did Oppenheimer quote?</textarea>
            <div class="button-row">
              <button class="button primary" id="askButton" type="button">Ask</button>
              <button class="button secondary" id="claimButton" type="button">Check Claim</button>
            </div>
          </div>

          <p class="question-help">Try one:</p>
          <div class="chips" aria-label="Sample questions">
            <button class="chip active" type="button" data-question="oppenheimer">Oppenheimer quote</button>
            <button class="chip" type="button" data-question="gita-veda">Gita vs Vedas</button>
            <button class="chip" type="button" data-question="gayatri">Gayatri mantra</button>
            <button class="chip" type="button" data-question="quantum">Quantum physics claim</button>
            <button class="chip" type="button" data-question="atman">Atman and Brahman</button>
          </div>
        </aside>

        <section class="answer-shell" aria-live="polite">
          <div class="answer-header">
            <div>
              <span class="eyebrow">Source-backed answer</span>
              <h2 id="answerTitle" class="answer-title">Oppenheimer was quoting the Gita, not the four Vedas.</h2>
              <p id="answerSummary">The famous line is associated with Bhagavad Gita 11.32. It is often called Vedic in popular culture, but the source is the Bhagavad Gita, a section of the Mahabharata usually classified as Smriti.</p>
            </div>
            <span class="source-pill" id="sourceFamily">Bhagavad Gita | Smriti</span>
          </div>

          <div class="source-block" aria-label="Source card">
            <div>
              <span class="source-meta">Primary citation</span>
              <span class="source-value" id="citation">Bhagavad Gita 11.32</span>
            </div>
            <div>
              <span class="source-meta">Pramana level</span>
              <span class="source-value" id="pramana">Direct source</span>
            </div>
            <div>
              <span class="source-meta">Confidence</span>
              <span class="source-value" id="confidence">High</span>
            </div>
            <div>
              <span class="source-meta">Do not overclaim</span>
              <span class="source-value" id="caution">Do not call it a direct Vedic quote.</span>
            </div>
          </div>

          <section aria-label="Pramana Meter">
            <h3>Pramana Meter</h3>
            <div class="meter">
              <div class="meter-step active" data-meter="direct"><strong>Direct Source</strong><span>Text passage is identifiable.</span></div>
              <div class="meter-step" data-meter="commentary"><strong>Commentary</strong><span>Tradition-specific reading.</span></div>
              <div class="meter-step" data-meter="scholarly"><strong>Scholarly View</strong><span>Academic context or debate.</span></div>
              <div class="meter-step" data-meter="analogy"><strong>Modern Analogy</strong><span>Helpful but not literal.</span></div>
              <div class="meter-step" data-meter="speculative"><strong>Speculative</strong><span>Marked with caution.</span></div>
            </div>
          </section>

          <div class="tabs" role="tablist" aria-label="Answer layers">
            <button class="tab active" type="button" data-tab="source">Source</button>
            <button class="tab" type="button" data-tab="sanskrit">Sanskrit</button>
            <button class="tab" type="button" data-tab="views">Interpretations</button>
            <button class="tab" type="button" data-tab="claim">Claim Checker</button>
          </div>

          <section class="detail-area" id="detailArea">
            <div class="detail-grid">
              <div class="detail-box">
                <h3>What the source says</h3>
                <p id="sourceText">In the Gita's cosmic-form scene, Krishna identifies himself with world-transforming Time. Popular English renderings often use "I am become Death," but the source category should be stated carefully.</p>
              </div>
              <div class="detail-box">
                <h3>Why this matters</h3>
                <p id="sourceWhy">VedaPath should gently correct the category without shaming the user. The quote is not from the four Vedas, but it is connected to a wider Sanskrit philosophical world.</p>
              </div>
            </div>
          </section>

          <div class="workspace-footer">
            <div class="footer-item"><strong>Source labels</strong><p>Separate Veda, Upanishad, Gita, commentary, and modern interpretation.</p></div>
            <div class="footer-item"><strong>Progressive depth</strong><p>Beginner summary first. Deeper layers open on demand.</p></div>
            <div class="footer-item"><strong>Human review</strong><p>Corrections become review candidates before accepted knowledge.</p></div>
          </div>
        </section>

        <aside class="rail" aria-label="Next path rail">
          <section class="rail-panel">
            <span class="eyebrow">Next path</span>
            <h2>Choose one lane</h2>
            <p class="muted">The old home showed every room at once. This version keeps the next decision small.</p>
            <div class="path-list">
              <a class="path-step" href="citedanswerlab.html"><span class="path-index">1</span><div><strong>Study</strong><p>Cited answers and source cards.</p></div></a>
              <a class="path-step" href="lifecompanionlab.html"><span class="path-index">2</span><div><strong>Calm</strong><p>Source-backed reflection.</p></div></a>
              <a class="path-step" href="practice.html"><span class="path-index">3</span><div><strong>Practice</strong><p>Three quiet minutes, one clear source.</p></div></a>
              <a class="path-step" href="patterncompanionlab.html"><span class="path-index">4</span><div><strong>Pattern</strong><p>Local memory of what helped.</p></div></a>
            </div>
          </section>

          <section class="rail-panel">
            <h2>MVP Progress</h2>
            <div class="mini-progress" aria-label="MVP progress 100 percent"><div style="width:100%"></div></div>
            <p class="muted" style="margin-top: 10px;">The prototype now has answer, practice, calm, conversation, and pattern layers. The next work is polish, data quality, and real retrieval.</p>
          </section>

          <section class="rail-panel correction">
            <h2>Correction Loop</h2>
            <p class="muted">Found a source issue? Corrections should become review tickets, not silent edits.</p>
            <button class="button" type="button" id="reviewButton">Suggest Review</button>
          </section>
        </aside>
      </section>

      <section class="experience-map" aria-label="VedaPath experience map">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Organized rooms</span>
            <h2>Explore by purpose</h2>
            <p class="muted">The deep rooms are still here, but now they are grouped by what the user is trying to do.</p>
          </div>
          <a class="button secondary" href="build-status.html">Open Build Status</a>
        </div>

        <div class="map-grid">
          <section class="map-card">
            <h3>Study</h3>
            <p class="muted">Source-first understanding.</p>
            <div class="map-list">
              <a href="blueprint.html">Blueprint <span>plan</span></a>
              <a href="sourcelibrary.html">Sources <span>library</span></a>
              <a href="mantralenslab.html">Mantra <span>lens</span></a>
            </div>
          </section>
          <section class="map-card">
            <h3>Calm</h3>
            <p class="muted">Reflection with boundaries.</p>
            <div class="map-list">
              <a href="lifecompanionlab.html">Life <span>daily</span></a>
              <a href="conversationcompanionlab.html">Talk <span>reply</span></a>
              <a href="patterncompanionlab.html">Pattern <span>local</span></a>
            </div>
          </section>
          <section class="map-card">
            <h3>Practice</h3>
            <p class="muted">Small actions, visible source.</p>
            <div class="map-list">
              <a href="practice.html">Practice <span>timer</span></a>
              <a href="daily.html">Daily <span>loop</span></a>
              <a href="sankalpa.html">Sankalpa <span>intent</span></a>
            </div>
          </section>
          <section class="map-card">
            <h3>Build</h3>
            <p class="muted">Progress and product trust.</p>
            <div class="map-list">
              <a href="build-status.html">Build <span>status</span></a>
              <a href="brand/brand-board.html">Brand <span>system</span></a>
              <a href="reviewdesk.html">Review <span>desk</span></a>
            </div>
          </section>
        </div>
      </section>`;

const sharedSprintCss = `:root {
  --bg: #fff7ea;
  --surface: #fffdf8;
  --ink: #1f1a17;
  --muted: #604638;
  --line: rgba(91, 70, 56, 0.16);
  --bhagwa: #d65a1f;
  --ochre: #a83e12;
  --gold: #e0a83b;
  --green: #145c4a;
  --indigo: #29335c;
  --soft-red: #fde8dd;
  --soft-green: #e8f0ea;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}

a { color: inherit; text-decoration: none; }
button, textarea { font: inherit; }
button { cursor: pointer; }

.shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 0 16px;
  border-bottom: 1px solid var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 210px;
}

.brand img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.brand strong {
  display: block;
  font-size: 20px;
  line-height: 1.1;
  white-space: nowrap;
}

.brand span, .muted, .meta, .source-meta, .room-card span, .mini-card p, .sprint-step p {
  color: var(--muted);
}

.brand span, .meta, .source-meta { font-size: 13px; }

.nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  flex-wrap: wrap;
  max-width: 940px;
}

.link, .version, .button, .tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border-radius: 8px;
  font-weight: 850;
  white-space: nowrap;
  font-size: 14px;
}

.link {
  padding: 7px 10px;
  color: #432414;
}

.link.active, .version {
  border: 1px solid #efb899;
  color: var(--ochre);
  background: rgba(255, 253, 248, 0.76);
}

.version { padding: 7px 13px; }

.workspace {
  display: grid;
  grid-template-columns: minmax(230px, 0.7fr) minmax(0, 1.42fr) minmax(250px, 0.78fr);
  gap: 14px;
  padding: 18px 0 34px;
  align-items: start;
}

.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.88);
  padding: 16px;
}

.panel.tight { box-shadow: none; }

.eyebrow, .badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  border-radius: 999px;
  padding: 5px 10px;
  color: var(--ochre);
  background: var(--soft-red);
  font-size: 12px;
  font-weight: 900;
}

.badge.green {
  color: var(--green);
  background: var(--soft-green);
}

h1, h2, h3, p { margin-top: 0; }
h1 {
  margin: 14px 0 10px;
  font-size: clamp(38px, 4.8vw, 58px);
  line-height: 1;
  letter-spacing: 0;
}
h2 { margin-bottom: 10px; font-size: 24px; line-height: 1.1; }
h3 { margin-bottom: 6px; font-size: 17px; }

.room-list, .item-list, .grid, .metric-grid, .sprint-list {
  display: grid;
  gap: 9px;
}

.room-list {
  max-height: 430px;
  overflow: auto;
  padding-right: 3px;
}

.room-card, .item-card, .mini-card, .metric, .sprint-step {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.8);
  text-align: left;
}

.room-card {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 10px;
}

.room-card.active, .room-card:hover, .room-card:focus-visible {
  border-color: #f09f79;
  background: #fff0e7;
  outline: none;
}

.index-pill, .step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: var(--soft-green);
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
}

.room-card.active .index-pill, .sprint-step.active .step-index {
  background: var(--bhagwa);
  color: white;
}

.room-card strong, .room-card span:not(.index-pill) { display: block; }
.room-card span:not(.index-pill) { font-size: 13px; }

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 128px;
  gap: 16px;
  align-items: center;
}

.mark-stage {
  border: 1px solid #f1d0bd;
  border-radius: 8px;
  background: #fff0df;
  padding: 8px;
}

.mark-stage img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}

.source-block {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin: 16px 0;
  padding: 13px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--bhagwa);
  border-radius: 8px;
  background: var(--surface);
}

.source-value {
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.35;
}

.item-card {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  padding: 11px;
}

.item-card p { margin-bottom: 0; }

.tabs, .button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tabs {
  margin: 14px 0 12px;
  border-top: 1px solid var(--line);
  padding-top: 14px;
}

.tab, .button {
  border: 1px solid #efb899;
  background: var(--surface);
  color: var(--ochre);
  padding: 8px 11px;
}

.tab.active, .button.primary {
  border-color: var(--bhagwa);
  background: var(--bhagwa);
  color: white;
}

.button.safe {
  border-color: #b9d3ca;
  color: #064f43;
}

.grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }

.mini-card {
  padding: 12px;
  border-left: 3px solid #f0a07d;
}

textarea {
  width: 100%;
  min-height: 150px;
  margin-top: 12px;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 12px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.metric-grid {
  grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  margin: 12px 0;
}

.metric { padding: 11px; }
.metric span { display: block; color: var(--muted); font-size: 12px; }
.metric strong { display: block; margin-top: 5px; font-size: 23px; line-height: 1; }

.progress {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(168, 62, 18, 0.14);
}

.bar {
  width: var(--score);
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--bhagwa), var(--gold));
}

.sprint-step {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 11px;
}

.boundary {
  border-style: dashed;
  box-shadow: none;
}

@media (max-width: 1100px) {
  .workspace { grid-template-columns: 1fr; }
  .topbar { align-items: flex-start; flex-direction: column; }
  .nav {
    flex-wrap: nowrap;
    justify-content: flex-start;
    max-width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
    width: 100%;
  }
  .link,
  .version {
    flex: 0 0 auto;
  }
  .room-list { max-height: none; }
}

@media (max-width: 760px) {
  .shell { width: min(100% - 28px, 1180px); }
  .hero-grid, .source-block, .grid, .metric-grid { grid-template-columns: 1fr; }
  .mark-stage { max-width: 160px; }
  h1 { font-size: 40px; }
}
`;

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/<style>[\s\S]*?<\/style>/, homeCss);
  content = content.replace(/\n      <section class="home-intent" aria-label="Product flow">[\s\S]*?\n    <\/main>/, `\n${homeWorkspace}\n    </main>`);
  content = content.replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${badge}</span>`);
  write("index.html", content);
}

function updateHtmlBadges() {
  for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) {
    let content = read(rel);
    content = content
      .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${badge}</span>`)
      .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${badge}</span>`);
    write(rel, content);
  }

  const brandRel = "brand/brand-board.html";
  if (read(brandRel)) {
    let content = read(brandRel);
    content = content
      .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${badge}</span>`)
      .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${badge}</span>`);
    write(brandRel, content);
  }
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content.replace(/<div class="meta">[\s\S]*?<\/div>\s*<\/header>/, `<div class="meta">Updated June 26, 2026 | Branch main | <strong>${badge}</strong> | <a href="index.html">Home</a> | <a href="blueprint.html">Blueprint</a> | <a href="citedanswerlab.html">Answers</a> | <a href="lifecompanionlab.html">Life</a> | <a href="conversationcompanionlab.html">Talk</a> | <a href="patterncompanionlab.html">Pattern</a></div>\n      </header>`);
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>\n          <strong>${release}</strong>\n          <p>UX Flow Reset: the home page now has one guided path, a calmer Ask surface, grouped room lanes, and less scattered navigation.</p>`);
  content = content.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Product surface is now organized around Ask, Source, Practice, and Pattern instead of a long room list.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>\n          <strong>100%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>\n          <p>Flow path: primary ask surface, source card, next-lane rail, grouped room map, and calmer shared release-room layout.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>\n          <strong>Founder review</strong>\n          <p>Review the new flow, then choose whether to polish mobile, simplify room pages further, or build real retrieval.</p>`);
  const phaseBody = `            <article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 249: UX Flow Reset</strong>\n                <p>Home page reorganized into Ask, Source, Practice, and Pattern lanes with a simpler rail and grouped room map.</p>\n              </div>\n              <div class="percent">100%</div>\n            </article>`;
  content = upsertBlock(content, "            <!-- VEDAPATH UX FLOW RESET PHASE START -->", "            <!-- VEDAPATH UX FLOW RESET PHASE END -->", phaseBody, "            <!-- VEDAPATH PATTERN COMPANION SPRINT PHASES END -->");
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase 250: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} UX Flow Reset</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.8.4 Pattern Companion Control Room</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make the product feel organized, calm, and easy to enter.</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for founder UX review</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">\n              <li><span class="dot"></span><span>Review the home page flow from first viewport to room map.</span></li>\n              <li><span class="dot"></span><span>Check whether Ask, Source, Practice, and Pattern match the product story.</span></li>\n              <li><span class="dot"></span><span>Keep future builds from adding every new room to the home page rail.</span></li>\n              <li><span class="dot"></span><span>Next UX pass should focus on mobile polish and room-page simplification.</span></li>\n            </ul>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = readme.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${release}\` is a trusted MVP prototype plus UX Flow Reset with:`);
  readme = upsertBlock(readme, "<!-- VEDAPATH UX FLOW RESET LINKS START -->", "<!-- VEDAPATH UX FLOW RESET LINKS END -->", "- [UX Flow Reset Notes](docs/UX_FLOW_RESET.md)", "<!-- VEDAPATH PATTERN COMPANION SPRINT LINKS END -->");
  readme = upsertBlock(readme, "<!-- VEDAPATH UX FLOW RESET FEATURES START -->", "<!-- VEDAPATH UX FLOW RESET FEATURES END -->", "- UX Flow Reset: home page reorganized into Ask, Source, Practice, and Pattern lanes, with grouped room entry points and calmer shared release-room styling.", "<!-- VEDAPATH PATTERN COMPANION SPRINT FEATURES END -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = notes.replace(/^# v[^ ]+ Prototype Notes/m, `# ${release} Prototype Notes`);
  notes = upsertBlock(notes, "<!-- VEDAPATH UX FLOW RESET NOTES START -->", "<!-- VEDAPATH UX FLOW RESET NOTES END -->", "- UX Flow Reset makes the home page less scattered by replacing the long room rail with one guided path, one next-lane rail, and four grouped room categories.", "<!-- VEDAPATH PATTERN COMPANION SPRINT NOTES END -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH UX FLOW RESET SUMMARY START -->", "<!-- VEDAPATH UX FLOW RESET SUMMARY END -->", "- UX Flow Reset: organize the product around Ask, Source, Practice, and Pattern rather than exposing every release room at once.", "<!-- VEDAPATH PATTERN COMPANION SPRINT SUMMARY END -->");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH UX FLOW RESET BLUEPRINT START -->", "<!-- VEDAPATH UX FLOW RESET BLUEPRINT END -->", `### 268. UX Flow Reset\n\nThe home page should feel like a product, not a release archive.\n\nIt should:\n\n- keep Ask as the first usable action\n- make source trust visible in the central answer surface\n- offer one next-lane decision instead of dozens of equal cards\n- group deeper rooms by purpose: Study, Calm, Practice, and Build\n- preserve simple Bhagwa-led identity without visual clutter\n\nUX Flow Reset should prevent future builds from adding every release room directly into the primary home rail.`, "<!-- VEDAPATH PATTERN COMPANION SPRINT BLUEPRINT END -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/UX_FLOW_RESET.md", `# VedaPath AI UX Flow Reset\n\nThis is the ${release} UX Flow Reset release.\n\n## Problem\n\nThe product had grown through many release rooms. The home page started to feel scattered because every new room appeared with similar visual weight.\n\n## Change\n\n- Rebuilt the home page around one guided product flow: Ask, Source, Practice, Pattern.\n- Kept the Ask surface in the first product area.\n- Reduced the right rail to one next-lane decision, MVP progress, and correction loop.\n- Added a grouped room map for deeper exploration.\n- Refined the shared sprint CSS so room pages have calmer sizing, shorter columns, and contained room lists.\n\n## Boundary\n\nThis is a UX organization build. It does not change source claims, retrieval data, privacy rules, or spiritual boundaries.\n`);
}

updateIndex();
write("assets/vedapath-sprint.css", sharedSprintCss);
updateHtmlBadges();
updateBuildStatus();
updateDocs();
console.log(`Applied ${release} UX Flow Reset.`);

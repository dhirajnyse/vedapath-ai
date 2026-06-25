import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";

const releases = [
  {
    version: "v0.7.5",
    badge: "v0.7.5 onboard",
    slug: "onboard",
    nav: "Onboard",
    title: "VedaPath Guided Onboarding Path",
    pageLabel: "Guided onboarding",
    eyebrow: "First visit path",
    h1: "Begin without being overwhelmed.",
    lead: "A simple first-run path that helps a new visitor choose one doorway: learn, calm, source, practice, or review.",
    source: "Katha Upanishad 1.3.14",
    family: "Upanishad | Shruti",
    stance: "Orientation, not conversion pressure.",
    progress: 91,
    next: "Personal Calm Profile",
    primaryAsk: "Choose the first doorway a new user should see.",
    summary: "Guided Onboarding Path turns the first visit into one calm choice instead of a crowded tour.",
    items: [
      ["Beginner", "Needs plain source labels before Sanskrit depth.", "Route to Ask, Source Card, and Learning Path."],
      ["Restless", "Needs a short reflection without therapy claims.", "Route to Calm, Daily, or Practice."],
      ["Researcher", "Needs citations, review status, and boundaries.", "Route to Library, Record, or Workbench."],
      ["Founder", "Needs next product decision and launch evidence.", "Route to Founder Console or Build Status."]
    ],
    modes: {
      brief: [
        ["First promise", "Do not ask a visitor to understand the whole product. Help them choose one honest doorway."],
        ["UX move", "Keep the first screen calm, with one primary path and visible source-first posture."],
        ["Launch move", "Use onboarding to learn user intent without hidden profiling."]
      ],
      checklist: [
        ["Entry", "Can the user pick a path in under one minute?"],
        ["Boundary", "Does the path avoid diagnosis, authority, or pressure?"],
        ["Handoff", "Does the next screen know the selected intent without pretending to know the user?"]
      ],
      boundary: [
        ["No hidden profile", "Do not infer faith, distress, or private identity from a first click."],
        ["No forced account", "Do not make calm depend on sign-up."],
        ["No product flood", "Do not show every room to a new user."]
      ]
    }
  },
  {
    version: "v0.7.6",
    badge: "v0.7.6 profile",
    slug: "profile",
    nav: "Profile",
    title: "VedaPath Personal Calm Profile",
    pageLabel: "Personal calm profile",
    eyebrow: "Device-local preference",
    h1: "Remember preferences, not private identity.",
    lead: "A transparent profile preview for tone, depth, source families, and boundaries that stays user-owned until real consent exists.",
    source: "Bhagavad Gita 6.5",
    family: "Bhagavad Gita | Smriti",
    stance: "Preference memory, not identity judgment.",
    progress: 92,
    next: "Source Journey Map",
    primaryAsk: "Define which preferences may be remembered and which must stay private.",
    summary: "Personal Calm Profile shows what VedaPath may remember, what it must not infer, and how a user can export or clear it.",
    items: [
      ["Tone", "Plain, reflective, scholarly, or very brief.", "Stored only as an explicit preference."],
      ["Depth", "Beginner, Sanskrit learner, philosophy reader, or reviewer.", "Changes explanation layers, not user value."],
      ["Boundaries", "No therapy, no ritual instruction, no authority voice.", "Shown before every sensitive feature."],
      ["Controls", "Export, clear, pause memory, and local-only status.", "User can see and remove every field."]
    ],
    modes: {
      brief: [
        ["Profile promise", "A calm product should remember only what the user knowingly gives it."],
        ["Product move", "Separate helpful preferences from hidden psychological conclusions."],
        ["Founder use", "This becomes the model for future account settings and consent copy."]
      ],
      checklist: [
        ["Explicit", "Is every remembered field named?"],
        ["Editable", "Can the user change or clear it?"],
        ["Bounded", "Does the system avoid private inference?"]
      ],
      boundary: [
        ["No personality score", "Do not turn calm choices into a user type."],
        ["No distress archive", "Do not store sensitive emotional content as durable profile data."],
        ["No silent sync", "Do not sync profile data before account consent exists."]
      ]
    }
  },
  {
    version: "v0.7.7",
    badge: "v0.7.7 journey",
    slug: "journey",
    nav: "Journey",
    title: "VedaPath Source Journey Map",
    pageLabel: "Source journey map",
    eyebrow: "Learning journey",
    h1: "See how one question becomes understanding.",
    lead: "A visual learning route from question to source, category, plain meaning, deeper layer, practice, and review.",
    source: "Mundaka Upanishad 1.1.3",
    family: "Upanishad | Shruti",
    stance: "Learning route, not final mastery.",
    progress: 93,
    next: "Reflection Journal Prototype",
    primaryAsk: "Map one common question into a six-step source journey.",
    summary: "Source Journey Map makes the learning path visible so users understand how VedaPath moves from curiosity to cited clarity.",
    items: [
      ["Question", "What is the user really asking?", "Captures curiosity without judging it."],
      ["Source", "Which source family and citation are relevant?", "Prevents category confusion."],
      ["Meaning", "What is the plain first explanation?", "Keeps beginners from drowning in detail."],
      ["Depth", "What Sanskrit, commentary, or debate layer is optional?", "Lets depth unfold only when chosen."]
    ],
    modes: {
      brief: [
        ["Journey promise", "Users should see the road, not only the answer."],
        ["UX move", "Make each answer explain how it knows what it knows."],
        ["Product move", "Turn repeated journeys into curriculum structure after review."]
      ],
      checklist: [
        ["Start", "Is the user question preserved clearly?"],
        ["Middle", "Are source family and citation visible?"],
        ["End", "Is the next practice or review action small?"]
      ],
      boundary: [
        ["No instant mastery", "A journey map is guidance, not completion."],
        ["No collapsed traditions", "Do not merge distinct interpretations to simplify the path."],
        ["No hidden ranking", "Do not rank traditions without source and reviewer context."]
      ]
    }
  },
  {
    version: "v0.7.8",
    badge: "v0.7.8 journal",
    slug: "journal",
    nav: "Journal",
    title: "VedaPath Reflection Journal Prototype",
    pageLabel: "Reflection journal",
    eyebrow: "Private reflection",
    h1: "Write one honest line beside a source.",
    lead: "A private journal preview that pairs a daily line with source candidate, boundary, carry action, and export controls.",
    source: "Bhagavad Gita 2.50",
    family: "Bhagavad Gita | Smriti",
    stance: "Reflection, not therapy or confession.",
    progress: 94,
    next: "Family Calm Mode",
    primaryAsk: "Define the safest local journal entry shape.",
    summary: "Reflection Journal Prototype gives daily calm a private writing surface without turning personal notes into hidden product data.",
    items: [
      ["One line", "What is true right now?", "Short enough to avoid emotional over-processing."],
      ["Source card", "Which passage frames the day?", "Keeps reflection grounded and cited."],
      ["Carry action", "What small action follows?", "Moves reflection into agency."],
      ["Export", "Copy or clear the local entry.", "User remains in control."]
    ],
    modes: {
      brief: [
        ["Journal promise", "The product should help users write simply, not pressure them to disclose deeply."],
        ["Design move", "One source, one line, one action, one boundary."],
        ["Launch move", "Keep journal storage device-local until account consent and deletion exist."]
      ],
      checklist: [
        ["Private", "Does the entry stay local in prototype?"],
        ["Small", "Can it be completed in three minutes?"],
        ["Exportable", "Can the user copy the handoff?"]
      ],
      boundary: [
        ["No therapy claim", "Do not frame journaling as treatment."],
        ["No confession mode", "Do not invite sensitive disclosure."],
        ["No invisible memory", "Do not train or persist from entries without explicit consent."]
      ]
    }
  },
  {
    version: "v0.7.9",
    badge: "v0.7.9 family",
    slug: "family",
    nav: "Family",
    title: "VedaPath Family Calm Mode",
    pageLabel: "Family calm mode",
    eyebrow: "Shared calm",
    h1: "Make one conversation gentler.",
    lead: "A shared reflection mode for home, family, and close relationships that turns pressure into one respectful question and one small agreement.",
    source: "Taittiriya Upanishad 1.11.2",
    family: "Upanishad | Shruti",
    stance: "Conversation support, not family therapy.",
    progress: 95,
    next: "Workplace Steadiness Mode",
    primaryAsk: "Design one safe shared reflection for family moments.",
    summary: "Family Calm Mode helps a household slow one conversation without storing private conflict or acting as a counselor.",
    items: [
      ["Arrive", "Name the shared moment without blaming.", "Keeps the room safe enough to begin."],
      ["Source", "Use one source candidate for steadiness.", "Avoids making one person the authority."],
      ["Question", "Ask one clean question everyone can answer.", "Moves away from accusation."],
      ["Agreement", "Choose one small next action.", "Leaves with agency, not diagnosis."]
    ],
    modes: {
      brief: [
        ["Family promise", "Support gentler conversation without becoming a therapist or judge."],
        ["Product move", "Make consent, privacy, and non-diagnosis visible."],
        ["Founder use", "This could become a signature calm use case if handled carefully."]
      ],
      checklist: [
        ["Consent", "Did everyone agree to use the shared prompt?"],
        ["Neutrality", "Does the wording avoid blaming one person?"],
        ["Exit", "Can the conversation stop without saving private details?"]
      ],
      boundary: [
        ["No mediation claim", "Do not position VedaPath as a family counselor."],
        ["No private record", "Do not store conflict details by default."],
        ["No safety replacement", "Do not use this for harm, crisis, or emergency situations."]
      ]
    }
  },
  {
    version: "v0.8.0",
    badge: "v0.8.0 work",
    slug: "work",
    nav: "Work",
    title: "VedaPath Workplace Steadiness Mode",
    pageLabel: "Workplace steadiness",
    eyebrow: "Work calm",
    h1: "Act clearly before pressure takes over.",
    lead: "A workday mode for meetings, messages, deadlines, and conflict that keeps source-backed steadiness practical and bounded.",
    source: "Bhagavad Gita 2.47",
    family: "Bhagavad Gita | Smriti",
    stance: "Work support, not performance coaching.",
    progress: 96,
    next: "Festival and Daily Calendar",
    primaryAsk: "Build one work-pressure route with a source, boundary, and next action.",
    summary: "Workplace Steadiness Mode translates calm into practical work moments without pretending to manage careers or mental health.",
    items: [
      ["Meeting", "Prepare one clear intention.", "Supports attention without scripting identity."],
      ["Message", "Pause before reply.", "Connects to Before Reply and source-backed tone."],
      ["Deadline", "Choose the next concrete action.", "Keeps focus on duty and process."],
      ["Conflict", "Separate facts, meaning, and next step.", "Avoids emotional escalation."]
    ],
    modes: {
      brief: [
        ["Work promise", "Make steadiness useful in real pressure without sounding preachy."],
        ["UX move", "Use short cards, one action, and copyable reply support."],
        ["Product move", "Work mode can become a daily retention loop if it stays practical."]
      ],
      checklist: [
        ["Moment", "Is the work pressure named clearly?"],
        ["Action", "Is the next step small and concrete?"],
        ["Boundary", "Does it avoid HR, legal, or medical advice?"]
      ],
      boundary: [
        ["No career authority", "Do not tell users what job decision to make."],
        ["No HR replacement", "Do not handle harassment, safety, or legal disputes."],
        ["No productivity guilt", "Do not turn calm into more pressure."]
      ]
    }
  },
  {
    version: "v0.8.1",
    badge: "v0.8.1 calendar",
    slug: "calendar",
    nav: "Calendar",
    title: "VedaPath Festival and Daily Calendar",
    pageLabel: "Festival calendar",
    eyebrow: "Calendar preview",
    h1: "Let days carry meaning without false precision.",
    lead: "A calendar concept for daily rhythm, festival learning, source notes, and careful regional boundaries.",
    source: "Rigveda 10.85.1",
    family: "Veda | Shruti",
    stance: "Learning calendar, not panchang authority.",
    progress: 97,
    next: "Mantra Pronunciation Prep",
    primaryAsk: "Define calendar content that teaches without claiming ritual authority.",
    summary: "Festival and Daily Calendar gives VedaPath a seasonal learning layer while keeping regional, ritual, and date boundaries explicit.",
    items: [
      ["Daily source", "One passage or concept for the day.", "Supports rhythm without obligation."],
      ["Festival note", "Plain introduction plus source family.", "Avoids flattening regional practice."],
      ["Regional boundary", "State where dates or customs vary.", "Prevents false universal claims."],
      ["Practice handoff", "Route to Practice, Journal, or Family Mode.", "Turns learning into gentle action."]
    ],
    modes: {
      brief: [
        ["Calendar promise", "A day can invite learning without becoming ritual instruction."],
        ["Product move", "Separate fixed learning content from date-specific authority."],
        ["Launch move", "Start with concept cards before publishing festival date claims."]
      ],
      checklist: [
        ["Source", "Is the calendar entry tied to a cited concept or text?"],
        ["Variation", "Does it mention regional or tradition variation when relevant?"],
        ["Action", "Does it offer one optional reflection or practice?"]
      ],
      boundary: [
        ["No panchang claim", "Do not present exact ritual timing."],
        ["No universal festival script", "Do not erase regional and family differences."],
        ["No obligation", "Do not make users feel spiritually behind."]
      ]
    }
  },
  {
    version: "v0.8.2",
    badge: "v0.8.2 mantra",
    slug: "mantra",
    nav: "Mantra",
    title: "VedaPath Mantra Pronunciation Prep",
    pageLabel: "Mantra prep",
    eyebrow: "Silent mantra prep",
    h1: "Prepare pronunciation before adding sound.",
    lead: "A silent preparation room for mantra source, transliteration, syllable grouping, reviewer needs, and audio licensing gates.",
    source: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    stance: "Pronunciation prep, not recitation authority.",
    progress: 98,
    next: "Launch Landing Kit",
    primaryAsk: "Prepare the first mantra record without publishing audio claims.",
    summary: "Mantra Pronunciation Prep turns future audio into a careful source, review, and rights workflow before any sound is shipped.",
    items: [
      ["Source", "Passage, meter, deity, seer, and source URL.", "Keeps mantra identity precise."],
      ["Text", "Devanagari, IAST, word split, and syllable groups.", "Supports learning without audio."],
      ["Review", "Source reviewer, pronunciation reviewer, and rights reviewer.", "Separates trust lanes."],
      ["Audio gate", "License, speaker, tradition note, and silent fallback.", "Prevents premature sound release."]
    ],
    modes: {
      brief: [
        ["Mantra promise", "Sound should arrive only after source, pronunciation, tradition, and rights are ready."],
        ["UX move", "Use silent visual prep first."],
        ["Product move", "Make this the pattern for all future chant features."]
      ],
      checklist: [
        ["Text", "Are Sanskrit and transliteration reviewed?"],
        ["Rights", "Is audio licensing explicit?"],
        ["Boundary", "Does the page avoid ritual instruction?"]
      ],
      boundary: [
        ["No unlicensed audio", "Do not publish or generate recitation without rights and review."],
        ["No ritual authority", "Do not instruct users how they must practice."],
        ["No pronunciation certainty", "Do not imply one rendering covers every tradition."]
      ]
    }
  },
  {
    version: "v0.8.3",
    badge: "v0.8.3 landing",
    slug: "landing",
    nav: "Landing",
    title: "VedaPath Launch Landing Kit",
    pageLabel: "Launch landing kit",
    eyebrow: "Public launch kit",
    h1: "Invite people with clarity, not noise.",
    lead: "A public copy kit for launch headline, audience promises, trust proof, no-go claims, and early-access language.",
    source: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    stance: "Invitation, not authority claim.",
    progress: 99,
    next: "Next Build Control Tower",
    primaryAsk: "Choose the public launch promise that is true today.",
    summary: "Launch Landing Kit creates clear launch copy that shows calm, source-first trust, prototype status, and boundaries.",
    items: [
      ["Headline", "Ancient texts. Clear paths.", "Keeps the existing brand promise crisp."],
      ["Proof", "Source card, Pramana Meter, review queue, build status.", "Shows trust instead of hype."],
      ["Audience", "Learners, families, workers, reviewers, and founders.", "Keeps use cases concrete."],
      ["Boundary", "Prototype, not guru, therapy, ritual, or verified authority.", "Protects launch honesty."]
    ],
    modes: {
      brief: [
        ["Landing promise", "Launch copy should be beautiful because it is precise."],
        ["Product move", "Lead with source-first calm, then show trust mechanisms."],
        ["Founder use", "Use this kit to create the first public landing page version."]
      ],
      checklist: [
        ["Truth", "Can every claim be shown inside the prototype?"],
        ["Focus", "Is there one primary invitation?"],
        ["Boundary", "Are no-go claims visible near the call to action?"]
      ],
      boundary: [
        ["No spiritual authority", "Do not imply VedaPath replaces teachers or tradition."],
        ["No medical claim", "Do not promise mental-health outcomes."],
        ["No false production", "Do not say accounts, reviewers, or audio are live before they are."]
      ]
    }
  },
  {
    version: "v0.8.4",
    badge: "v0.8.4 tower",
    slug: "tower",
    nav: "Tower",
    title: "VedaPath Next Build Control Tower",
    pageLabel: "Control tower",
    eyebrow: "Founder control tower",
    h1: "Choose the next lane with a calm mind.",
    lead: "A founder control room that summarizes this personal calm sprint and turns it into one next product lane.",
    source: "Bhagavad Gita 18.63",
    family: "Bhagavad Gita | Smriti",
    stance: "Founder decision, not automatic roadmap.",
    progress: 100,
    next: "Founder direction",
    primaryAsk: "Pick the next lane: production backend, source dataset, launch page, audio, or reviewer ops.",
    summary: "Next Build Control Tower completes the personal calm sprint and frames the next real product decision.",
    items: [
      ["Ship path", "Polish onboarding and landing for public users.", "Best if launch learning is the next priority."],
      ["Trust path", "Build real source data and reviewer operations.", "Best if authority risk is the next priority."],
      ["Calm path", "Deepen journal, family, work, and calendar flows.", "Best if retention is the next priority."],
      ["Sound path", "Prepare mantra and voice rights with reviewers.", "Best if audio becomes signature."]
    ],
    modes: {
      brief: [
        ["Tower promise", "The sprint is complete. The next build should be chosen, not drifted into."],
        ["Product truth", "VedaPath now has many strong prototype rooms. Production work needs narrowing."],
        ["Decision", "Pick one lane and make the next release deeper, smaller, and more testable."]
      ],
      checklist: [
        ["Evidence", "Which lane has the clearest user or trust signal?"],
        ["Risk", "Which lane reduces the biggest launch risk?"],
        ["Scope", "What can be shipped in one honest release?"]
      ],
      boundary: [
        ["No scattered work", "Do not start backend, audio, launch, and reviewers all at once."],
        ["No authority leap", "Do not turn prototype surfaces into verified product claims."],
        ["No hidden data", "Do not add persistence without consent, export, and delete controls."]
      ]
    }
  }
];

const uptoArg = process.argv.find((arg) => arg.startsWith("--upto="));
const upto = uptoArg ? Number.parseInt(uptoArg.split("=")[1], 10) : releases.length - 1;

if (!Number.isInteger(upto) || upto < 0 || upto >= releases.length) {
  throw new Error(`Use --upto=0 through --upto=${releases.length - 1}`);
}

const visible = releases.slice(0, upto + 1);
const future = releases.slice(upto + 1);
const active = visible.at(-1);

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  return readFileSync(file(rel), utf8);
}

function write(rel, content) {
  const out = file(rel);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, content, utf8);
}

function safeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function shortTitle(item) {
  return item.title.replace(/^VedaPath\s+/, "");
}

function docName(item) {
  return shortTitle(item).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, body, insertAfter) {
  const block = `${start}\n${body}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), block);
  }
  if (insertAfter && content.includes(insertAfter)) {
    return content.replace(insertAfter, `${insertAfter}\n${block}`);
  }
  return `${content.trimEnd()}\n\n${block}\n`;
}

function sprintNav(prefix = "", rel = "") {
  return visible
    .map((item) => {
      const activeClass = rel === `${item.slug}.html` ? " active" : "";
      return `          <a class="link${activeClass}" href="${prefix}${item.slug}.html">${item.nav}</a>`;
    })
    .join("\n");
}

function addSprintNavToHtml(rel, prefix = "") {
  let content = read(rel);
  const start = "          <!-- VEDAPATH SPRINT NAV START -->";
  const end = "          <!-- VEDAPATH SPRINT NAV END -->";
  const nav = sprintNav(prefix, rel);
  if (content.includes(start)) {
    content = content.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`), `${start}\n${nav}\n${end}`);
  } else {
    const storyLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link" href="story.html">Story</a>`;
    const activeStoryLink = prefix ? `<a href="${prefix}story.html">Story</a>` : `<a class="link active" href="story.html">Story</a>`;
    const marker = content.includes(activeStoryLink) ? activeStoryLink : storyLink;
    content = content.replace(marker, `${marker}\n${start}\n${nav}\n${end}`);
  }
  content = content
    .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${active.badge}</span>`)
    .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${active.badge}</span>`);
  write(rel, content);
}

function pageHtml(item) {
  const rooms = visible.map(({ version, slug, nav }) => ({ version, slug, nav }));
  const data = { ...item, rooms };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${item.title}</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>${item.pageLabel}</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="calm.html">Calm</a>
          <a class="link" href="daily.html">Daily</a>
          <a class="link" href="practice.html">Practice</a>
          <a class="link" href="story.html">Story</a>
${sprintNav("", `${item.slug}.html`)}
          <span class="version">${item.badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="${item.title} workspace">
        <aside class="panel">
          <span class="eyebrow">Personal calm sprint</span>
          <h2>Release Rooms</h2>
          <p class="muted">Each room turns calm into one practical product surface for real life.</p>
          <div class="room-list" id="roomList"></div>
        </aside>

        <section class="panel">
          <div class="hero-grid">
            <div>
              <span class="eyebrow">${item.eyebrow}</span>
              <h1>${item.h1}</h1>
              <p class="muted">${item.lead}</p>
            </div>
            <div class="mark-stage">
              <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath ${item.nav} logo">
            </div>
          </div>

          <div class="source-block" aria-label="Release source card">
            <div>
              <span class="source-meta">Release</span>
              <span class="source-value">${item.version}</span>
            </div>
            <div>
              <span class="source-meta">Source candidate</span>
              <span class="source-value">${item.source}</span>
            </div>
            <div>
              <span class="source-meta">Text family</span>
              <span class="source-value">${item.family}</span>
            </div>
            <div>
              <span class="source-meta">Boundary</span>
              <span class="source-value">${item.stance}</span>
            </div>
          </div>

          <h2>Decision Signals</h2>
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
          <span class="badge green">Sprint progress</span>
          <h2 style="margin-top: 14px;">${item.nav} Pulse</h2>
          <p class="muted">${item.summary}</p>
          <div class="progress" aria-label="Sprint progress ${item.progress} percent">
            <div class="bar" style="--score:${item.progress}%"></div>
          </div>
          <div class="metric-grid">
            <div class="metric">
              <span>Current</span>
              <strong>${item.version}</strong>
            </div>
            <div class="metric">
              <span>Sprint</span>
              <strong>${visible.length}/10</strong>
            </div>
            <div class="metric">
              <span>Progress</span>
              <strong>${item.progress}%</strong>
            </div>
            <div class="metric">
              <span>Next</span>
              <strong>${item.next}</strong>
            </div>
          </div>

          <div class="sprint-list">
            <div class="sprint-step active">
              <span class="step-index">1</span>
              <div><strong>Arrive</strong><p>Name the real-life moment.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">2</span>
              <div><strong>Source</strong><p>Anchor it to a careful source candidate.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">3</span>
              <div><strong>Bound</strong><p>Say what this feature must not claim.</p></div>
            </div>
            <div class="sprint-step">
              <span class="step-index">4</span>
              <div><strong>Carry</strong><p>Leave with one small action.</p></div>
            </div>
          </div>

          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Release Boundary</h2>
            <p class="muted">This room is a prototype planning surface. It does not create production storage, verified answers, reviewer approval, therapy, ritual instruction, emergency support, or spiritual authority.</p>
          </section>
        </aside>
      </main>
    </div>

    <script type="application/json" id="room-data">${safeJson(data)}</script>
    <script src="assets/vedapath-sprint.js"></script>
  </body>
</html>
`;
}

function docMarkdown(item) {
  return `# ${item.title}

This is the ${item.version} ${item.title} release for VedaPath AI.

## Purpose

${item.summary}

## Source Candidate

- Source: ${item.source}
- Text family: ${item.family}
- Boundary: ${item.stance}

## Decision Signals

${item.items.map((row) => `- ${row[0]}: ${row[1]} ${row[2]}`).join("\n")}

## Founder Action

${item.primaryAsk}

## No-Go Boundary

This release should not imply production storage, verified answers, reviewer approval, therapy, ritual instruction, emergency support, or spiritual authority.
`;
}

function updateReadme() {
  let content = read("README.md");
  const linkBody = visible.map((item) => `- [${shortTitle(item)}](${item.slug}.html)\n- [${shortTitle(item)} Notes](docs/${docName(item)}.md)`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PERSONAL SPRINT LINKS START -->",
    "<!-- VEDAPATH PERSONAL SPRINT LINKS END -->",
    linkBody,
    "<!-- VEDAPATH LAUNCH SPRINT LINKS END -->"
  );
  const featureBody = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PERSONAL SPRINT FEATURES START -->",
    "<!-- VEDAPATH PERSONAL SPRINT FEATURES END -->",
    featureBody,
    "<!-- VEDAPATH LAUNCH SPRINT FEATURES END -->"
  );
  content = content.replace(/`v[^`]+` is a trusted MVP prototype plus [^\n]+ with:/, `\`${active.version}\` is a trusted MVP prototype plus ${shortTitle(active)} with:`);
  write("README.md", content);
}

function updatePrototypeNotes() {
  let content = read("docs/PROTOTYPE_NOTES.md");
  content = content.replace(/^# v[^ ]+ Prototype Notes/m, `# ${active.version} Prototype Notes`);
  const body = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PERSONAL SPRINT NOTES START -->",
    "<!-- VEDAPATH PERSONAL SPRINT NOTES END -->",
    body,
    "<!-- VEDAPATH LAUNCH SPRINT NOTES END -->"
  );
  write("docs/PROTOTYPE_NOTES.md", content);
}

function updateProductBlueprint() {
  let content = read("docs/PRODUCT_BLUEPRINT.md");
  const summary = visible.map((item) => `- ${shortTitle(item)}: ${item.summary}`).join("\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PERSONAL SPRINT SUMMARY START -->",
    "<!-- VEDAPATH PERSONAL SPRINT SUMMARY END -->",
    summary,
    "<!-- VEDAPATH LAUNCH SPRINT SUMMARY END -->"
  );
  const sections = visible.map((item, index) => `### ${58 + index}. ${shortTitle(item)}

${item.summary}

It should:

${item.items.map((row) => `- ${row[0]}: ${row[1]}`).join("\n")}
- preserve the boundary: ${item.stance}
- produce a copyable founder handoff

${shortTitle(item)} should never claim production storage, verified answers, reviewer approval, therapy, ritual instruction, crisis support, or spiritual authority.`).join("\n\n");
  content = upsertBlock(
    content,
    "<!-- VEDAPATH PERSONAL SPRINT BLUEPRINT START -->",
    "<!-- VEDAPATH PERSONAL SPRINT BLUEPRINT END -->",
    sections,
    "<!-- VEDAPATH LAUNCH SPRINT BLUEPRINT END -->"
  );
  write("docs/PRODUCT_BLUEPRINT.md", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  if (!content.includes('href="tower.html">Control Tower</a>')) {
    content = content.replace('<a href="founder.html">Founder Console</a>', '<a href="founder.html">Founder Console</a> | <a href="tower.html">Control Tower</a>');
  }
  content = content.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${active.version}</strong>
          <p>Personal calm sprint through ${shortTitle(active)}: ${visible.map(shortTitle).join(", ")}.</p>`);
  content = content.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>${active.progress}%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:${active.progress}%"></div></div>
          <p>Personal calm sprint progress: ${visible.length}/10 rooms complete. Remaining product work still needs production backend, real reviewer operations, and licensed audio decisions.</p>`);
  content = content.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>${future[0]?.version || "Founder direction"}</strong>
          <p>${future[0] ? shortTitle(future[0]) : "Ten-build sprint complete. Next release waits for founder choice."}</p>`);

  const phaseBody = visible.concat(future).map((item, index) => {
    const complete = index <= upto;
    return `            <article class="phase">
              <span class="badge ${complete ? "done" : "later"}">${complete ? "Done" : "Later"}</span>
              <div>
                <strong>Phase ${39 + index}: ${shortTitle(item)}</strong>
                <p>${item.summary}</p>
              </div>
              <div class="percent">${complete ? "100%" : "0%"}</div>
            </article>`;
  }).join("\n");
  content = upsertBlock(
    content,
    "            <!-- VEDAPATH PERSONAL SPRINT PHASES START -->",
    "            <!-- VEDAPATH PERSONAL SPRINT PHASES END -->",
    phaseBody,
    "            <!-- VEDAPATH LAUNCH SPRINT PHASES END -->"
  );
  content = content.replace(/<strong>Phase \d+: Production Implementation and Licensed Audio<\/strong>/, `<strong>Phase ${39 + releases.length}: Production Implementation and Licensed Audio</strong>`);
  content = content.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${active.version} ${shortTitle(active)}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${visible.length > 1 ? visible.at(-2).version + " " + shortTitle(visible.at(-2)) : "v0.7.4 Founder Console"}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${active.primaryAsk}</strong></div>`);
  content = content.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${visible.length === releases.length ? "Personal calm sprint complete" : `${visible.length}/10 personal sprint rooms complete`}</strong></div>`);
  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>${active.primaryAsk}</span></li>
              <li><span class="dot"></span><span>Keep the interface simple: one source, one boundary, one action.</span></li>
              <li><span class="dot"></span><span>Do not claim production backend, verified answers, reviewer approval, therapy, ritual instruction, or licensed audio.</span></li>
              <li><span class="dot"></span><span>${future[0] ? `Next: ${shortTitle(future[0])}.` : "Stop for founder direction before the next product lane."}</span></li>
            </ul>`);
  write("build-status.html", content);
}

function updateIndex() {
  let content = read("index.html");
  content = content.replace(/100% trusted MVP prototype\. New: [\s\S]*?<\/p>/, `${active.progress}% personal calm sprint. New: ${shortTitle(active)} completes room ${visible.length}/10 with a source-first boundary.</p>`);
  const cards = visible.map((item) => `          <section class="rail-panel">
            <h2>${item.nav}</h2>
            <p class="muted">${item.summary}</p>
            <a class="button" href="${item.slug}.html">Open ${item.nav}</a>
          </section>`).join("\n\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH PERSONAL SPRINT HOME START -->",
    "          <!-- VEDAPATH PERSONAL SPRINT HOME END -->",
    cards,
    "          <!-- VEDAPATH LAUNCH SPRINT HOME END -->"
  );
  write("index.html", content);
}

function updateBlueprintHtml() {
  let content = read("blueprint.html");
  const cards = visible.map((item) => `          <div class="feature">
            <h3>${shortTitle(item)}</h3>
            <p>${item.summary}</p>
          </div>`).join("\n");
  content = upsertBlock(
    content,
    "          <!-- VEDAPATH PERSONAL SPRINT FEATURES START -->",
    "          <!-- VEDAPATH PERSONAL SPRINT FEATURES END -->",
    cards,
    "          <!-- VEDAPATH LAUNCH SPRINT FEATURES END -->"
  );
  write("blueprint.html", content);
}

for (const item of visible) {
  write(`${item.slug}.html`, pageHtml(item));
  write(`docs/${docName(item)}.md`, docMarkdown(item));
}

const topLevelHtml = [
  "access.html", "bell.html", "blueprint.html", "bridge.html", "build-status.html", "calm.html", "card.html",
  "circle.html", "compass.html", "consent.html", "daily.html", "dashboard.html", "drill.html", "eval.html",
  "evening.html", "feedback.html", "fixtures.html", "index.html", "launch.html", "ledger.html", "lens.html",
  "library.html", "life.html", "loop.html", "memory.html", "model.html", "morning.html", "passages.html",
  "passport.html", "path.html", "policy.html", "practice.html", "queue.html", "reply.html", "retrieval.html",
  "rhythm.html", "samvada.html", "sankalpa.html", "schema.html", "scholar.html", "seeds.html", "seva.html",
  "storage.html", "story.html", "voice.html"
];

for (const rel of topLevelHtml) {
  if (existsSync(file(rel))) addSprintNavToHtml(rel);
}
if (existsSync(file("brand/brand-board.html"))) addSprintNavToHtml("brand/brand-board.html", "../");

updateReadme();
updatePrototypeNotes();
updateProductBlueprint();
updateBuildStatus();
updateIndex();
updateBlueprintHtml();

console.log(`Generated personal calm sprint through ${active.version} (${visible.length}/10).`);

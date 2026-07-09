import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const finalBadge = "v4.3.0 launch";
const pages = [
  {
    version: "v4.2.6",
    badge: "v4.2.6 signals",
    short: "signals",
    label: "Signals",
    href: "pilotlearningsignalreview.html",
    bodyClass: "pilot-learning-signal-review-page",
    title: "Pilot Learning Signal Review",
    eyebrow: "Pilot signal review",
    hero: "Review learning signals before they become product memory.",
    deck: "Only consented, visible, local pilot signals can become founder-reviewed learning. Nothing becomes product truth silently.",
    dataFile: "data/vedapath-pilot-learning-signal-review.json",
    data: {
      title: "Pilot Learning Signal Review",
      headline: "Let pilot learning pass through review.",
      copy: "This room turns consented pilot signals into reviewable learning packets. It separates useful product insight from private behavior, unsupported conclusions, or hidden analytics.",
      boundary: "Signals remain browser-local prototype records. They do not identify people, score spirituality, create profiles, or change source records without review.",
      storageKey: "vedapathPilotLearningSignalReviewV426",
      metrics: [
        { label: "Signal lanes", value: "4" },
        { label: "Consent", value: "Required" },
        { label: "Reviewer", value: "Founder" },
        { label: "Auto learning", value: "Off" }
      ],
      lanes: [
        { id: "consented", title: "Consented signal", summary: "User knowingly saved a local pilot signal.", decision: "Review candidate", signals: ["Page and room visited", "Source family opened", "Boundary accepted"] },
        { id: "unclear", title: "Unclear signal", summary: "Signal exists but consent or meaning is incomplete.", decision: "Hold", signals: ["Missing consent note", "Unclear source context", "No user-facing explanation"] },
        { id: "private", title: "Private note", summary: "User wrote something that should not become product telemetry.", decision: "Do not learn", signals: ["Personal story", "Health or family detail", "Identifying text"] },
        { id: "product", title: "Product insight", summary: "A pattern that may improve UI, source labels, or launch copy.", decision: "Founder review", signals: ["Repeated confusion", "Boundary copy helped", "Source lane needs clearer wording"] }
      ],
      checklist: [
        "Consent is visible and revocable.",
        "Signal does not identify a person.",
        "Signal maps to a product decision.",
        "Founder review happens before product memory.",
        "Boundary language stays visible."
      ],
      steps: ["Collect only after consent.", "Separate private notes.", "Write a review packet.", "Approve or discard manually."],
      defaultNote: "This signal is useful for product clarity, but it should not become accepted learning until founder review."
    },
    doc: "PILOT_LEARNING_SIGNAL_REVIEW.md",
    docTitle: "Pilot Learning Signal Review",
    docLines: [
      "Purpose: review only consented pilot-learning signals before they influence VedaPath.",
      "This is not analytics, profiling, or production memory.",
      "A signal becomes useful only when consent, product purpose, boundary, and review status are visible."
    ],
    changelog: "Adds a review layer for consented pilot-learning signals so local prototype behavior cannot silently become product memory."
  },
  {
    version: "v4.2.7",
    badge: "v4.2.7 first session",
    short: "first session",
    label: "First Session",
    href: "firstsessionlaunchspine.html",
    bodyClass: "first-session-launch-spine-page",
    title: "First Session Launch Spine",
    eyebrow: "First session spine",
    hero: "Make the first visit feel calm, guided, and complete.",
    deck: "A new learner should not meet the whole system at once. This room turns the first session into one question, one source, one action, and one remembered signal.",
    dataFile: "data/vedapath-first-session-launch-spine.json",
    data: {
      title: "First Session Launch Spine",
      headline: "A first session should finish one clean loop.",
      copy: "This room defines the private-pilot first-session path: ask clearly, read one source card, choose a calm practice action, and decide whether to save a visible local signal.",
      boundary: "This is onboarding design, not spiritual instruction or therapy. It keeps the first session small and source-backed.",
      storageKey: "vedapathFirstSessionLaunchSpineV427",
      metrics: [
        { label: "Steps", value: "4" },
        { label: "First action", value: "Ask" },
        { label: "Memory", value: "Optional" },
        { label: "Scope", value: "Pilot" }
      ],
      lanes: [
        { id: "ask", title: "Ask", summary: "Begin with one real question or claim.", decision: "Start", signals: ["Question is plain", "No category overclaim", "User sees source-first promise"] },
        { id: "source", title: "Source", summary: "Show citation, family, confidence, and boundary.", decision: "Read", signals: ["Citation visible", "Source family labeled", "Boundary included"] },
        { id: "practice", title: "Practice", summary: "Turn insight into one small action.", decision: "Carry", signals: ["Action is modest", "No guaranteed calm claim", "User keeps agency"] },
        { id: "remember", title: "Remember", summary: "Save only what the user knowingly wants to keep.", decision: "Optional", signals: ["Local-only memory", "Clear button visible", "No account required"] }
      ],
      checklist: [
        "The first screen has one main promise.",
        "The first answer shows source category and caution.",
        "The user can choose study, calm, or daily loop without confusion.",
        "Any saved memory is optional and local.",
        "The page does not ask for login, payment, or production claims."
      ],
      steps: ["Ask one question.", "Read one source.", "Carry one action.", "Remember only with consent."],
      defaultNote: "The first session is ready when a new user can complete one source-backed loop without needing the whole map."
    },
    doc: "FIRST_SESSION_LAUNCH_SPINE.md",
    docTitle: "First Session Launch Spine",
    docLines: [
      "Purpose: make the first VedaPath session calm and complete.",
      "The user should meet one question, one source, one action, and one optional memory decision.",
      "This reduces navigation pressure while preserving the source-first product promise."
    ],
    changelog: "Adds a first-session launch spine so new users enter through one guided loop instead of the full product map."
  },
  {
    version: "v4.2.8",
    badge: "v4.2.8 triage",
    short: "triage",
    label: "Source Triage",
    href: "sourcereadinesstriage.html",
    bodyClass: "source-readiness-triage-page",
    title: "Source Readiness Triage",
    eyebrow: "Source readiness triage",
    hero: "Sort sources before they become answer material.",
    deck: "A source should earn its way into pilot answers. This room separates ready passages, review-needed records, rights holds, and blocked candidates.",
    dataFile: "data/vedapath-source-readiness-triage.json",
    data: {
      title: "Source Readiness Triage",
      headline: "Every source needs a visible readiness lane.",
      copy: "This room gives VedaPath a simple source gate before retrieval: ready, needs review, rights hold, or blocked. It prevents beautiful answers from standing on weak source records.",
      boundary: "Readiness triage is a product workflow. It does not certify scholarship, translation rights, or spiritual authority.",
      storageKey: "vedapathSourceReadinessTriageV428",
      metrics: [
        { label: "Lanes", value: "4" },
        { label: "Ready", value: "3" },
        { label: "Review", value: "6" },
        { label: "Rights hold", value: "2" }
      ],
      lanes: [
        { id: "ready", title: "Ready", summary: "Citation, family, edition, boundary, and allowed use are visible.", decision: "Use in pilot", signals: ["Bhagavad Gita 2.48", "Katha Upanishad inquiry excerpt", "Rigveda source note"] },
        { id: "review", title: "Needs review", summary: "Useful source but missing context, interpretation, or reviewer notes.", decision: "Review", signals: ["Gayatri explanation", "Atman and Brahman comparison", "Cosmology claim"] },
        { id: "rights", title: "Rights hold", summary: "Source may be useful but edition or translation use is not clear.", decision: "Hold", signals: ["Modern translation excerpt", "Commentary passage", "Audio/chant material"] },
        { id: "blocked", title: "Blocked", summary: "Source should not feed answers until risk or claim type is corrected.", decision: "Do not use", signals: ["Unsupported science claim", "Miracle proof claim", "Personal diagnosis prompt"] }
      ],
      checklist: [
        "Citation is specific.",
        "Source family is labeled.",
        "Edition or translation posture is known.",
        "Allowed use is visible.",
        "Risk and boundary are recorded."
      ],
      steps: ["Classify source.", "Check rights.", "Check claim risk.", "Route to answer or review."],
      defaultNote: "This source should not enter pilot answers until citation, rights posture, and boundary are all visible."
    },
    doc: "SOURCE_READINESS_TRIAGE.md",
    docTitle: "Source Readiness Triage",
    docLines: [
      "Purpose: prevent source records from feeding answers before readiness is visible.",
      "Source lanes: ready, needs review, rights hold, blocked.",
      "A source may be useful and still not ready for pilot display."
    ],
    changelog: "Adds source readiness triage so retrieval can route source records before they become answer material."
  },
  {
    version: "v4.2.9",
    badge: "v4.2.9 answer gate",
    short: "answer gate",
    label: "Answer Gate",
    href: "answerreadinessgate.html",
    bodyClass: "answer-readiness-gate-page",
    title: "Answer Readiness Gate",
    eyebrow: "Answer readiness gate",
    hero: "Decide whether an answer is safe enough for pilot display.",
    deck: "A cited answer still needs restraint. This room checks source, confidence, boundary, plain meaning, and review posture before a pilot answer is shown.",
    dataFile: "data/vedapath-answer-readiness-gate.json",
    data: {
      title: "Answer Readiness Gate",
      headline: "Useful answers still need a readiness decision.",
      copy: "This room evaluates answer drafts before pilot display. It keeps the answer card standard clear: direct answer, source card, plain meaning, boundary, and next action.",
      boundary: "This gate approves prototype answer display only. It does not approve production AI, scholarship, ritual instruction, or medical/mental-health guidance.",
      storageKey: "vedapathAnswerReadinessGateV429",
      metrics: [
        { label: "Gates", value: "5" },
        { label: "Pilot safe", value: "Conditional" },
        { label: "Confidence", value: "Visible" },
        { label: "Authority", value: "Off" }
      ],
      lanes: [
        { id: "show", title: "Show with caution", summary: "Answer has source, confidence, boundary, and plain language.", decision: "Pilot display", signals: ["Oppenheimer source correction", "Steady action answer", "Source family comparison"] },
        { id: "revise", title: "Revise", summary: "Answer is useful but too wordy, unclear, or overconfident.", decision: "Rewrite", signals: ["Long Sanskrit explanation", "Too many caveats", "Missing direct answer"] },
        { id: "review", title: "Review", summary: "Answer needs scholar, reviewer, or rights review before display.", decision: "Reviewer gate", signals: ["Commentary dispute", "Translation-sensitive passage", "School-specific claim"] },
        { id: "block", title: "Block", summary: "Answer risks overclaiming, diagnosis, certainty, or ritual authority.", decision: "Do not display", signals: ["Vedas prove science", "Personal crisis advice", "Guaranteed calm promise"] }
      ],
      checklist: [
        "Direct answer is short and useful.",
        "Source card has citation and family.",
        "Confidence and uncertainty are visible.",
        "Boundary says what not to overclaim.",
        "Next action is small and non-authoritative."
      ],
      steps: ["Read draft.", "Check source card.", "Check boundary.", "Route display decision."],
      defaultNote: "This answer can be shown only if source, confidence, boundary, and next action remain visible."
    },
    doc: "ANSWER_READINESS_GATE.md",
    docTitle: "Answer Readiness Gate",
    docLines: [
      "Purpose: decide whether a source-backed answer is ready for pilot display.",
      "An answer must show direct answer, source card, confidence, boundary, and next action.",
      "This is a prototype gate, not production approval."
    ],
    changelog: "Adds an answer readiness gate to keep pilot answers bounded, source-carded, and reviewable."
  },
  {
    version: "v4.3.0",
    badge: "v4.3.0 launch",
    short: "launch",
    label: "Launch Console",
    href: "privatepilotlaunchconsole.html",
    bodyClass: "private-pilot-launch-console-page",
    title: "Private Pilot Launch Console",
    eyebrow: "Private pilot launch console",
    hero: "One founder surface for private pilot go or hold.",
    deck: "The private pilot should launch only when source, answer, consent, invite, and review gates are visible. This console makes the decision calm and explicit.",
    dataFile: "data/vedapath-private-pilot-launch-console.json",
    data: {
      title: "Private Pilot Launch Console",
      headline: "Launch only when the gates are visible.",
      copy: "This console brings the pilot readiness chain into one founder decision surface: first session, source triage, answer gate, consent, invite, and review queue.",
      boundary: "This is a private pilot planning console. It does not enable public launch, paid launch, hidden telemetry, production AI, or unreviewed source changes.",
      storageKey: "vedapathPrivatePilotLaunchConsoleV430",
      readyLabel: "Private pilot candidate",
      metrics: [
        { label: "Launch lanes", value: "5" },
        { label: "MVP", value: "100%" },
        { label: "Production", value: "Off" },
        { label: "Founder gate", value: "Required" }
      ],
      lanes: [
        { id: "experience", title: "Experience", summary: "First session is clear and navigation is calm.", decision: "Ready candidate", signals: ["Home path", "Daily loop", "First session spine"] },
        { id: "source", title: "Source", summary: "Source records have readiness lanes and rights posture.", decision: "Gate visible", signals: ["Source triage", "Rights desk", "Source edition intake"] },
        { id: "answer", title: "Answer", summary: "Pilot answer cards are bounded and reviewable.", decision: "Gate visible", signals: ["Answer readiness", "Promotion rules", "Review queue"] },
        { id: "privacy", title: "Privacy", summary: "Consent and local memory boundaries are visible.", decision: "Gate visible", signals: ["Telemetry consent", "Clear local memory", "No account required"] },
        { id: "invite", title: "Invite", summary: "Private pilot invite is honest, small, and source-first.", decision: "Founder review", signals: ["Invite packet", "Waitlist gate", "No payment"] }
      ],
      checklist: [
        "First session can be completed without guidance.",
        "Every pilot answer has source, confidence, and boundary.",
        "Source readiness lane is known.",
        "Consent is visible before any learning signal.",
        "Private pilot invite promises prototype learning, not production authority.",
        "Founder decides go, hold, or revise."
      ],
      steps: ["Review experience.", "Review source gates.", "Review answer gates.", "Review consent.", "Choose go or hold."],
      defaultNote: "Private pilot candidate only. Keep production, payment, hidden telemetry, and public launch disabled."
    },
    doc: "PRIVATE_PILOT_LAUNCH_CONSOLE.md",
    docTitle: "Private Pilot Launch Console",
    docLines: [
      "Purpose: give the founder one calm private-pilot go/hold surface.",
      "Launch readiness includes experience, source, answer, privacy, invite, and review gates.",
      "This console does not authorize production, payment, hidden telemetry, or public launch."
    ],
    changelog: "Adds a private pilot launch console that gathers the readiness chain into one founder go/hold surface."
  }
];

const navLinks = [
  ["index.html", "Home"],
  ["build-status.html", "Build"],
  ["brand/brand-board.html", "Brand"],
  ["blueprint.html", "Blueprint"],
  ["citedanswerlab.html", "Answers"],
  ["reviewqueuepersistence.html", "Review"],
  ["mantralenslab.html", "Mantra"],
  ["lifecompanionlab.html", "Life"],
  ["conversationcompanionlab.html", "Talk"],
  ["patterncompanionlab.html", "Pattern"],
  ["daily.html", "Daily"],
  ["answerpacketpilot.html", "Packet"],
  ["launchreadinesshub.html", "Launch"],
  ["productionretrievalpilotgate.html", "Pilot"],
  ["verifiedsourcerecordschema.html", "Records"],
  ["retrievalreviewerdesk.html", "Desk"],
  ["first25sourceqapack.html", "QA Pack"],
  ["learneraskflow.html", "Ask Flow"],
  ["citationdeeplinklayer.html", "Links"],
  ["sourceeditionrightsmatrix.html", "Rights"],
  ["reviewerdecisionhistory.html", "History"],
  ["retrievalscoringexplanation.html", "Score"],
  ["publicpilotwaitlistgate.html", "Waitlist"],
  ["sourceeditionintake.html", "Edition"],
  ["rightsreviewdesk.html", "Rights Desk"],
  ["revieweridentitylite.html", "Identity"],
  ["answerpromotionrules.html", "Promote"],
  ["pilotinvitepacket.html", "Invite"],
  ["pilottelemetryconsent.html", "Telemetry"],
  ["pilotlearningsignalreview.html", "Signals"],
  ["firstsessionlaunchspine.html", "First Session"],
  ["sourcereadinesstriage.html", "Source Triage"],
  ["answerreadinessgate.html", "Answer Gate"],
  ["privatepilotlaunchconsole.html", "Launch Console"]
];

function read(file) {
  return readFileSync(file, "utf8");
}

function write(file, text) {
  writeFileSync(file, text, "utf8");
}

function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) {
    throw new Error("Missing replacement target: " + label);
  }
  return text.replace(needle, replacement);
}

function replaceRegex(text, regex, replacement, label) {
  if (!regex.test(text)) {
    throw new Error("Missing regex target: " + label);
  }
  return text.replace(regex, replacement);
}

function navHtml(activeHref) {
  return navLinks.map(function ([href, label]) {
    const active = href === activeHref ? " active" : "";
    return '        <a class="link' + active + '" href="' + href + '">' + label + "</a>";
  }).join("\n") + '\n        <span class="version-pill">' + finalBadge + "</span>";
}

function pageTemplate(page) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${page.title} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-pilot-readiness.css" />
</head>
<body class="${page.bodyClass} pilot-readiness-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${page.short}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
${navHtml(page.href)}
      </nav>
    </header>

    <section class="pr-hero">
      <div class="pr-hero-copy">
        <p class="pr-eyebrow">${page.badge}</p>
        <h1>${page.title}</h1>
        <p>${page.deck}</p>
      </div>
      <aside class="pr-hero-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>${page.hero}</strong>
        <span>Source first. Calm path.</span>
      </aside>
    </section>

    <section class="pr-app" data-pilot-readiness-app data-kind="launchRoom" data-data-file="${page.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-pilot-readiness.js"></script>
</body>
</html>
`;
}

function docTemplate(page) {
  return `# ${page.docTitle}

${page.docLines.map(function (line) { return "- " + line; }).join("\n")}

## Release

- Version: ${page.version}
- Status: static GitHub Pages prototype
- Boundary: ${page.data.boundary}
`;
}

function check(label) {
  execFileSync(process.execPath, ["--check", "assets/vedapath-pilot-readiness.js"], { stdio: "pipe" });
  execFileSync(process.execPath, ["--check", "assets/vedapath-command-shell.js"], { stdio: "pipe" });
  execFileSync(process.execPath, ["--check", "scripts/apply-v426-v430-launch-batch.mjs"], { stdio: "pipe" });
  execFileSync(process.execPath, ["scripts/check-static-links.mjs"], { stdio: "pipe" });
  for (const page of pages) {
    JSON.parse(read(page.dataFile));
  }
  console.log(label + " checks ok");
}

function createPagesAndData() {
  for (const page of pages) {
    write(page.href, pageTemplate(page));
    write(page.dataFile, JSON.stringify(page.data, null, 2) + "\n");
    write(path.join("docs", page.doc), docTemplate(page));
  }
}

function updateNavs() {
  const rootHtml = readdirSync(".").filter(function (file) { return file.endsWith(".html"); });
  const files = rootHtml.concat(["brand/brand-board.html"].filter(existsSync));
  for (const file of files) {
    let text = read(file);
    if (!text.includes('class="navlinks nav"') && !text.includes('class="nav navlinks"')) continue;
    const href = file.replace(/\\/g, "/");
    const activeHref = href === "brand/brand-board.html" ? "brand/brand-board.html" : href;
    text = replaceRegex(
      text,
      /<nav class="(?:navlinks nav|nav navlinks)" aria-label="Primary navigation">[\s\S]*?<\/nav>/,
      '<nav class="navlinks nav" aria-label="Primary navigation">\n' + navHtml(activeHref) + "\n      </nav>",
      "primary nav " + file
    );
    text = text.replace(/<span class="version-pill">v[^<]+<\/span>/g, '<span class="version-pill">' + finalBadge + "</span>");
    write(file, text);
  }
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, 'const releaseBadge = "' + finalBadge + '";');
  text = replaceOnce(
    text,
    '{ title: "Retrieval", labels: ["Packet", "Launch", "Pilot", "Records", "Desk", "QA Pack", "Ask Flow", "Links", "Rights", "History", "Score", "Waitlist", "Edition", "Rights Desk", "Identity", "Promote", "Invite", "Telemetry"] }',
    '{ title: "Retrieval", labels: ["Packet", "Launch", "Pilot", "Records", "Desk", "QA Pack", "Ask Flow", "Links", "Rights", "History", "Score", "Waitlist", "Edition", "Rights Desk", "Identity", "Promote", "Invite", "Telemetry"] },\n    { title: "Pilot Launch", labels: ["Signals", "First Session", "Source Triage", "Answer Gate", "Launch Console"] }',
    "command shell launch group"
  );
  text = replaceOnce(
    text,
    '"Telemetry": "Pilot Telemetry Consent"\n  };',
    '"Telemetry": "Pilot Telemetry Consent",\n    "Signals": "Pilot Learning Signal Review",\n    "First Session": "First Session Launch Spine",\n    "Source Triage": "Source Readiness Triage",\n    "Answer Gate": "Answer Readiness Gate",\n    "Launch Console": "Private Pilot Launch Console"\n  };',
    "command shell page titles"
  );
  text = replaceOnce(
    text,
    '"pilot-telemetry-consent-page": "Pilot Telemetry Consent"\n  };',
    '"pilot-telemetry-consent-page": "Pilot Telemetry Consent",\n    "pilot-learning-signal-review-page": "Pilot Learning Signal Review",\n    "first-session-launch-spine-page": "First Session Launch Spine",\n    "source-readiness-triage-page": "Source Readiness Triage",\n    "answer-readiness-gate-page": "Answer Readiness Gate",\n    "private-pilot-launch-console-page": "Private Pilot Launch Console"\n  };',
    "command shell body page titles"
  );
  write("assets/vedapath-command-shell.js", text);
}

function launchRoomRenderer() {
  return `
  function renderLaunchRoom(data) {
    const key = data.storageKey || "vedapathLaunchRoom";
    let selectedId = data.lanes[0].id;
    function selected() {
      return data.lanes.find(function (item) { return item.id === selectedId; }) || data.lanes[0];
    }
    function decisionText() {
      const checked = app.querySelectorAll("[data-launch-check]:checked").length;
      if (checked === data.checklist.length) return data.readyLabel || "Ready for founder review";
      if (checked >= Math.ceil(data.checklist.length / 2)) return "Review candidate";
      return "Keep preparing";
    }
    function packet(active, note) {
      return [
        "VedaPath Launch Review",
        "Room: " + data.title,
        "Lane: " + active.title,
        "Decision: " + decisionText(),
        "Note: " + note,
        "Boundary: " + data.boundary
      ].join("\\n");
    }
    function paint() {
      const saved = safeRead(key);
      const active = selected();
      const left = '<span class="pr-eyebrow">Launch lane</span><h2>Choose focus</h2><div class="pr-list">' + data.lanes.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-launch-lane="' + escapeHtml(item.id) + '" type="button"><strong>' + escapeHtml(item.title) + '</strong> <span>' + escapeHtml(item.decision) + '</span></button>';
      }).join("") + '</div><article class="pr-card"><h3>Room boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      const checks = data.checklist.map(function (item, index) {
        return '<label class="pr-check"><input type="checkbox" data-launch-check ' + (index < Math.max(2, Math.floor(data.checklist.length / 2)) ? "checked" : "") + '><span>' + escapeHtml(item) + '</span></label>';
      }).join("");
      const signals = '<div class="pr-signal-list">' + (active.signals || []).map(function (item) {
        return '<span>' + escapeHtml(item) + '</span>';
      }).join("") + '</div>';
      const main = '<article class="pr-card pr-room-intro"><span class="pr-eyebrow green">' + escapeHtml(data.title) + '</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.summary) + '</p><div class="pr-fields"><div class="pr-field"><span>Decision lane</span><strong>' + escapeHtml(active.decision) + '</strong></div><div class="pr-field"><span>Current posture</span><strong data-launch-decision>' + escapeHtml(data.readyLabel || "Review candidate") + '</strong></div></div>' + signals + '</article><article class="pr-card"><h2>Founder checks</h2><div class="pr-form">' + checks + '</div><label><span class="pr-muted">Launch note</span><textarea class="pr-textarea" data-launch-note>' + escapeHtml(data.defaultNote || "") + '</textarea></label><div class="pr-actions"><button class="pr-button primary" data-evaluate-launch type="button">Evaluate Gate</button><button class="pr-button green" data-save-launch type="button">Save Review</button><button class="pr-button" data-copy-launch type="button">Copy Packet</button><button class="pr-button" data-clear-launch type="button">Clear Local</button></div></article>';
      const side = '<span class="pr-eyebrow green">Pilot path</span><h2>Decision sequence</h2><div class="pr-stack">' + data.steps.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local reviews</h3><p>' + saved.length + ' saved review packet' + (saved.length === 1 ? "" : "s") + ' in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-launch-lane]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-launch-lane");
          paint();
        });
      });
      app.querySelector("[data-evaluate-launch]")?.addEventListener("click", function () {
        const target = app.querySelector("[data-launch-decision]");
        if (target) target.textContent = decisionText();
      });
      app.querySelector("[data-save-launch]")?.addEventListener("click", function () {
        saveLocal(key, { room: data.title, lane: active.title, decision: decisionText(), note: app.querySelector("[data-launch-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-launch]")?.addEventListener("click", function () {
        copyText(packet(active, app.querySelector("[data-launch-note]")?.value || ""));
      });
      app.querySelector("[data-clear-launch]")?.addEventListener("click", function () {
        localStorage.removeItem(key);
        paint();
      });
    }
    paint();
  }

`;
}

function updatePilotReadinessRenderer() {
  let text = read("assets/vedapath-pilot-readiness.js");
  if (!text.includes("function renderLaunchRoom(data)")) {
    text = replaceOnce(text, "  const renderers = {", launchRoomRenderer() + "  const renderers = {", "launch room renderer");
  }
  text = replaceOnce(
    text,
    "    telemetryConsent: renderTelemetryConsent\n  };",
    "    telemetryConsent: renderTelemetryConsent,\n    launchRoom: renderLaunchRoom\n  };",
    "launch room renderer map"
  );
  write("assets/vedapath-pilot-readiness.js", text);
}

function updatePilotReadinessCss() {
  let text = read("assets/vedapath-pilot-readiness.css");
  if (text.includes(".pr-signal-list")) return;
  text += `

.pr-room-intro .pr-metrics {
  margin-top: 18px;
}

.pr-signal-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.pr-signal-list span {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.64);
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 7px 10px;
}

.pr-button span {
  display: block;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
  margin-top: 4px;
}
`;
  write("assets/vedapath-pilot-readiness.css", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const insert = pages.map(function (page) { return '  "' + page.href + '",'; }).join("\n");
  if (!text.includes('"pilotlearningsignalreview.html"')) {
    text = text.replace('  "pilottelemetryconsent.html",', '  "pilottelemetryconsent.html",\n' + insert);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/v4\.2\.5 consent/g, finalBadge);
  text = text.replace(/v4\.2\.5 pilot consent/g, "v4.3.0 private pilot launch");
  const launchCard = '<article class="rp-flow-step"><span class="rp-number">7</span><h3>Signals</h3><p>Review only consented local pilot-learning signals.</p><a class="rp-button green" href="pilotlearningsignalreview.html">Open</a></article>\n          <article class="rp-flow-step"><span class="rp-number">8</span><h3>First Session</h3><p>Guide a new learner through one complete source-backed loop.</p><a class="rp-button green" href="firstsessionlaunchspine.html">Open</a></article>\n          <article class="rp-flow-step"><span class="rp-number">9</span><h3>Launch Console</h3><p>Make the founder go or hold decision visible before private pilot.</p><a class="rp-button green" href="privatepilotlaunchconsole.html">Open</a></article>';
  if (!text.includes('href="privatepilotlaunchconsole.html"')) {
    text = text.replace(
      /(<article class="rp-flow-step"><span class="rp-number">6<\/span><h3>Telemetry<\/h3><p>Ask for consent before saving any pilot learning signal\.<\/p><a class="rp-button green" href="pilottelemetryconsent\.html">Open<\/a><\/article>)/,
      "$1\n          " + launchCard
    );
  }
  write("index.html", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<strong>v4\.2\.5 Pilot Telemetry Consent<\/strong>\s*<p>Measure public-pilot learning only after consent, privacy, and local storage boundaries are visible\.<\/p>/, '<strong>v4.2.6 Pilot Learning Signal Review</strong>\n          <p>Review only consented pilot-learning signals before any product decision or public claim.</p>');
  text = text.replace(/<span class="version">v4\.2\.5 consent<\/span>/g, '<span class="version">' + finalBadge + "</span>");
  text = text.replace(/<strong>v4\.2\.5<\/strong>/, "<strong>v4.3.0</strong>");
  text = text.replace(/Pilot Telemetry Consent completes[^<]+<\/p>/, "Private Pilot Launch Console completes the readiness chain from consented learning signal to founder go or hold decision.</p>");
  text = text.replace(/<strong>v4\.2\.5 Pilot Telemetry Consent<\/strong>/g, "<strong>v4.3.0 Private Pilot Launch Console</strong>");
  text = text.replace(/<strong>v4\.2\.4 Pilot Invite Packet<\/strong>/g, "<strong>v4.2.9 Answer Readiness Gate</strong>");
  text = text.replace(/Measure public-pilot learning only after consent, privacy, and local storage boundaries are visible\./g, "Gather source, answer, consent, invite, and review gates into one private pilot launch console.");
  text = text.replace(/Make the public pilot invite clear, bounded, and source-first before telemetry begins\./g, "Make the private pilot go or hold decision visible while production, payment, and hidden telemetry stay off.");
  text = text.replace(/Ready for pilot telemetry consent review/g, "Ready for founder private pilot launch review");
  text = text.replace(/<strong>v4\.2\.5 Pilot Telemetry Consent<\/strong>\s*<p>Measure public-pilot learning only after consent, privacy, and local storage boundaries are visible\.<\/p>/, '<strong>v4.3.1 Pilot Feedback Intake</strong>\n          <p>Turn private pilot comments into reviewable product feedback without hidden profile storage.</p>');
  text = text.replace(/<strong>v4\.2\.5<\/strong>/g, "<strong>v4.3.0</strong>");
  text = text.replace(/Current version[\s\S]*?v4\.2\.5[\s\S]*?<\/article>/, function (match) {
    return match
      .replace("v4.2.5", "v4.3.0")
      .replace(/Pilot Telemetry Consent[^<]+/, "Private Pilot Launch Console completes the readiness chain from signal review, first session, source triage, answer gate, and founder go or hold.");
  });
  text = text.replace(/MVP progress[\s\S]*?public-pilot learning signal\./, function (match) {
    return match.replace(/public-pilot learning signal\./, "private-pilot launch chain.");
  });
  text = text.replace(/Full vision progress[\s\S]*?before public pilot use\./, function (match) {
    return match.replace(/before public pilot use\./, "before private pilot launch.");
  });
  if (!text.includes("Phase 390: Private Pilot Launch Console")) {
    text = text.replace(
      /(<article class="roadmap-item">\s*<span class="status active">Active<\/span>\s*<div>\s*<strong>Phase 385: Pilot Telemetry Consent<\/strong>[\s\S]*?<\/article>)/,
      `$1
          <article class="roadmap-item">
            <span class="status done">Done</span>
            <div>
              <strong>Phase 386: Pilot Learning Signal Review</strong>
              <p>Consent signals become reviewed learning packets, not silent product memory.</p>
            </div>
            <strong>100%</strong>
          </article>
          <article class="roadmap-item">
            <span class="status done">Done</span>
            <div>
              <strong>Phase 387: First Session Launch Spine</strong>
              <p>New users get one guided ask-source-practice-remember loop.</p>
            </div>
            <strong>100%</strong>
          </article>
          <article class="roadmap-item">
            <span class="status done">Done</span>
            <div>
              <strong>Phase 388: Source Readiness Triage</strong>
              <p>Source records move through ready, review, rights hold, and blocked lanes.</p>
            </div>
            <strong>100%</strong>
          </article>
          <article class="roadmap-item">
            <span class="status done">Done</span>
            <div>
              <strong>Phase 389: Answer Readiness Gate</strong>
              <p>Answer drafts get a pilot display decision before use.</p>
            </div>
            <strong>100%</strong>
          </article>
          <article class="roadmap-item">
            <span class="status active">Active</span>
            <div>
              <strong>Phase 390: Private Pilot Launch Console</strong>
              <p>Founder reviews the full private pilot go or hold chain.</p>
            </div>
            <strong>100%</strong>
          </article>`
    );
  }
  write("build-status.html", text);
}

function updateDocs() {
  const entries = pages.map(function (page) {
    return `## ${page.version} ${page.title}

- Changes made: ${page.changelog}
- Files changed: \`${page.href}\`, \`${page.dataFile}\`, \`docs/${page.doc}\`, \`assets/vedapath-pilot-readiness.js\`, \`assets/vedapath-command-shell.js\`, \`assets/vedapath-pilot-readiness.css\`, \`scripts/check-static-links.mjs\`, \`index.html\`, and \`build-status.html\`.
- Checks run: \`node --check assets/vedapath-pilot-readiness.js\`, \`node --check assets/vedapath-command-shell.js\`, \`node --check scripts/apply-v426-v430-launch-batch.mjs\`, \`node scripts/check-static-links.mjs\`, and JSON parse for launch data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.
`;
  }).join("\n");
  const changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.3.0 Private Pilot Launch Console")) {
    write("CHANGELOG.md", entries + "\n" + changelog);
  }
  const readme = read("README.md");
  if (!readme.includes("## v4.3.0 Private Pilot Launch Console")) {
    write("README.md", entries + "\n" + readme);
  }
}

function run() {
  createPagesAndData();
  updateNavs();
  updateCommandShell();
  updatePilotReadinessRenderer();
  updatePilotReadinessCss();
  updateStaticLinks();
  updateIndex();
  updateBuildStatus();
  updateDocs();
  for (const page of pages) {
    check(page.version);
  }
}

run();

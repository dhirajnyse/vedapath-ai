import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const finalBadge = "v4.3.5 readiness";

const pages = [
  {
    version: "v4.3.1",
    badge: "v4.3.1 feedback",
    short: "feedback intake",
    label: "Feedback",
    href: "pilotfeedbackintake.html",
    bodyClass: "pilot-feedback-intake-page",
    title: "Pilot Feedback Intake",
    eyebrow: "Pilot feedback intake",
    hero: "Receive pilot comments without turning people into profiles.",
    deck: "Private pilot feedback should become reviewable product evidence, not hidden telemetry. This room captures one comment, one lane, one boundary, and one visible next action.",
    dataFile: "data/vedapath-pilot-feedback-intake.json",
    data: {
      title: "Pilot Feedback Intake",
      headline: "Let feedback arrive as a review ticket.",
      copy: "This room turns private pilot comments into local, reviewable feedback packets. It separates UX confusion, source concern, answer restraint, privacy worry, and launch blocker without storing identity or spiritual state.",
      boundary: "Feedback records stay browser-local in this prototype. They are product review notes, not user profiles, therapy records, analytics, or accepted source truth.",
      readyLabel: "Ready for feedback review",
      storageKey: "vedapathPilotFeedbackIntakeV431",
      metrics: [
        { label: "Lanes", value: "5" },
        { label: "Storage", value: "Local" },
        { label: "Identity", value: "Off" },
        { label: "Review", value: "Required" }
      ],
      lanes: [
        { id: "ux", title: "UX confusion", summary: "A user could not find the next clear step or felt the screen asked too much.", decision: "Route to design", signals: ["Navigation unclear", "Too many rooms shown", "Button label unclear"] },
        { id: "source", title: "Source concern", summary: "A citation, source family, or passage context needs review before trust increases.", decision: "Route to source review", signals: ["Citation missing", "Family label unclear", "Translation posture unclear"] },
        { id: "answer", title: "Answer restraint", summary: "The answer feels overconfident, too broad, or not careful enough for pilot display.", decision: "Route to answer review", signals: ["Boundary missing", "Confidence not visible", "Claim too strong"] },
        { id: "privacy", title: "Privacy worry", summary: "The user needs clearer control over what is saved, copied, exported, or deleted.", decision: "Route to privacy review", signals: ["Memory unclear", "Consent copy weak", "Delete path hidden"] },
        { id: "launch", title: "Launch blocker", summary: "Something would prevent a calm private pilot session from starting safely.", decision: "Route to founder", signals: ["First session stuck", "Safety claim risk", "Pilot promise unclear"] }
      ],
      checklist: [
        "Feedback is about the product surface, not the person.",
        "No sensitive personal detail is needed.",
        "The lane has a clear owner.",
        "The next action is visible.",
        "The note can be deleted locally."
      ],
      steps: ["Pick the feedback lane.", "Write one product note.", "Keep identity out.", "Copy or save for review."],
      defaultNote: "Pilot feedback: the user found the source card helpful but needs a clearer next action after reading it."
    },
    doc: "PILOT_FEEDBACK_INTAKE.md",
    docTitle: "Pilot Feedback Intake",
    docLines: [
      "Purpose: turn private pilot comments into reviewable product tickets.",
      "The intake separates UX, source, answer, privacy, and launch feedback.",
      "Prototype feedback remains local and does not become profile data or accepted source truth."
    ],
    changelog: "Adds a private pilot feedback intake room so comments become bounded review tickets instead of hidden telemetry."
  },
  {
    version: "v4.3.2",
    badge: "v4.3.2 desk",
    short: "feedback desk",
    label: "Feedback Desk",
    href: "feedbackreviewdesk.html",
    bodyClass: "feedback-review-desk-page",
    title: "Feedback Review Desk",
    eyebrow: "Feedback review desk",
    hero: "Triage feedback before it changes product behavior.",
    deck: "A calm product learns through review. This room turns feedback tickets into decisions: accept, revise, hold, discard, or escalate.",
    dataFile: "data/vedapath-feedback-review-desk.json",
    data: {
      title: "Feedback Review Desk",
      headline: "Review feedback before the product learns.",
      copy: "This desk gives VedaPath a founder-facing feedback review workflow. Each ticket gets a lane, decision, risk, and next action before it affects UI copy, source records, answer patterns, or launch readiness.",
      boundary: "This desk is a prototype review surface. It does not modify source data, user accounts, production analytics, or public release status.",
      readyLabel: "Ready for founder decision",
      storageKey: "vedapathFeedbackReviewDeskV432",
      metrics: [
        { label: "Decisions", value: "5" },
        { label: "Open samples", value: "4" },
        { label: "Auto apply", value: "Off" },
        { label: "Owner", value: "Founder" }
      ],
      lanes: [
        { id: "accept", title: "Accept", summary: "Feedback is specific, low risk, and improves clarity without changing source truth.", decision: "Add to backlog", signals: ["Simpler button label", "Clearer first-session copy", "Better empty state"] },
        { id: "revise", title: "Revise", summary: "Feedback points to a real issue but needs cleaner wording or a smaller product move.", decision: "Rewrite", signals: ["Too much feature request", "Mixed source and UX concern", "Needs smaller change"] },
        { id: "hold", title: "Hold", summary: "Feedback may be valid but needs more evidence, reviewer input, or rights clarity.", decision: "Wait", signals: ["One-off confusion", "Source interpretation concern", "Rights not known"] },
        { id: "discard", title: "Discard", summary: "Feedback would make the product less truthful, less safe, or less source-first.", decision: "Do not apply", signals: ["Remove boundary request", "Make stronger claim", "Hide source label"] },
        { id: "escalate", title: "Escalate", summary: "Feedback involves safety, privacy, identity, or a possible source-category error.", decision: "Founder review", signals: ["Sensitive note", "Potentially harmful advice", "Category confusion"] }
      ],
      checklist: [
        "Ticket has a feedback lane.",
        "Risk and owner are visible.",
        "Decision does not silently change source data.",
        "Accepted work has a small next action.",
        "Discarded work keeps the reason visible."
      ],
      steps: ["Open ticket.", "Classify risk.", "Choose decision.", "Write next action.", "Keep audit note."],
      defaultNote: "Review decision: revise the copy, keep the boundary visible, and do not change answer data until source review confirms it."
    },
    doc: "FEEDBACK_REVIEW_DESK.md",
    docTitle: "Feedback Review Desk",
    docLines: [
      "Purpose: triage pilot feedback before it affects product behavior.",
      "Decision lanes: accept, revise, hold, discard, escalate.",
      "No feedback auto-applies to source data, answers, or production launch state."
    ],
    changelog: "Adds a feedback review desk with explicit accept/revise/hold/discard/escalate decisions."
  },
  {
    version: "v4.3.3",
    badge: "v4.3.3 session",
    short: "session script",
    label: "Session Script",
    href: "pilotusersessionscript.html",
    bodyClass: "pilot-user-session-script-page",
    title: "Pilot User Session Script",
    eyebrow: "Pilot session script",
    hero: "Guide the first pilot session without overwhelming the learner.",
    deck: "The first pilot session should feel like a calm doorway: ask one question, read one source, choose one action, and tell us what helped.",
    dataFile: "data/vedapath-pilot-user-session-script.json",
    data: {
      title: "Pilot User Session Script",
      headline: "Run one complete pilot session.",
      copy: "This script gives a founder or tester a simple live session path. It keeps the product centered on one user question, one source card, one practice action, and one visible feedback moment.",
      boundary: "This script guides product testing only. It is not teaching authority, ritual instruction, therapy, or spiritual certification.",
      readyLabel: "Ready for pilot session",
      storageKey: "vedapathPilotUserSessionScriptV433",
      metrics: [
        { label: "Duration", value: "12 min" },
        { label: "Loops", value: "1" },
        { label: "Questions", value: "1" },
        { label: "Feedback", value: "1 note" }
      ],
      lanes: [
        { id: "welcome", title: "Welcome", summary: "Set expectation: source-first, calm, prototype, no guru voice.", decision: "Start gently", signals: ["No account needed", "Local storage explained", "Boundary visible"] },
        { id: "ask", title: "Ask", summary: "Let the user type or choose one question and notice whether it feels easy.", decision: "Observe", signals: ["Question box clear", "Sample prompts help", "No pressure to be expert"] },
        { id: "source", title: "Read", summary: "Open the answer card and watch whether citation, family, and caution are understood.", decision: "Observe trust", signals: ["Citation found", "Source family understood", "Boundary not skipped"] },
        { id: "carry", title: "Carry", summary: "Ask the user to choose one small action without turning the product into authority.", decision: "Observe agency", signals: ["Action feels modest", "No guaranteed outcome", "User keeps choice"] },
        { id: "feedback", title: "Feedback", summary: "Ask one final question: what felt calming, confusing, or untrustworthy?", decision: "Save note", signals: ["One honest note", "No personal details required", "Review lane chosen"] }
      ],
      checklist: [
        "Session starts with product boundary.",
        "User completes only one loop.",
        "Source card is inspected before practice.",
        "Feedback asks about product clarity.",
        "No identity or sensitive personal data is requested."
      ],
      steps: ["Welcome.", "Ask.", "Read source.", "Carry one action.", "Collect one feedback note."],
      defaultNote: "Pilot observation: user understood the source label but needed a clearer reason to trust the confidence score."
    },
    doc: "PILOT_USER_SESSION_SCRIPT.md",
    docTitle: "Pilot User Session Script",
    docLines: [
      "Purpose: give founders and testers a repeatable first-session path.",
      "The session tests one loop: ask, read, carry, feedback.",
      "The script is product testing support, not spiritual or therapeutic instruction."
    ],
    changelog: "Adds a guided pilot session script so the first private pilot test has one calm, repeatable path."
  },
  {
    version: "v4.3.4",
    badge: "v4.3.4 safety",
    short: "safety checklist",
    label: "Safety",
    href: "launchsafetychecklist.html",
    bodyClass: "launch-safety-checklist-page",
    title: "Launch Safety Checklist",
    eyebrow: "Launch safety checklist",
    hero: "Make the private pilot safe by keeping risky paths closed.",
    deck: "Before invite links go out, VedaPath needs visible safety posture: what is on, what is off, what is local, and what requires founder review.",
    dataFile: "data/vedapath-launch-safety-checklist.json",
    data: {
      title: "Launch Safety Checklist",
      headline: "Know what is open before launch.",
      copy: "This checklist makes the private-pilot safety posture explicit. It protects the calm product promise by keeping production, payment, hidden telemetry, medical advice, ritual authority, and source mutation closed.",
      boundary: "Safety readiness is a pre-launch control surface. It does not grant production authorization, legal clearance, medical safety approval, or public release.",
      readyLabel: "Safety posture visible",
      storageKey: "vedapathLaunchSafetyChecklistV434",
      metrics: [
        { label: "Controls", value: "8" },
        { label: "Public launch", value: "Off" },
        { label: "Payment", value: "Off" },
        { label: "Review", value: "On" }
      ],
      lanes: [
        { id: "on", title: "Allowed on", summary: "Static prototype pages, source cards, local practice memory, and visible copy packets.", decision: "Pilot allowed", signals: ["GitHub Pages prototype", "Local save/clear", "Copy packets"] },
        { id: "off", title: "Must stay off", summary: "Production AI writes, hidden telemetry, accounts, payment, and public claims.", decision: "Keep closed", signals: ["No API key", "No payment", "No profile"] },
        { id: "review", title: "Review required", summary: "Source corrections, answer promotion, feedback acceptance, and readiness decisions.", decision: "Founder review", signals: ["Feedback desk", "Answer gate", "Source triage"] },
        { id: "blocked", title: "Blocked content", summary: "Medical, emergency, ritual authority, guaranteed calm, or modern-science proof claims.", decision: "Block", signals: ["Diagnosis request", "Guaranteed outcome", "Inflated claim"] }
      ],
      checklist: [
        "Prototype boundary is visible.",
        "Hidden telemetry is off.",
        "Account and payment paths are off.",
        "Source records do not mutate automatically.",
        "Feedback requires review before learning.",
        "Medical, emergency, and ritual authority boundaries are visible.",
        "Local data can be cleared.",
        "Founder go or hold decision is explicit."
      ],
      steps: ["Review what is on.", "Confirm what is off.", "Check boundaries.", "Choose go or hold."],
      defaultNote: "Safety note: private pilot may continue only if hidden telemetry, payment, production AI, and source mutation remain disabled."
    },
    doc: "LAUNCH_SAFETY_CHECKLIST.md",
    docTitle: "Launch Safety Checklist",
    docLines: [
      "Purpose: make private pilot safety posture explicit.",
      "The checklist separates allowed prototype behavior from closed production behavior.",
      "This page does not authorize public release, payment, production AI, or source mutation."
    ],
    changelog: "Adds a launch safety checklist that makes on/off controls visible before private pilot invites."
  },
  {
    version: "v4.3.5",
    badge: "v4.3.5 readiness",
    short: "readiness score",
    label: "Readiness Score",
    href: "privatepilotreadinessscore.html",
    bodyClass: "private-pilot-readiness-score-page",
    title: "Private Pilot Readiness Score",
    eyebrow: "Private pilot readiness score",
    hero: "See whether the pilot is ready without pretending launch is automatic.",
    deck: "This readiness view combines the launch chain into one founder surface: source, answer, consent, feedback, session, safety, and go or hold posture.",
    dataFile: "data/vedapath-private-pilot-readiness-score.json",
    data: {
      title: "Private Pilot Readiness Score",
      headline: "Readiness is a gate, not a celebration.",
      copy: "This score gathers the private-pilot readiness chain into one calm founder view. It shows which areas are ready, which are still review candidates, and which must remain closed before launch.",
      boundary: "This score is a prototype readiness view. It does not certify production readiness, legal compliance, medical safety, scholarship, or public release.",
      readyLabel: "Founder review ready",
      storageKey: "vedapathPrivatePilotReadinessScoreV435",
      metrics: [
        { label: "Readiness", value: "82/100" },
        { label: "Ready gates", value: "6" },
        { label: "Review gates", value: "2" },
        { label: "Closed paths", value: "6" }
      ],
      lanes: [
        { id: "source", title: "Source readiness", summary: "Core passages have source family, citation, boundary, and review posture.", decision: "Mostly ready", signals: ["Source triage exists", "Rights posture visible", "Source QA continues"] },
        { id: "answer", title: "Answer readiness", summary: "Answer cards show citation, confidence, plain meaning, and no-overclaim boundary.", decision: "Ready with caution", signals: ["Answer gate exists", "Pramana meter visible", "Boundary retained"] },
        { id: "feedback", title: "Feedback readiness", summary: "Pilot comments can be captured, reviewed, and rejected without hidden learning.", decision: "Review ready", signals: ["Feedback intake", "Feedback desk", "Audit note"] },
        { id: "session", title: "Session readiness", summary: "Founder can guide one complete first session without exposing the whole product map.", decision: "Ready to test", signals: ["Session script", "One guided loop", "Local feedback note"] },
        { id: "safety", title: "Safety readiness", summary: "Closed paths remain closed and pilot boundaries are visible.", decision: "Hold if changed", signals: ["Production off", "Payment off", "Hidden telemetry off"] }
      ],
      checklist: [
        "Source, answer, feedback, session, and safety rooms are visible.",
        "Private pilot can run one guided loop.",
        "Feedback has a review path.",
        "Closed production paths are still closed.",
        "Founder go or hold remains explicit."
      ],
      steps: ["Review source readiness.", "Review answer readiness.", "Review feedback path.", "Review session script.", "Review safety posture.", "Choose go or hold."],
      defaultNote: "Readiness score: private pilot is review-ready, but production, payment, hidden telemetry, and public launch stay closed."
    },
    doc: "PRIVATE_PILOT_READINESS_SCORE.md",
    docTitle: "Private Pilot Readiness Score",
    docLines: [
      "Purpose: summarize private pilot readiness without treating readiness as automatic launch permission.",
      "The score combines source, answer, feedback, session, and safety gates.",
      "Founder go or hold remains required before any pilot invite expansion."
    ],
    changelog: "Adds a private pilot readiness score that gathers the feedback, session, safety, source, and answer gates into one founder view."
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
  ["privatepilotlaunchconsole.html", "Launch Console"],
  ["pilotfeedbackintake.html", "Feedback"],
  ["feedbackreviewdesk.html", "Feedback Desk"],
  ["pilotusersessionscript.html", "Session Script"],
  ["launchsafetychecklist.html", "Safety"],
  ["privatepilotreadinessscore.html", "Readiness Score"]
];

function read(file) {
  return readFileSync(file, "utf8");
}

function write(file, text) {
  writeFileSync(file, text, "utf8");
}

function replaceRegex(text, regex, replacement, label) {
  if (!regex.test(text)) {
    throw new Error("Missing regex target: " + label);
  }
  return text.replace(regex, replacement);
}

function insertBefore(text, marker, addition, label) {
  if (text.includes(addition.trim())) return text;
  if (!text.includes(marker)) throw new Error("Missing insert marker: " + label);
  return text.replace(marker, addition + marker);
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
    const activeHref = file.replace(/\\/g, "/");
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
  if (!text.includes('"Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score"')) {
    text = text.replace(
      /(\{ title: "Pilot Launch", labels: \[[^\]]+\] \})/,
      '$1,\n    { title: "Pilot Review", labels: ["Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score"] }'
    );
  }
  const pageTitleAdditions = [
    '    "Feedback": "Pilot Feedback Intake"',
    '    "Feedback Desk": "Feedback Review Desk"',
    '    "Session Script": "Pilot User Session Script"',
    '    "Safety": "Launch Safety Checklist"',
    '    "Readiness Score": "Private Pilot Readiness Score"'
  ].join(",\n");
  if (!text.includes('"Feedback": "Pilot Feedback Intake"')) {
    text = text.replace(
      '    "Launch Console": "Private Pilot Launch Console"\n  };',
      '    "Launch Console": "Private Pilot Launch Console",\n' + pageTitleAdditions + "\n  };"
    );
  }
  const bodyTitleAdditions = [
    '    "pilot-feedback-intake-page": "Pilot Feedback Intake"',
    '    "feedback-review-desk-page": "Feedback Review Desk"',
    '    "pilot-user-session-script-page": "Pilot User Session Script"',
    '    "launch-safety-checklist-page": "Launch Safety Checklist"',
    '    "private-pilot-readiness-score-page": "Private Pilot Readiness Score"'
  ].join(",\n");
  if (!text.includes('"pilot-feedback-intake-page": "Pilot Feedback Intake"')) {
    text = text.replace(
      '    "private-pilot-launch-console-page": "Private Pilot Launch Console"\n  };',
      '    "private-pilot-launch-console-page": "Private Pilot Launch Console",\n' + bodyTitleAdditions + "\n  };"
    );
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const insert = pages.map(function (page) { return '  "' + page.href + '",'; }).join("\n");
  if (!text.includes('"pilotfeedbackintake.html"')) {
    text = text.replace('  "privatepilotlaunchconsole.html",', '  "privatepilotlaunchconsole.html",\n' + insert);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateIndex() {
  let text = read("index.html");
  const section = `
      <article class="rp-card rp-span">
        <span class="rp-eyebrow green">v4.3.5 private pilot readiness</span>
        <h2>Private pilot feedback path</h2>
        <p>The launch path now learns through visible feedback, review, session observation, safety controls, and a readiness score. Nothing learns silently.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Feedback</h3><p>Capture one bounded pilot comment without identity storage.</p><a class="rp-button green" href="pilotfeedbackintake.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Review Desk</h3><p>Accept, revise, hold, discard, or escalate feedback before learning.</p><a class="rp-button green" href="feedbackreviewdesk.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Session</h3><p>Run one first-session path: ask, read, carry, feedback.</p><a class="rp-button green" href="pilotusersessionscript.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Safety</h3><p>Confirm what is on, off, blocked, and review-required.</p><a class="rp-button green" href="launchsafetychecklist.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Score</h3><p>Read the private pilot gate without treating launch as automatic.</p><a class="rp-button green" href="privatepilotreadinessscore.html">Open</a></article>
        </div>
      </article>
  `;
  if (!text.includes("Private pilot feedback path")) {
    text = text.replace("      <!-- V426-V430 HOME STRIP END -->", "      <!-- V426-V430 HOME STRIP END -->\n" + section);
    if (!text.includes("Private pilot feedback path")) {
      throw new Error("Missing insert marker: home release strip");
    }
  }
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/g, '<span class="version-pill">' + finalBadge + "</span>");
  write("index.html", text);
}

function roadmapItem(phase, page, status) {
  return `            <article class="phase">
              <span class="badge ${status === "done" ? "done" : "active"}">${status === "done" ? "Done" : "Active"}</span>
            <div>
              <strong>Phase ${phase}: ${page.title}</strong>
              <p>${page.changelog}</p>
            </div>
              <div class="percent">100%</div>
          </article>
`;
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/g, '<span class="version-pill">' + finalBadge + "</span>");
  text = text.replace(/<strong>v4\.3\.0<\/strong>/, "<strong>v4.3.5</strong>");
  text = text.replace(/Private Pilot Launch Console completes[^<]+<\/p>/, "Private Pilot Readiness Score completes the feedback, session, safety, source, and answer readiness chain for founder review.</p>");
  text = text.replace(/private-pilot launch chain\./g, "private-pilot feedback and readiness chain.");
  text = text.replace(/before private pilot launch\./g, "before private pilot launch and feedback learning.");
  text = text.replace(/<strong>v4\.3\.1 Pilot Feedback Intake<\/strong>\s*<p>Turn private pilot comments into reviewable product feedback without hidden profile storage\.<\/p>/, '<strong>v4.3.6 Pilot Invite Review</strong>\n          <p>Turn the readiness score into a final small invite review before any new tester is added.</p>');
  text = text.replace(/<strong>v4\.3\.0 Private Pilot Launch Console<\/strong>/g, "<strong>v4.3.5 Private Pilot Readiness Score</strong>");
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, '<div class="version-row"><span>Previous</span><strong>v4.3.4 Launch Safety Checklist</strong></div>');
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, '<div class="version-row"><span>Goal</span><strong>Make private pilot readiness visible across feedback, session, safety, source, and answer gates.</strong></div>');
  text = text.replace(/Ready for founder private pilot launch review/g, "Ready for founder private pilot readiness review");
  text = text.replace(/Make the private pilot go or hold decision visible while production, payment, and hidden telemetry stay off\./g, "Make private pilot readiness visible across feedback, session, safety, source, and answer gates.");
  if (!text.includes("Phase 395: Private Pilot Readiness Score")) {
    const additions = pages.map(function (page, index) {
      return roadmapItem(391 + index, page, index === pages.length - 1 ? "active" : "done");
    }).join("");
    text = insertBefore(text, "            <!-- V410-V414 PHASES END -->", additions, "roadmap close");
  }
  text = text.replace(
    /<ul class="checklist">[\s\S]*?<\/ul>/,
    `<ul class="checklist">
            <li><span class="dot"></span><span>Review the readiness score with one real private pilot session.</span></li>
            <li><span class="dot"></span><span>Keep feedback, source, answer, and safety decisions reviewable.</span></li>
            <li><span class="dot"></span><span>Do not add public launch, payment, hidden telemetry, or production AI yet.</span></li>
          </ul>`
  );
  write("build-status.html", text);
}

function updateDocs() {
  const entries = pages.map(function (page) {
    return `## ${page.version} ${page.title}

- Changes made: ${page.changelog}
- Files changed: \`${page.href}\`, \`${page.dataFile}\`, \`docs/${page.doc}\`, \`assets/vedapath-command-shell.js\`, \`scripts/check-static-links.mjs\`, \`index.html\`, and \`build-status.html\`.
- Checks run: \`node --check assets/vedapath-pilot-readiness.js\`, \`node --check assets/vedapath-command-shell.js\`, \`node --check scripts/apply-v431-v435-private-pilot-feedback-batch.mjs\`, \`node scripts/check-static-links.mjs\`, and JSON parse for private pilot readiness data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.
`;
  }).join("\n");
  const changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.3.5 Private Pilot Readiness Score")) {
    write("CHANGELOG.md", entries + "\n" + changelog);
  }
  const readme = read("README.md");
  if (!readme.includes("## v4.3.5 Private Pilot Readiness Score")) {
    write("README.md", entries + "\n" + readme);
  }
}

function check(label) {
  execFileSync(process.execPath, ["--check", "assets/vedapath-pilot-readiness.js"], { stdio: "pipe" });
  execFileSync(process.execPath, ["--check", "assets/vedapath-command-shell.js"], { stdio: "pipe" });
  execFileSync(process.execPath, ["--check", "scripts/apply-v431-v435-private-pilot-feedback-batch.mjs"], { stdio: "pipe" });
  execFileSync(process.execPath, ["scripts/check-static-links.mjs"], { stdio: "pipe" });
  for (const page of pages) {
    JSON.parse(read(page.dataFile));
  }
  console.log(label + " checks ok");
}

function run() {
  createPagesAndData();
  updateNavs();
  updateCommandShell();
  updateStaticLinks();
  updateIndex();
  updateBuildStatus();
  updateDocs();
  for (const page of pages) {
    check(page.version);
  }
}

run();

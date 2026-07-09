import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.4.0 retrieval shell";
const checkCommand = "`node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v436-v440-pilot-launch-governance-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse checks for the new launch-governance data";
const staticRisk = "Static prototype only; local storage and copy packets prove the pilot workflow shape but do not provide production identity, source licensing, durable audit storage, live AI retrieval, or public launch authority.";

const baseNav = [
  ["Home", "index.html"],
  ["Build", "build-status.html"],
  ["Brand", "brand/brand-board.html"],
  ["Blueprint", "blueprint.html"],
  ["Answers", "citedanswerlab.html"],
  ["Review", "reviewqueuepersistence.html"],
  ["Mantra", "mantralenslab.html"],
  ["Life", "lifecompanionlab.html"],
  ["Talk", "conversationcompanionlab.html"],
  ["Pattern", "patterncompanionlab.html"],
  ["Daily", "daily.html"],
  ["Packet", "answerpacketpilot.html"],
  ["Launch", "launchreadinesshub.html"],
  ["Pilot", "productionretrievalpilotgate.html"],
  ["Records", "verifiedsourcerecordschema.html"],
  ["Desk", "retrievalreviewerdesk.html"],
  ["QA Pack", "first25sourceqapack.html"],
  ["Ask Flow", "learneraskflow.html"],
  ["Links", "citationdeeplinklayer.html"],
  ["Rights", "sourceeditionrightsmatrix.html"],
  ["History", "reviewerdecisionhistory.html"],
  ["Score", "retrievalscoringexplanation.html"],
  ["Waitlist", "publicpilotwaitlistgate.html"],
  ["Edition", "sourceeditionintake.html"],
  ["Rights Desk", "rightsreviewdesk.html"],
  ["Identity", "revieweridentitylite.html"],
  ["Promote", "answerpromotionrules.html"],
  ["Invite", "pilotinvitepacket.html"],
  ["Telemetry", "pilottelemetryconsent.html"],
  ["Signals", "pilotlearningsignalreview.html"],
  ["First Session", "firstsessionlaunchspine.html"],
  ["Source Triage", "sourcereadinesstriage.html"],
  ["Answer Gate", "answerreadinessgate.html"],
  ["Launch Console", "privatepilotlaunchconsole.html"],
  ["Feedback", "pilotfeedbackintake.html"],
  ["Feedback Desk", "feedbackreviewdesk.html"],
  ["Session Script", "pilotusersessionscript.html"],
  ["Safety", "launchsafetychecklist.html"],
  ["Readiness Score", "privatepilotreadinessscore.html"],
  ["Invite Review", "pilotinvitereview.html"],
  ["Rights Board", "sourcerightsapprovalboard.html"],
  ["Session Export", "pilotsessionexportpacket.html"],
  ["Feedback Audit", "feedbacktoticketaudittrail.html"],
  ["Retrieval Adapter", "retrievaladaptershell.html"]
];

const versions = [
  {
    version: "v4.3.6",
    badge: "v4.3.6 invite review",
    label: "Invite Review",
    href: "pilotinvitereview.html",
    pageClass: "pilot-invite-review-page",
    pageTitle: "Pilot Invite Review",
    small: "invite review",
    docFile: "docs/PILOT_INVITE_REVIEW.md",
    dataFile: "data/vedapath-pilot-invite-review.json",
    changes: "Adds a final invite review room so each private pilot invitation has purpose, boundary, consent posture, and hold reasons before a person is added.",
    headline: "Review one invitation before one more tester enters.",
    copy: "This room keeps the pilot small and honest: who is invited, why now, what they are not promised, and what must be reviewed before the invite is sent.",
    boundary: "Invitation review only. No email sending, account creation, payment, analytics, or production access is enabled.",
    readyLabel: "Invite can be prepared for founder review",
    defaultNote: "Invite only one learner after source, consent, feedback, and safety posture are visible.",
    metrics: [
      { label: "Pilot size", value: "small" },
      { label: "Consent", value: "explicit" },
      { label: "Promise", value: "bounded" },
      { label: "Access", value: "manual" }
    ],
    lanes: [
      {
        id: "fit",
        title: "Learner fit",
        summary: "Confirm the person understands this is a source-first prototype, not a spiritual authority or therapy product.",
        decision: "Ready to invite",
        signals: ["Curious learner", "Accepts boundaries", "Can give specific feedback"]
      },
      {
        id: "message",
        title: "Invite message",
        summary: "Use calm language that names the session length, the prototype nature, and the absence of account or payment promises.",
        decision: "Needs wording review",
        signals: ["No hype", "No launch claim", "No hidden telemetry"]
      },
      {
        id: "hold",
        title: "Hold reason",
        summary: "Pause the invite when the user expects advice, authority, ritual instruction, or emergency support.",
        decision: "Hold if unclear",
        signals: ["Medical need", "Ritual authority expectation", "Source rights unclear"]
      }
    ],
    checklist: [
      "Invite says prototype clearly.",
      "No therapy, ritual, guru, or emergency support claim appears.",
      "Feedback route is visible before session begins.",
      "Consent and local-memory boundary are named.",
      "Founder can hold the invite without changing product data."
    ],
    steps: [
      "Choose one learner.",
      "Read the invite boundary.",
      "Confirm consent and feedback path.",
      "Send only after founder review."
    ]
  },
  {
    version: "v4.3.7",
    badge: "v4.3.7 rights board",
    label: "Rights Board",
    href: "sourcerightsapprovalboard.html",
    pageClass: "source-rights-approval-board-page",
    pageTitle: "Source Rights Approval Board",
    small: "rights approval",
    docFile: "docs/SOURCE_RIGHTS_APPROVAL_BOARD.md",
    dataFile: "data/vedapath-source-rights-approval-board.json",
    changes: "Adds a rights approval board that separates public-domain, cited-only, excerpt-only, review-needed, and blocked source use before pilot answers expand.",
    headline: "Approve source use before answers grow.",
    copy: "This board turns source rights into a visible go or hold decision so the product does not treat citation as permission.",
    boundary: "Rights review support only. It does not provide legal advice, licensing, permission grants, or production source approval.",
    readyLabel: "Rights posture can enter founder review",
    defaultNote: "Use short cited excerpts only until edition, translator, and rights posture are reviewed.",
    metrics: [
      { label: "Use lanes", value: "5" },
      { label: "Blocked", value: "visible" },
      { label: "Review", value: "required" },
      { label: "Grant", value: "none" }
    ],
    lanes: [
      {
        id: "public-domain",
        title: "Public-domain lane",
        summary: "Source metadata appears usable, but edition and translation still need citation and provenance.",
        decision: "Review source record",
        signals: ["Edition named", "Translator clear", "Source family present"]
      },
      {
        id: "excerpt-only",
        title: "Excerpt-only lane",
        summary: "Use short cited passages and keep full translations, commentary, and derivative text out of public answers.",
        decision: "Limit answer surface",
        signals: ["Short passage", "Citation visible", "No wholesale reproduction"]
      },
      {
        id: "blocked",
        title: "Blocked lane",
        summary: "If rights, edition, or provenance are missing, the source can inform a review ticket but not a learner-facing answer.",
        decision: "Do not publish",
        signals: ["Unknown rights", "Missing edition", "No reviewer"]
      }
    ],
    checklist: [
      "Every source has family, edition, translator, and citation fields.",
      "Allowed use is separate from scholarly usefulness.",
      "Blocked sources cannot appear in answer cards.",
      "Excerpt-only limits are visible to reviewers.",
      "Founder review is required before any public pilot expansion."
    ],
    steps: [
      "Name the source family.",
      "Check edition and rights posture.",
      "Choose allowed use lane.",
      "Hold uncertain records."
    ]
  },
  {
    version: "v4.3.8",
    badge: "v4.3.8 session export",
    label: "Session Export",
    href: "pilotsessionexportpacket.html",
    pageClass: "pilot-session-export-packet-page",
    pageTitle: "Pilot Session Export Packet",
    small: "session export",
    docFile: "docs/PILOT_SESSION_EXPORT_PACKET.md",
    dataFile: "data/vedapath-pilot-session-export-packet.json",
    changes: "Adds a pilot session export packet so a completed session can become one copyable, reviewable artifact without hidden analytics.",
    headline: "Turn one session into one review packet.",
    copy: "The export packet captures what happened, what source was used, what the learner felt, and what should become a review ticket.",
    boundary: "Manual export only. No automatic tracking, identity storage, analytics, sync, or production session archive is enabled.",
    readyLabel: "Session packet ready for review queue",
    defaultNote: "Export only what the pilot participant agreed to share.",
    metrics: [
      { label: "Identity", value: "none" },
      { label: "Export", value: "manual" },
      { label: "Consent", value: "visible" },
      { label: "Queue", value: "review" }
    ],
    lanes: [
      {
        id: "session-summary",
        title: "Session summary",
        summary: "Capture the ask, source card, answer boundary, calm action, and visible friction in one compact packet.",
        decision: "Export candidate",
        signals: ["Question", "Source", "Boundary", "Carry action"]
      },
      {
        id: "consent-trim",
        title: "Consent trim",
        summary: "Remove names, private details, and anything outside the participant's consent before review.",
        decision: "Trim before share",
        signals: ["No private identity", "No hidden telemetry", "No sensitive life detail"]
      },
      {
        id: "ticket-route",
        title: "Ticket route",
        summary: "Route useful observations into source gap, UX friction, answer boundary, or calm-path improvement queues.",
        decision: "Create review ticket",
        signals: ["Source gap", "Confusing wording", "Boundary issue", "Helpful calm action"]
      }
    ],
    checklist: [
      "Participant consent is named before export.",
      "Private identity and sensitive details are removed.",
      "Question and source card are included.",
      "Boundary and no-authority language are preserved.",
      "Packet has a clear review queue destination."
    ],
    steps: [
      "Summarize the session.",
      "Trim private details.",
      "Choose the review route.",
      "Copy the packet."
    ]
  },
  {
    version: "v4.3.9",
    badge: "v4.3.9 feedback audit",
    label: "Feedback Audit",
    href: "feedbacktoticketaudittrail.html",
    pageClass: "feedback-to-ticket-audit-trail-page",
    pageTitle: "Feedback-to-Ticket Audit Trail",
    small: "feedback audit",
    docFile: "docs/FEEDBACK_TO_TICKET_AUDIT_TRAIL.md",
    dataFile: "data/vedapath-feedback-to-ticket-audit-trail.json",
    changes: "Adds a feedback-to-ticket audit trail so pilot feedback can show source, owner, decision, and reason before it changes product behavior.",
    headline: "Feedback should become a trace, not a silent change.",
    copy: "This audit trail makes each feedback item travel through ticket, owner, decision, source impact, and release note before it can affect the product.",
    boundary: "Audit prototype only. No server queue, reviewer account, immutable log, or production source update is created.",
    readyLabel: "Audit packet can enter review",
    defaultNote: "Every accepted feedback item needs a reason and a source or UX lane.",
    metrics: [
      { label: "Trace", value: "visible" },
      { label: "Owner", value: "named" },
      { label: "Decision", value: "required" },
      { label: "Writes", value: "zero" }
    ],
    lanes: [
      {
        id: "ticket-created",
        title: "Ticket created",
        summary: "Convert raw pilot feedback into a bounded ticket with question, page, source family, and risk.",
        decision: "Ticket ready",
        signals: ["Question", "Surface", "Source family", "Risk"]
      },
      {
        id: "review-decision",
        title: "Review decision",
        summary: "Accept, revise, hold, discard, or escalate feedback with a reason that can be shown later.",
        decision: "Decision needed",
        signals: ["Reason", "Owner", "Reviewer role", "Release note"]
      },
      {
        id: "change-control",
        title: "Change control",
        summary: "If feedback changes answers or sources, it must pass source rights, answer gate, and founder review.",
        decision: "No silent change",
        signals: ["Rights board", "Answer gate", "Founder note"]
      }
    ],
    checklist: [
      "Raw feedback has a bounded ticket.",
      "Owner and reviewer role are visible.",
      "Decision reason is recorded.",
      "Source or answer changes require extra gates.",
      "Release note explains what changed."
    ],
    steps: [
      "Create ticket.",
      "Assign owner.",
      "Record decision.",
      "Hold changes until gated."
    ]
  },
  {
    version: "v4.4.0",
    badge: "v4.4.0 retrieval shell",
    label: "Retrieval Adapter",
    href: "retrievaladaptershell.html",
    pageClass: "retrieval-adapter-shell-page",
    pageTitle: "First Real Retrieval Adapter Shell",
    small: "retrieval shell",
    docFile: "docs/RETRIEVAL_ADAPTER_SHELL.md",
    dataFile: "data/vedapath-retrieval-adapter-shell.json",
    changes: "Adds the first real retrieval adapter shell: a bounded contract for fixture source input, citation output, no-answer behavior, and review gating before live AI retrieval.",
    headline: "Connect retrieval carefully before it speaks.",
    copy: "The adapter shell defines what retrieval may read, what it must return, and when it must refuse instead of composing an answer.",
    boundary: "Adapter shell only. No live model, network retrieval, vector database, production storage, or automatic answer generation is enabled.",
    readyLabel: "Adapter contract ready for fixture implementation",
    defaultNote: "Start with fixture JSON and return source ids, citations, reasons, confidence, and boundary flags before any answer text.",
    metrics: [
      { label: "Input", value: "fixture" },
      { label: "Output", value: "source ids" },
      { label: "No answer", value: "first-class" },
      { label: "Live AI", value: "off" }
    ],
    lanes: [
      {
        id: "fixture-input",
        title: "Fixture input",
        summary: "Read from curated JSON records only, with source family, citation, allowed use, review state, and rights posture.",
        decision: "Implement fixture adapter",
        signals: ["Local JSON", "Reviewed records", "Allowed use", "No network"]
      },
      {
        id: "citation-output",
        title: "Citation output",
        summary: "Return candidate source ids, citation strings, confidence, match reason, and boundary flags before answer composition.",
        decision: "Return evidence first",
        signals: ["Source id", "Citation", "Reason", "Boundary"]
      },
      {
        id: "no-answer",
        title: "No-answer path",
        summary: "If no reviewed source matches, the adapter must return a no-source result rather than making a confident answer.",
        decision: "Refuse gracefully",
        signals: ["No source", "Low confidence", "Rights hold", "Reviewer needed"]
      }
    ],
    checklist: [
      "Adapter reads only fixture data.",
      "Returned candidates include citation and source id.",
      "No-source result is explicit and user-safe.",
      "Rights and review state can block a candidate.",
      "Answer composition remains disabled until founder approval."
    ],
    steps: [
      "Read source fixtures.",
      "Rank evidence candidates.",
      "Return citation packet.",
      "Refuse when no source is safe."
    ]
  }
];

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return readFileSync(filePath(file), "utf8");
}

function write(file, content) {
  writeFileSync(filePath(file), content, "utf8");
}

function replaceAllText(text, search, replacement) {
  return text.split(search).join(replacement);
}

function insertAfterOnce(text, anchor, addition) {
  if (text.includes(addition.trim())) return text;
  if (!text.includes(anchor)) throw new Error(`Missing anchor: ${anchor.slice(0, 80)}`);
  return text.replace(anchor, anchor + addition);
}

function navHtml(activeLabel) {
  const links = baseNav.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
    return `        <a class="link${active}" href="${href}">${label}</a>`;
  }).join("\n");
  return `${links}\n        <span class="version-pill">${finalBadge}</span>`;
}

function newNavLinksBlock() {
  return [
    '        <a class="link" href="pilotinvitereview.html">Invite Review</a>',
    '        <a class="link" href="sourcerightsapprovalboard.html">Rights Board</a>',
    '        <a class="link" href="pilotsessionexportpacket.html">Session Export</a>',
    '        <a class="link" href="feedbacktoticketaudittrail.html">Feedback Audit</a>',
    '        <a class="link" href="retrievaladaptershell.html">Retrieval Adapter</a>'
  ].join("\n") + "\n";
}

function pageHtml(item) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${item.pageTitle} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-pilot-readiness.css" />
</head>
<body class="${item.pageClass} pilot-readiness-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${item.small}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
${navHtml(item.label)}
      </nav>
    </header>

    <section class="pr-hero">
      <div class="pr-hero-copy">
        <p class="pr-eyebrow">${item.badge}</p>
        <h1>${item.pageTitle}</h1>
        <p>${item.copy}</p>
      </div>
      <aside class="pr-hero-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>${item.headline}</strong>
        <span>Source first. Calm path.</span>
      </aside>
    </section>

    <section class="pr-app" data-pilot-readiness-app data-kind="launchRoom" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-pilot-readiness.js"></script>
</body>
</html>
`;
}

function docMarkdown(item) {
  return `# ${item.pageTitle}

## Product Purpose

${item.changes}

## User Promise

${item.headline}

## Boundary

${item.boundary}

## Data Contract

- Data file: \`${item.dataFile}\`
- Renderer: \`launchRoom\`
- Local memory key: \`${item.data.storageKey}\`
- Production writes: disabled

## Checks

- The page must load through the shared command shell.
- The launch room must expose lanes, checklist, local save, copy packet, and clear local controls.
- The boundary must stay visible in the side panel.
`;
}

function dataFor(item) {
  return {
    title: item.pageTitle,
    headline: item.headline,
    copy: item.copy,
    boundary: item.boundary,
    readyLabel: item.readyLabel,
    storageKey: `vedapath${item.label.replace(/[^a-z0-9]/gi, "")}`,
    metrics: item.metrics,
    lanes: item.lanes,
    checklist: item.checklist,
    steps: item.steps,
    defaultNote: item.defaultNote
  };
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${finalBadge}";`);
  const oldPilotReview = '{ title: "Pilot Review", labels: ["Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score"] }';
  const newPilotReview = '{ title: "Pilot Review", labels: ["Feedback", "Feedback Desk", "Session Script", "Safety", "Readiness Score", "Invite Review", "Rights Board", "Session Export", "Feedback Audit", "Retrieval Adapter"] }';
  text = text.replace(oldPilotReview, newPilotReview);
  text = insertAfterOnce(
    text,
    '    "Readiness Score": "Private Pilot Readiness Score"',
    ',\n    "Invite Review": "Pilot Invite Review",\n    "Rights Board": "Source Rights Approval Board",\n    "Session Export": "Pilot Session Export Packet",\n    "Feedback Audit": "Feedback-to-Ticket Audit Trail",\n    "Retrieval Adapter": "First Real Retrieval Adapter Shell"'
  );
  text = insertAfterOnce(
    text,
    '    "private-pilot-readiness-score-page": "Private Pilot Readiness Score"',
    ',\n    "pilot-invite-review-page": "Pilot Invite Review",\n    "source-rights-approval-board-page": "Source Rights Approval Board",\n    "pilot-session-export-packet-page": "Pilot Session Export Packet",\n    "feedback-to-ticket-audit-trail-page": "Feedback-to-Ticket Audit Trail",\n    "retrieval-adapter-shell-page": "First Real Retrieval Adapter Shell"'
  );
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const additions = versions.map((item) => `  "${item.href}"`).join(",\n");
  if (!text.includes('"retrievaladaptershell.html"')) {
    text = text.replace('  "sourceeditionintake.html"', `  "sourceeditionintake.html",\n${additions}`);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateRootNavs() {
  const pages = [
    "index.html",
    "build-status.html",
    "privatepilotreadinessscore.html",
    "pilotfeedbackintake.html",
    "feedbackreviewdesk.html",
    "pilotusersessionscript.html",
    "launchsafetychecklist.html",
    "privatepilotlaunchconsole.html",
    "answerreadinessgate.html",
    "sourcereadinesstriage.html",
    "firstsessionlaunchspine.html",
    "pilotlearningsignalreview.html",
    "pilottelemetryconsent.html",
    "pilotinvitepacket.html"
  ];
  for (const page of pages) {
    if (!existsSync(filePath(page))) continue;
    let text = read(page);
    if (!text.includes("pilotinvitereview.html") && text.includes("privatepilotreadinessscore.html")) {
      text = text.replace(/(        <a class="link(?: active)?" href="privatepilotreadinessscore\.html">Readiness Score<\/a>\r?\n)/, `$1${newNavLinksBlock()}`);
    }
    text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
    write(page, text);
  }
}

function updateIndex() {
  let text = read("index.html");
  if (!text.includes("V436-V440 HOME STRIP START")) {
    const strip = `

      <!-- V436-V440 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Pilot launch governance path">
        <span class="rp-eyebrow green">v4.4.0 pilot launch governance</span>
        <h2>Pilot launch governance path</h2>
        <p>The pilot now has a calmer bridge from readiness into launch: invite review, rights approval, session export, feedback audit, and a retrieval adapter shell before live AI.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Invite Review</h3><p>Review one invitation before one more tester enters.</p><a class="rp-button green" href="pilotinvitereview.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Rights Board</h3><p>Approve source use before answers grow.</p><a class="rp-button green" href="sourcerightsapprovalboard.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Session Export</h3><p>Turn one session into one review packet.</p><a class="rp-button green" href="pilotsessionexportpacket.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Feedback Audit</h3><p>Make feedback a trace, not a silent change.</p><a class="rp-button green" href="feedbacktoticketaudittrail.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Retrieval Adapter</h3><p>Connect retrieval carefully before it speaks.</p><a class="rp-button green" href="retrievaladaptershell.html">Open</a></article>
        </div>
      </article>
      <!-- V436-V440 HOME STRIP END -->
`;
    text = text.replace(/\n\s*<\/main>\s*\n\s*<script>/, `${strip}\n    </main>\n\n    <script>`);
  }
  text = replaceAllText(text, "v4.3.5 private pilot readiness", "v4.4.0 pilot launch governance");
  write("index.html", text);
}

function phaseHtml(number, title, description, active = false) {
  return `            <article class="phase">
              <span class="badge ${active ? "active" : "done"}">${active ? "Active" : "Done"}</span>
              <div>
                <strong>Phase ${number}: ${title}</strong>
                <p>${description}</p>
              </div>
              <div class="percent">100%</div>
            </article>
`;
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<strong>v4\.3\.5<\/strong>\s*<p>Private Pilot Readiness Score completes[^<]+<\/p>/, `<strong>v4.4.0</strong>
          <p>First Real Retrieval Adapter Shell completes the pilot launch governance bridge from invite review to bounded fixture retrieval.</p>`);
  text = text.replace(/<p>The clickable MVP now has a private-pilot readiness chain[^<]+<\/p>/, `<p>The clickable MVP now has a launch-governance chain for invite review, rights approval, session export, feedback audit, and retrieval adapter boundaries.</p>`);
  text = text.replace(/<p>The source layer now shows source readiness[^<]+<\/p>/, `<p>The source layer now adds rights approval and retrieval adapter boundaries before live AI or public pilot use.</p>`);
  text = text.replace(/<strong>v4\.3\.6 Pilot Invite Review<\/strong>\s*<p>Turn the readiness score[^<]+<\/p>/, `<strong>v4.4.1 Retrieval Fixture Adapter</strong>
          <p>Implement the first fixture adapter over curated source JSON while answer composition stays disabled.</p>`);
  text = text.replace(/<span class="badge active">Active<\/span>\s*\r?\n\s*<div>\s*\r?\n\s*<strong>Phase 395: Private Pilot Readiness Score<\/strong>/, `<span class="badge done">Done</span>
            <div>
              <strong>Phase 395: Private Pilot Readiness Score</strong>`);
  if (!text.includes("Phase 400: First Real Retrieval Adapter Shell")) {
    const phases = [
      phaseHtml(396, "Pilot Invite Review", "Reviews one bounded private-pilot invitation before one more tester is added."),
      phaseHtml(397, "Source Rights Approval Board", "Separates public-domain, cited-only, excerpt-only, review-needed, and blocked source-use lanes."),
      phaseHtml(398, "Pilot Session Export Packet", "Turns one consented pilot session into a copyable review packet without hidden analytics."),
      phaseHtml(399, "Feedback-to-Ticket Audit Trail", "Makes feedback travel through ticket, owner, decision, source impact, and release note before behavior changes."),
      phaseHtml(400, "First Real Retrieval Adapter Shell", "Defines fixture input, citation output, no-answer behavior, and review gates before live retrieval.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }
  const oldNotes = `<div class="version-row"><span>Release</span><strong>v4.3.5 Private Pilot Readiness Score</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.3.4 Launch Safety Checklist</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make private pilot readiness visible across feedback, session, safety, source, and answer gates.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for founder private pilot readiness review</strong></div>`;
  const newNotes = `<div class="version-row"><span>Release</span><strong>v4.4.0 First Real Retrieval Adapter Shell</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.3.9 Feedback-to-Ticket Audit Trail</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Create a launch-governance bridge from private pilot readiness into bounded fixture retrieval.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for first fixture adapter implementation</strong></div>`;
  text = text.replace(oldNotes, newNotes);
  const oldChecklist = `<li><span class="dot"></span><span>Review the readiness score with one real private pilot session.</span></li>
            <li><span class="dot"></span><span>Keep feedback, source, answer, and safety decisions reviewable.</span></li>
            <li><span class="dot"></span><span>Do not add public launch, payment, hidden telemetry, or production AI yet.</span></li>`;
  const newChecklist = `<li><span class="dot"></span><span>Implement fixture retrieval over curated JSON only.</span></li>
            <li><span class="dot"></span><span>Return source ids, citations, confidence, reasons, and no-answer results before answer text.</span></li>
            <li><span class="dot"></span><span>Keep live AI, network retrieval, hidden telemetry, payment, and public launch disabled.</span></li>`;
  text = text.replace(oldChecklist, newChecklist);
  write("build-status.html", text);
}

function changelogEntry(item) {
  const files = [
    item.href,
    item.dataFile,
    item.docFile,
    "assets/vedapath-command-shell.js",
    "scripts/check-static-links.mjs",
    "index.html",
    "build-status.html",
    "README.md",
    "CHANGELOG.md"
  ].map((file) => `\`${file}\``).join(", ");
  return `## ${item.version} ${item.pageTitle}

- Changes made: ${item.changes}
- Files changed: ${files}.
- Checks run: ${checkCommand}.
- Known risks: ${staticRisk}
`;
}

function readmeEntry(item) {
  return `## ${item.version} ${item.pageTitle}
- ${item.changes}
- Primary files: \`${item.href}\`, \`${item.dataFile}\`, \`${item.docFile}\`.
- Product note: ${staticRisk}
`;
}

function updateDocs() {
  const block = versions.map(changelogEntry).join("\n");
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.4.0 First Real Retrieval Adapter Shell")) {
    changelog = `${block}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  const readmeBlock = versions.map(readmeEntry).join("\n");
  let readme = read("README.md");
  if (!readme.includes("## v4.4.0 First Real Retrieval Adapter Shell")) {
    readme = `${readmeBlock}\n${readme}`;
  }
  write("README.md", readme);
}

function verifyVersion(item) {
  JSON.parse(read(item.dataFile));
  const page = read(item.href);
  if (!page.includes(item.dataFile)) throw new Error(`${item.href} missing data file link`);
  if (!page.includes("assets/vedapath-command-shell.js")) throw new Error(`${item.href} missing command shell`);
  if (!page.includes('href="index.html#top"')) throw new Error(`${item.href} missing home logo link`);
  if (!existsSync(filePath(item.docFile))) throw new Error(`${item.docFile} missing`);
  console.log(`${item.version} checks ok`);
}

for (const item of versions) {
  item.data = dataFor(item);
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.href, pageHtml(item));
  write(item.docFile, docMarkdown(item));
  verifyVersion(item);
}

updateCommandShell();
updateStaticLinks();
updateRootNavs();
updateIndex();
updateBuildStatus();
updateDocs();

console.log("v4.3.6-v4.4.0 pilot launch governance batch applied");

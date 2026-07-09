import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.5.5 evidence pack";
const checkCommand = "`node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA";
const staticRisk = "Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.";

const navLinks = [
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
  ["Retrieval Adapter", "retrievaladaptershell.html"],
  ["Fixture Adapter", "retrievalfixtureadapter.html"],
  ["Ranking Contract", "sourcecandidaterankingcontract.html"],
  ["No-Source", "nosourceanswerbehavior.html"],
  ["Citation Packet", "citationpacketrenderer.html"],
  ["QA Harness", "retrievalqaharness.html"],
  ["Coverage", "sourcecoverageexpansion.html"],
  ["Family Map", "sourcefamilycoveragemap.html"],
  ["Dossier", "passagedossierbuilder.html"],
  ["Approval Flow", "reviewerapprovalworkflow.html"],
  ["Answer Integration", "retrievaltoanswerintegrationgate.html"],
  ["Draft Review", "learneranswerdraftreview.html"],
  ["Revision", "answerrevisionworkbench.html"],
  ["Trace", "sourcetoanswertraceview.html"],
  ["Audience Views", "audienceviewtoggle.html"],
  ["Evidence Pack", "launchreadinessevidencepack.html"]
];

const answerRecords = [
  {
    id: "bg-2-48-steadiness",
    status: "approved",
    title: "Steady action",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports a practical answer about acting steadily while not turning outcomes into identity.",
    confidence: "High | 86/100",
    boundary: "Reflection support only; not therapy, medical advice, ritual instruction, or spiritual command.",
    missingFields: ["licensed translation display", "final reviewer signature"]
  },
  {
    id: "bg-11-32-category",
    status: "approved",
    title: "Oppenheimer category correction",
    citation: "Bhagavad Gita 11.32",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports correcting the common claim: the famous line is associated with the Gita, not the four Vedas.",
    confidence: "High | 91/100",
    boundary: "Do not call it a direct quote from the four Vedas.",
    missingFields: ["translation variant note"]
  },
  {
    id: "rv-3-62-10-gayatri",
    status: "hold",
    title: "Gayatri mantra care",
    citation: "Rigveda 3.62.10",
    family: "Veda | Shruti",
    summary: "Useful for source context, but learner-facing draft must avoid ritual instruction, pronunciation authority, or initiation claims.",
    confidence: "Medium | 68/100",
    boundary: "No ritual instruction, initiation advice, or recitation authority.",
    missingFields: ["mantra reviewer", "recitation boundary", "rights approval"]
  },
  {
    id: "isha-1-opening",
    status: "review",
    title: "Stewardship and restraint",
    citation: "Isha Upanishad 1",
    family: "Upanishad | Shruti",
    summary: "Can support a careful answer about possession and restraint if commentary and rights notes are visible.",
    confidence: "Medium | 72/100",
    boundary: "Do not flatten the verse into wealth advice or productivity advice.",
    missingFields: ["commentary lens", "translation rights"]
  },
  {
    id: "no-source-modern-airplanes",
    status: "no-source",
    title: "Modern aircraft overclaim",
    citation: "No direct source",
    family: "No-source behavior",
    summary: "Used to practice refusing inflated claims when no source can carry the answer.",
    confidence: "High | 95/100",
    boundary: "Say no reliable source is present; do not invent validation.",
    missingFields: ["none"]
  }
];

const versions = [
  {
    version: "v4.5.1",
    badge: "v4.5.1 draft review",
    href: "learneranswerdraftreview.html",
    bodyClass: "learner-answer-draft-review-page",
    pageTitle: "Learner Answer Draft Review",
    subtitle: "answer draft review",
    kind: "ask",
    dataFile: "data/vedapath-learner-answer-draft-review.json",
    docFile: "docs/LEARNER_ANSWER_DRAFT_REVIEW.md",
    eyebrow: "Learner answer review",
    headline: "Review the first answer before it teaches.",
    copy: "This room turns approved source packets into learner-facing answer drafts, with source, confidence, and boundary visible before any live AI is enabled.",
    changes: "Adds a learner answer draft review room with sample questions, cited draft packets, carry steps, and visible boundaries before live generation.",
    data: {
      memoryKey: "vedapathLearnerAnswerDraftReviewV451",
      boundary: "Draft review only. The answer is a prototype pattern, not final AI output or spiritual, ritual, medical, legal, or therapeutic authority.",
      records: answerRecords,
      questions: [
        {
          id: "steady-action",
          label: "Steady action",
          question: "How can I act calmly when results are uncertain?",
          answerTitle: "Begin with the next honest action, not the result you cannot control.",
          plainMeaning: "The source candidate supports steadiness in action. A useful answer should name one doable action and avoid promising instant peace.",
          recordIds: ["bg-2-48-steadiness"],
          carry: "Choose one small duty. Do it slowly, clearly, and without checking for praise."
        },
        {
          id: "oppenheimer-category",
          label: "Oppenheimer quote",
          question: "What scripture did Oppenheimer quote?",
          answerTitle: "The famous line is associated with the Bhagavad Gita, not the four Vedas.",
          plainMeaning: "The draft should gently correct the category, show the cited source, and avoid shaming the learner.",
          recordIds: ["bg-11-32-category"],
          carry: "State the source family plainly before explaining the wider cultural connection."
        },
        {
          id: "gayatri-care",
          label: "Gayatri mantra",
          question: "Can VedaPath explain Gayatri mantra?",
          answerTitle: "VedaPath may give source context, but should hold ritual or recitation guidance for review.",
          plainMeaning: "The record is high value but not ready for open learner guidance without reviewer and rights checks.",
          recordIds: ["rv-3-62-10-gayatri"],
          carry: "Offer source family and boundary first; route deeper practice to a qualified tradition or teacher."
        }
      ]
    }
  },
  {
    version: "v4.5.2",
    badge: "v4.5.2 revision",
    href: "answerrevisionworkbench.html",
    bodyClass: "answer-revision-workbench-page",
    pageTitle: "Answer Revision Workbench",
    subtitle: "answer revision",
    kind: "desk",
    dataFile: "data/vedapath-answer-revision-workbench.json",
    docFile: "docs/ANSWER_REVISION_WORKBENCH.md",
    eyebrow: "Revision workbench",
    headline: "Rewrite before release.",
    copy: "Every answer draft gets a calmer second pass: remove overclaim, tighten citation, preserve humility, and make the next action easier to understand.",
    changes: "Adds a revision workbench that turns risky answer drafts into clearer, shorter, boundary-first answer packets.",
    data: {
      headline: "Answer drafts need a revision lane before learner trust.",
      copy: "Use this workbench to compare a draft problem, the source card, the repair decision, and the revised packet.",
      metrics: [
        { label: "Drafts", value: "4" },
        { label: "Needs revision", value: "3" },
        { label: "Safe to demo", value: "1" },
        { label: "Live AI", value: "Off" }
      ],
      steps: [
        { title: "Read", copy: "Read the draft and the source card together." },
        { title: "Cut", copy: "Remove certainty, promise, or category confusion." },
        { title: "Repair", copy: "Rewrite in one direct answer plus one boundary." },
        { title: "Record", copy: "Save the reason for the revision." }
      ],
      candidates: [
        {
          id: "revise-steady-action",
          title: "Steady action draft",
          citation: "Bhagavad Gita 2.48",
          score: "Needs polish",
          reason: "The answer is useful but too confident about emotional outcome.",
          decision: "Revise for humility",
          record: answerRecords[0],
          packet: "Problem: promises calm too strongly.\nRevision: say the source supports steady action, not guaranteed peace.\nApproved draft: Begin with one honest next action. The source points toward steadiness in action, while the result remains uncertain.\nBoundary: reflection support only."
        },
        {
          id: "revise-category",
          title: "Oppenheimer source draft",
          citation: "Bhagavad Gita 11.32",
          score: "Strong",
          reason: "The answer corrects category confusion and keeps the tone respectful.",
          decision: "Demo-ready",
          record: answerRecords[1],
          packet: "Problem: popular wording can imply direct Vedic quotation.\nRevision: say Bhagavad Gita and source family explicitly.\nApproved draft: The famous line is associated with Bhagavad Gita 11.32, a section of the Mahabharata usually classified as Smriti.\nBoundary: do not call it a direct four-Veda quote."
        },
        {
          id: "revise-gayatri",
          title: "Gayatri mantra draft",
          citation: "Rigveda 3.62.10",
          score: "Hold",
          reason: "Needs mantra reviewer and recitation boundary before learner-facing depth.",
          decision: "Hold for review",
          record: answerRecords[2],
          packet: "Problem: draft drifts toward instruction.\nRevision: route to source context only.\nApproved draft: VedaPath can identify the source family and explain why the passage needs careful review before guidance.\nBoundary: no ritual, initiation, or pronunciation authority."
        }
      ]
    }
  },
  {
    version: "v4.5.3",
    badge: "v4.5.3 trace",
    href: "sourcetoanswertraceview.html",
    bodyClass: "source-to-answer-trace-view-page",
    pageTitle: "Source-to-Answer Trace View",
    subtitle: "source trace",
    kind: "schema",
    dataFile: "data/vedapath-source-to-answer-trace-view.json",
    docFile: "docs/SOURCE_TO_ANSWER_TRACE_VIEW.md",
    eyebrow: "Trace view",
    headline: "Every sentence should know its source.",
    copy: "This trace view makes the path from user intent to source packet to answer sentence visible, so trust is earned line by line.",
    changes: "Adds a source-to-answer trace view that maps answer sentences to source packet, confidence, boundary, and reviewer state.",
    data: {
      headline: "Trace each learner-facing sentence back to a source packet or a no-source rule.",
      copy: "The trace contract helps reviewers spot unsupported claims before an answer is promoted.",
      fields: [
        { name: "Intent", why: "What the learner is actually asking." },
        { name: "Source packet", why: "The cited passage and source family that can carry the answer." },
        { name: "Answer sentence", why: "The exact learner-facing sentence being reviewed." },
        { name: "Boundary", why: "What the answer must not imply." },
        { name: "Reviewer state", why: "Draft, revised, approved, held, or no-source." }
      ],
      required: [
        { key: "trace_id", value: "trace-bg-2-48-next-action" },
        { key: "source_id", value: "bg-2-48-steadiness" },
        { key: "answer_sentence_count", value: "4" },
        { key: "unsupported_sentences", value: "0" }
      ],
      records: answerRecords,
      metrics: [
        { label: "Trace records", value: "5" },
        { label: "Unsupported", value: "0" },
        { label: "Held", value: "2" },
        { label: "No-source", value: "1" }
      ],
      rules: [
        { title: "No loose sentences", copy: "A sentence without source, reason, or boundary cannot be promoted." },
        { title: "No hidden authority", copy: "The answer must not sound like scripture, guru, clinician, or ritual authority." },
        { title: "No category blur", copy: "Veda, Upanishad, Gita, commentary, and modern interpretation stay labeled." }
      ],
      example: {
        trace_id: "trace-bg-2-48-next-action",
        learner_question: "How can I act calmly when results are uncertain?",
        source_packet: "bg-2-48-steadiness",
        answer_sentences: [
          { sentence: "Begin with the next honest action.", support: "direct source candidate", status: "approved" },
          { sentence: "Do not turn the result into your identity.", support: "interpretive boundary", status: "reviewed" }
        ],
        boundary: "Reflection support only; not therapy, ritual instruction, or guaranteed peace."
      }
    }
  },
  {
    version: "v4.5.4",
    badge: "v4.5.4 audience",
    href: "audienceviewtoggle.html",
    bodyClass: "audience-view-toggle-page",
    pageTitle: "Audience View Toggle",
    subtitle: "audience views",
    kind: "qa",
    dataFile: "data/vedapath-audience-view-toggle.json",
    docFile: "docs/AUDIENCE_VIEW_TOGGLE.md",
    eyebrow: "Audience view",
    headline: "One answer, three depths.",
    copy: "This toggle keeps the same source packet while changing depth for beginner, Sanskrit learner, and scholar-review contexts.",
    changes: "Adds audience view toggles so a single source packet can be reviewed for beginner, Sanskrit, and scholar-reading depths without changing the source.",
    data: {
      headline: "A calm product needs depth without forcing every learner into the same room.",
      copy: "Filter the draft variants and inspect risks by audience depth.",
      progress: 72,
      boundary: "Audience views are explanation layers only. They do not create new source authority, ritual instruction, or final scholar approval.",
      filters: [
        { label: "All", value: "all" },
        { label: "Beginner", value: "Beginner" },
        { label: "Sanskrit", value: "Sanskrit" },
        { label: "Scholar", value: "Scholar" },
        { label: "Hold", value: "Hold" }
      ],
      metrics: [
        { label: "View layers", value: "3" },
        { label: "Source fixed", value: "Yes" },
        { label: "Held", value: "1" },
        { label: "Final", value: "No" }
      ],
      records: [
        { citation: "Bhagavad Gita 2.48", family: "Beginner", status: "Beginner", risks: ["over-comfort", "too motivational"] },
        { citation: "Bhagavad Gita 2.48", family: "Sanskrit", status: "Sanskrit", risks: ["word-level simplification", "needs transliteration review"] },
        { citation: "Bhagavad Gita 2.48", family: "Scholar", status: "Scholar", risks: ["commentary differences", "school specificity"] },
        { citation: "Rigveda 3.62.10", family: "Hold", status: "Hold", risks: ["ritual overreach", "recitation authority"] },
        { citation: "Bhagavad Gita 11.32", family: "Beginner", status: "Beginner", risks: ["popular quote wording", "category confusion"] }
      ],
      rules: [
        { title: "Same source", copy: "Depth changes must not quietly change the citation." },
        { title: "Plain first", copy: "Beginner view should answer simply before opening layers." },
        { title: "Review deeper views", copy: "Sanskrit and scholar views need stricter review before launch." }
      ]
    }
  },
  {
    version: "v4.5.5",
    badge: "v4.5.5 evidence pack",
    href: "launchreadinessevidencepack.html",
    bodyClass: "launch-readiness-evidence-pack-page",
    pageTitle: "Launch Readiness Evidence Pack",
    subtitle: "launch evidence",
    kind: "gate",
    dataFile: "data/vedapath-launch-readiness-evidence-pack.json",
    docFile: "docs/LAUNCH_READINESS_EVIDENCE_PACK.md",
    eyebrow: "Launch evidence",
    headline: "Launch only what evidence can defend.",
    copy: "This pack gathers source coverage, revision, trace, audience depth, and safety boundaries into one founder-review surface.",
    changes: "Adds a launch readiness evidence pack that summarizes source, answer, revision, trace, audience, and safety evidence before public release decisions.",
    data: {
      position: "The demo can show source-first answer drafts, but production launch remains gated until evidence, consent, storage, licensing, and reviewer workflows are real.",
      headline: "Evidence before launch confidence.",
      copy: "This gate makes the next founder decision explicit: what is demo-ready, what stays private, and what must wait for real infrastructure.",
      postures: [
        { decision: "Allowed", title: "Static demo", copy: "Show bounded answer draft rooms and source-first flow." },
        { decision: "Hold", title: "Live AI", copy: "No live generation until retrieval, logging, and review contracts exist." },
        { decision: "Hold", title: "Public source corpus", copy: "No broad corpus claims until rights and reviewer coverage are documented." },
        { decision: "Allowed", title: "Founder review", copy: "Use the evidence pack to decide the next build direction." }
      ],
      flow: [
        { title: "Source", copy: "Coverage, family, dossier, and approval are visible." },
        { title: "Answer", copy: "Draft, revision, and trace are visible." },
        { title: "Audience", copy: "Beginner, Sanskrit, and scholar views stay separated." },
        { title: "Launch", copy: "Demo can expand only where risks stay labeled." }
      ],
      decisions: [
        { label: "Demo surface", value: "Ready", reason: "Static pages and local memory are bounded." },
        { label: "Live answer generation", value: "Blocked", reason: "No production retrieval or reviewer storage yet." },
        { label: "Scholar approval", value: "Needed", reason: "Mantra, Sanskrit, and commentary lanes need human review." },
        { label: "Public launch", value: "Not yet", reason: "Need storage, consent, telemetry, corpus rights, and QA evidence." }
      ],
      metrics: [
        { label: "Evidence rooms", value: "5" },
        { label: "Launch posture", value: "Private demo" },
        { label: "Live AI", value: "Off" },
        { label: "Next", value: "API contract" }
      ],
      locks: [
        { title: "No hidden telemetry", copy: "Learning metrics must begin with consent and local boundaries." },
        { title: "No source inflation", copy: "No answer may claim more than the source packet supports." },
        { title: "No spiritual authority", copy: "VedaPath stays a learning companion, not a guru, ritual authority, or clinician." }
      ],
      packet: "VedaPath Launch Evidence Pack v4.5.5\nDemo-ready: static source-first answer draft rooms\nBlocked: live AI, public corpus, production storage, payment, public launch\nEvidence present: source coverage, family map, passage dossier, reviewer approval, answer integration, draft review, revision, trace, audience views\nFounder decision: proceed to real Source API Contract before external launch"
    }
  }
];

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return readFileSync(filePath(file), "utf8");
}

function write(file, value) {
  writeFileSync(filePath(file), value, "utf8");
}

function navHtml(activeHref) {
  return navLinks.map(([label, href]) => {
    const active = href === activeHref ? " active" : "";
    return `        <a class="link${active}" href="${href}">${label}</a>`;
  }).join("\n");
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
  <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css" />
</head>
<body class="${item.bodyClass} retrieval-pilot-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${item.subtitle}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
${navHtml(item.href)}
        <span class="version-pill">${finalBadge}</span>
      </nav>
    </header>

    <section class="rp-opening">
      <div>
        <span class="rp-eyebrow">${item.badge}</span>
        <h1>${item.headline}</h1>
        <p>${item.copy}</p>
      </div>
      <aside class="rp-opening-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>${item.pageTitle}</strong>
        <span>Source first. Calm path.</span>
      </aside>
    </section>

    <section data-retrieval-app data-kind="${item.kind}" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-retrieval-pilot.js"></script>
</body>
</html>
`;
}

function docMarkdown(item) {
  return `# ${item.pageTitle}

Version: ${item.version}

## Purpose

${item.changes}

## Product Role

${item.copy}

## Files

- Page: \`${item.href}\`
- Data: \`${item.dataFile}\`
- Renderer kind: \`${item.kind}\`

## Checks

${checkCommand}

## Known Risks

${staticRisk}
`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${finalBadge}";`);
  if (!text.includes('title: "Answer Drafts"')) {
    text = text.replace(
      '    { title: "Source Expansion", labels: ["Coverage", "Family Map", "Dossier", "Approval Flow", "Answer Integration"] }',
      '    { title: "Source Expansion", labels: ["Coverage", "Family Map", "Dossier", "Approval Flow", "Answer Integration"] },\n    { title: "Answer Drafts", labels: ["Draft Review", "Revision", "Trace", "Audience Views", "Evidence Pack"] }'
    );
  }
  if (!text.includes('"Draft Review": "Learner Answer Draft Review"')) {
    text = text.replace(
      '    "Answer Integration": "Retrieval-to-Answer Integration Gate"',
      '    "Answer Integration": "Retrieval-to-Answer Integration Gate",\n    "Draft Review": "Learner Answer Draft Review",\n    Revision: "Answer Revision Workbench",\n    Trace: "Source-to-Answer Trace View",\n    "Audience Views": "Audience View Toggle",\n    "Evidence Pack": "Launch Readiness Evidence Pack"'
    );
  }
  if (!text.includes('"learner-answer-draft-review-page"')) {
    text = text.replace(
      '    "retrieval-to-answer-integration-gate-page": "Retrieval-to-Answer Integration Gate"',
      '    "retrieval-to-answer-integration-gate-page": "Retrieval-to-Answer Integration Gate",\n    "learner-answer-draft-review-page": "Learner Answer Draft Review",\n    "answer-revision-workbench-page": "Answer Revision Workbench",\n    "source-to-answer-trace-view-page": "Source-to-Answer Trace View",\n    "audience-view-toggle-page": "Audience View Toggle",\n    "launch-readiness-evidence-pack-page": "Launch Readiness Evidence Pack"'
    );
  }
  if (!text.includes('["Draft Review", "learneranswerdraftreview.html"]')) {
    text = text.replace(
      '    ["Answer Integration", "retrievaltoanswerintegrationgate.html"]',
      '    ["Answer Integration", "retrievaltoanswerintegrationgate.html"],\n    ["Draft Review", "learneranswerdraftreview.html"],\n    ["Revision", "answerrevisionworkbench.html"],\n    ["Trace", "sourcetoanswertraceview.html"],\n    ["Audience Views", "audienceviewtoggle.html"],\n    ["Evidence Pack", "launchreadinessevidencepack.html"]'
    );
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const additions = versions.map((item) => `  "${item.href}"`).join(",\n");
  if (!text.includes('"learneranswerdraftreview.html"')) {
    text = text.replace('  "retrievaltoanswerintegrationgate.html"', `  "retrievaltoanswerintegrationgate.html",\n${additions}`);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateInlineVersionBadges() {
  const htmlFiles = [...new Set(navLinks.map(([, href]) => href).filter((href) => href.endsWith(".html")))];
  for (const file of htmlFiles) {
    if (!existsSync(filePath(file))) continue;
    let text = read(file);
    text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
    write(file, text);
  }
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  if (!text.includes("V451-V455 HOME STRIP START")) {
    const strip = `

      <!-- V451-V455 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Answer draft review path">
        <span class="rp-eyebrow green">v4.5.5 answer draft path</span>
        <h2>Answer draft path</h2>
        <p>VedaPath can now review, revise, trace, adapt, and evidence answer drafts before any live AI or public launch is allowed.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Draft Review</h3><p>Turn source packets into bounded answer drafts.</p><a class="rp-button green" href="learneranswerdraftreview.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Revision</h3><p>Repair overclaim, category blur, and tone risk.</p><a class="rp-button green" href="answerrevisionworkbench.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Trace</h3><p>Map each answer sentence to source and boundary.</p><a class="rp-button green" href="sourcetoanswertraceview.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Audience Views</h3><p>Keep beginner, Sanskrit, and scholar depths separate.</p><a class="rp-button green" href="audienceviewtoggle.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Evidence Pack</h3><p>Summarize what is demo-ready and what remains blocked.</p><a class="rp-button green" href="launchreadinessevidencepack.html">Open</a></article>
        </div>
      </article>
      <!-- V451-V455 HOME STRIP END -->
`;
    text = text.replace("      <!-- V446-V450 HOME STRIP END -->", `      <!-- V446-V450 HOME STRIP END -->${strip}`);
  }
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
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/<strong>v4\.5\.0<\/strong>\s*<p>Retrieval-to-Answer Integration Gate completes[^<]+<\/p>/, `<strong>v4.5.5</strong>
          <p>Launch Readiness Evidence Pack completes the answer-draft path from learner review to revision, trace, audience views, and launch evidence.</p>`);
  text = text.replace(/<p>The clickable MVP now has a source-expansion chain[^<]+<\/p>/, `<p>The clickable MVP now has an answer-draft chain for review, revision, source trace, audience depth, and launch evidence.</p>`);
  text = text.replace(/<p>The source layer now separates coverage growth[^<]+<\/p>/, `<p>The answer layer now separates demo-ready draft behavior from live AI, public corpus, telemetry, and production launch risk.</p>`);
  text = text.replace(/<strong>v4\.5\.1 Learner Answer Draft Review<\/strong>\s*<p>Review the first learner-facing answer drafts[^<]+<\/p>/, `<strong>v4.5.6 Real Source API Contract</strong>
          <p>Define the first backend contract for source lookup, trace IDs, reviewer state, and no-source responses.</p>`);
  text = text.replace(/<span class="badge active">Active<\/span>\s*\r?\n\s*<div>\s*\r?\n\s*<strong>Phase 410: Retrieval-to-Answer Integration Gate<\/strong>/, `<span class="badge done">Done</span>
              <div>
                <strong>Phase 410: Retrieval-to-Answer Integration Gate</strong>`);

  if (!text.includes("Phase 415: Launch Readiness Evidence Pack")) {
    const phases = [
      phaseHtml(411, "Learner Answer Draft Review", "Reviews first learner-facing answer drafts while live AI remains disabled."),
      phaseHtml(412, "Answer Revision Workbench", "Repairs overclaim, category blur, tone risk, and unsupported draft text."),
      phaseHtml(413, "Source-to-Answer Trace View", "Maps each answer sentence to source packet, confidence, boundary, and reviewer state."),
      phaseHtml(414, "Audience View Toggle", "Separates beginner, Sanskrit learner, and scholar-review depths without changing the source."),
      phaseHtml(415, "Launch Readiness Evidence Pack", "Summarizes demo-ready evidence and blocked production paths before founder launch decisions.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }

  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>v4\.5\.0 Retrieval-to-Answer Integration Gate<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v4\.4\.9 Reviewer Approval Workflow<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Let reviewed source packets become bounded answer drafts without enabling live AI\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready for learner answer draft review<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.5.5 Launch Readiness Evidence Pack</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.5.4 Audience View Toggle</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Show exactly what evidence supports a private demo and what blocks public launch.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for real Source API Contract design</strong></div>`
  );
  text = text.replace(
    /<li><span class="dot"><\/span><span>Review first answer drafts using the new integration gate\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep answer text source-carded, boundary-first, and easy to revise\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep live AI, network retrieval, hidden telemetry, payment, and public launch disabled\.<\/span><\/li>/,
    `<li><span class="dot"></span><span>Define a real Source API Contract for lookup, trace, reviewer state, and no-source behavior.</span></li>
            <li><span class="dot"></span><span>Keep the first backend boring, testable, and fully source-first.</span></li>
            <li><span class="dot"></span><span>Keep live AI, hidden telemetry, payment, and public launch disabled until evidence is stronger.</span></li>`
  );
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
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.5.5 Launch Readiness Evidence Pack")) {
    changelog = `${versions.map(changelogEntry).join("\n")}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  let readme = read("README.md");
  if (!readme.includes("## v4.5.5 Launch Readiness Evidence Pack")) {
    readme = `${versions.map(readmeEntry).join("\n")}\n${readme}`;
  }
  write("README.md", readme);
}

function verifyVersion(item) {
  JSON.parse(read(item.dataFile));
  const page = read(item.href);
  if (!page.includes(item.dataFile)) throw new Error(`${item.href} missing data file`);
  if (!page.includes("assets/vedapath-command-shell.js")) throw new Error(`${item.href} missing command shell`);
  if (!page.includes('href="index.html#top"')) throw new Error(`${item.href} missing home logo link`);
  if (!page.includes(`data-kind="${item.kind}"`)) throw new Error(`${item.href} missing renderer kind`);
  if (!existsSync(filePath(item.docFile))) throw new Error(`${item.docFile} missing`);
  console.log(`${item.version} checks ok`);
}

for (const item of versions) {
  write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
  write(item.href, pageHtml(item));
  write(item.docFile, docMarkdown(item));
  verifyVersion(item);
}

updateCommandShell();
updateStaticLinks();
updateInlineVersionBadges();
updateIndex();
updateBuildStatus();
updateDocs();

console.log("v4.5.1-v4.5.5 answer draft batch applied");

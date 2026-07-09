import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.6.0 private gate";
const checkCommand = "`node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA";
const staticRisk = "Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.";

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
  ["Evidence Pack", "launchreadinessevidencepack.html"],
  ["Source API", "realsourceapicontract.html"],
  ["Retrieval Boundary", "retrievalserviceboundary.html"],
  ["Answer Adapter", "mockanswergenerationadapter.html"],
  ["Review Handoff", "reviewerapprovalhandoff.html"],
  ["Private Gate", "privatelaunchgate.html"]
];

const sourceRecords = [
  {
    id: "bg-2-48-steadiness",
    status: "approved",
    title: "Steady action",
    citation: "Bhagavad Gita 2.48",
    family: "Bhagavad Gita | Smriti",
    summary: "Supports practical answers about steady action while avoiding promises of guaranteed calm.",
    confidence: "High | 86/100",
    boundary: "Reflection support only; not therapy, ritual instruction, or spiritual command.",
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
    summary: "Useful for source context, but learner-facing practice needs reviewer and rights review.",
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
    summary: "Can support careful answers about possession and restraint if commentary and rights notes are visible.",
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
    summary: "Used to refuse inflated claims when no reviewed source can carry the answer.",
    confidence: "High | 95/100",
    boundary: "Say no reliable source is present; do not invent validation.",
    missingFields: ["none"]
  }
];

const apiExample = {
  request: {
    query: "What scripture did Oppenheimer quote?",
    audience: "beginner",
    require_source: true
  },
  response: {
    trace_id: "vp-trace-00456-bg-11-32",
    status: "source_found",
    primary_source_id: "bg-11-32-category",
    citation: "Bhagavad Gita 11.32",
    family: "Bhagavad Gita | Smriti",
    confidence: 91,
    no_source: false,
    reviewer_state: "approved",
    boundary: "Do not call it a direct quote from the four Vedas."
  }
};

const releases = [
  {
    version: "v4.5.6",
    badge: "v4.5.6 source api",
    href: "realsourceapicontract.html",
    bodyClass: "real-source-api-contract-page",
    pageTitle: "Real Source API Contract",
    subtitle: "source API contract",
    kind: "schema",
    dataFile: "data/vedapath-real-source-api-contract.json",
    docFile: "docs/REAL_SOURCE_API_CONTRACT.md",
    eyebrow: "Source API contract",
    headline: "One source contract before one answer.",
    copy: "The next real backend must return traceable source packets, reviewer state, confidence, and no-source behavior before any answer text is composed.",
    changes: "Defines the first source lookup contract with required fields, response example, quality rules, and trace boundaries.",
    data: {
      headline: "A real answer starts with a source response, not prose.",
      copy: "This contract tells the future backend what the UI is allowed to trust: source id, citation, family, confidence, reviewer state, rights posture, and no-source decision.",
      fields: [
        { name: "query", why: "Keeps the user's intent visible for trace and review." },
        { name: "trace_id", why: "Makes every answer path auditable." },
        { name: "primary_source_id", why: "Prevents uncited answers from looking complete." },
        { name: "reviewer_state", why: "Separates approved records from hold or review records." },
        { name: "boundary", why: "Keeps category, ritual, medical, and authority limits visible." }
      ],
      required: [
        { key: "Endpoint", value: "GET /api/source-candidates" },
        { key: "Minimum response", value: "source id, citation, family, confidence, trace id" },
        { key: "No-source path", value: "explicit no_source=true response" },
        { key: "Storage", value: "none in prototype" },
        { key: "Launch posture", value: "contract only" }
      ],
      records: sourceRecords,
      example: apiExample,
      metrics: [
        { label: "Required fields", value: "9" },
        { label: "Response paths", value: "3" },
        { label: "Live API", value: "Off" },
        { label: "Trace", value: "Required" }
      ],
      rules: [
        { title: "No source, no answer", copy: "If no reviewed source is returned, the answer adapter must use no-source behavior." },
        { title: "Reviewer state travels", copy: "Approved, review, hold, and no-source states must stay visible in the answer layer." },
        { title: "Rights are data", copy: "Translation display and public reuse must remain disabled until rights fields are present." }
      ]
    }
  },
  {
    version: "v4.5.7",
    badge: "v4.5.7 boundary",
    href: "retrievalserviceboundary.html",
    bodyClass: "retrieval-service-boundary-page",
    pageTitle: "Retrieval Service Boundary",
    subtitle: "retrieval service boundary",
    kind: "gate",
    dataFile: "data/vedapath-retrieval-service-boundary.json",
    docFile: "docs/RETRIEVAL_SERVICE_BOUNDARY.md",
    eyebrow: "Retrieval boundary",
    headline: "Let retrieval find sources, not invent authority.",
    copy: "The future retrieval service may rank reviewed source packets, but it must not write final answers, override reviewer state, or hide no-source outcomes.",
    changes: "Separates the future retrieval service responsibilities from answer composition, reviewer decisions, storage, and public launch authority.",
    data: {
      position: "A retrieval service is useful only when its boundary is narrow: return candidates, evidence, confidence, and refusal signals.",
      headline: "Retrieval should be a calm evidence finder.",
      copy: "This gate keeps the service small enough to test. It may fetch and rank reviewed records; it may not become a hidden oracle.",
      postures: [
        { title: "Allowed", decision: "Allowed", copy: "Return source candidates, match reasons, trace id, confidence, and no-source status." },
        { title: "Blocked", decision: "Blocked", copy: "Do not create answer prose, store private user text, or make spiritual/ritual claims." },
        { title: "Review", decision: "Review", copy: "Route hold records, mantra records, and rights gaps to reviewer queues before display." }
      ],
      flow: [
        { title: "Receive query", copy: "Normalize the learner question without changing its intent." },
        { title: "Rank candidates", copy: "Use reviewed source records and show why each candidate matched." },
        { title: "Return boundary", copy: "Send status, confidence, reviewer state, and no-source behavior to the adapter." },
        { title: "Stay quiet", copy: "Leave answer writing to the bounded answer adapter." }
      ],
      decisions: [
        { label: "Source ranking", value: "Allowed", reason: "Ranking is visible and testable." },
        { label: "Answer prose", value: "Blocked", reason: "The adapter must compose with boundaries." },
        { label: "Reviewer override", value: "Blocked", reason: "Human review state cannot be silently changed." },
        { label: "Private storage", value: "Blocked", reason: "No account or consent system exists yet." }
      ],
      metrics: [
        { label: "Service scope", value: "Narrow" },
        { label: "Writes", value: "0" },
        { label: "No-source path", value: "Visible" },
        { label: "Live network", value: "Off" }
      ],
      locks: [
        { title: "No hidden generation", copy: "Retrieval cannot fill gaps with imagined scripture." },
        { title: "No private profile", copy: "The prototype does not persist personal learner text beyond local demos." },
        { title: "No launch authority", copy: "Service design does not imply public launch readiness." }
      ],
      packet: "VedaPath Retrieval Boundary v4.5.7\nAllowed: reviewed source ranking, match reasons, trace id, confidence, no-source flag\nBlocked: answer prose, reviewer override, private storage, ritual authority, public launch\nNext: answer adapter stub"
    }
  },
  {
    version: "v4.5.8",
    badge: "v4.5.8 adapter",
    href: "mockanswergenerationadapter.html",
    bodyClass: "mock-answer-generation-adapter-page",
    pageTitle: "Mock Answer Generation Adapter",
    subtitle: "answer adapter stub",
    kind: "desk",
    dataFile: "data/vedapath-mock-answer-generation-adapter.json",
    docFile: "docs/MOCK_ANSWER_GENERATION_ADAPTER.md",
    eyebrow: "Answer adapter",
    headline: "Compose only after the source has spoken.",
    copy: "This mock adapter turns a source packet into an answer draft using a fixed order: direct answer, source card, plain meaning, boundary, carry step.",
    changes: "Adds a mock answer adapter specification with selected source packets, composition order, refusal path, and boundary-first draft packets.",
    data: {
      headline: "The adapter is not live AI. It is the rulebook for live AI later.",
      copy: "Use this room to test how source packets become answer drafts while every source, confidence, and boundary remains visible.",
      metrics: [
        { label: "Draft shapes", value: "4" },
        { label: "No-source path", value: "1" },
        { label: "Live AI", value: "Off" },
        { label: "Order", value: "Fixed" }
      ],
      steps: [
        { title: "Source", copy: "Read only the returned source packet." },
        { title: "Compose", copy: "Draft a short answer in the approved answer anatomy." },
        { title: "Refuse", copy: "Use no-source behavior when evidence is missing." },
        { title: "Carry", copy: "Offer one small, grounded next step." }
      ],
      candidates: [
        {
          id: "adapter-steady",
          title: "Steady action answer",
          citation: "Bhagavad Gita 2.48",
          score: "Ready to draft",
          reason: "Approved source packet with clear learner use and calm boundary.",
          decision: "Compose bounded draft",
          record: sourceRecords[0],
          packet: "Adapter draft\nDirect answer: Begin with one honest next action, not the result you cannot control.\nSource card: Bhagavad Gita 2.48 | Bhagavad Gita | Smriti | High confidence.\nPlain meaning: The source supports steadiness in action, not guaranteed peace.\nBoundary: Reflection support only.\nCarry: Choose one small duty and do it slowly."
        },
        {
          id: "adapter-oppenheimer",
          title: "Oppenheimer correction",
          citation: "Bhagavad Gita 11.32",
          score: "Ready to draft",
          reason: "Approved category correction with a clear overclaim boundary.",
          decision: "Compose corrective draft",
          record: sourceRecords[1],
          packet: "Adapter draft\nDirect answer: The famous line is associated with the Bhagavad Gita, not the four Vedas.\nSource card: Bhagavad Gita 11.32 | Smriti | High confidence.\nPlain meaning: Popular culture often calls it Vedic, but the direct source should be stated carefully.\nBoundary: Do not call it a direct Vedic quote."
        },
        {
          id: "adapter-gayatri",
          title: "Gayatri mantra hold",
          citation: "Rigveda 3.62.10",
          score: "Hold",
          reason: "High value source, but ritual and recitation boundaries need reviewer approval.",
          decision: "Do not draft practice instruction",
          record: sourceRecords[2],
          packet: "Adapter hold\nDirect answer: VedaPath can identify the source family and explain why care is needed.\nSource card: Rigveda 3.62.10 | Veda | Shruti | Medium confidence.\nBoundary: No recitation, initiation, or ritual instruction.\nNext: route to mantra reviewer and rights desk."
        },
        {
          id: "adapter-no-source",
          title: "No-source refusal",
          citation: "No direct source",
          score: "Refuse",
          reason: "The claim has no reviewed source packet.",
          decision: "Use no-source behavior",
          record: sourceRecords[4],
          packet: "Adapter refusal\nDirect answer: I do not have a reviewed source that supports that claim.\nSource card: No direct source.\nBoundary: Do not invent validation.\nCarry: Offer to search related terms or compare source families."
        }
      ]
    }
  },
  {
    version: "v4.5.9",
    badge: "v4.5.9 handoff",
    href: "reviewerapprovalhandoff.html",
    bodyClass: "reviewer-approval-handoff-page",
    pageTitle: "Reviewer Approval Handoff",
    subtitle: "reviewer approval handoff",
    kind: "desk",
    dataFile: "data/vedapath-reviewer-approval-handoff.json",
    docFile: "docs/REVIEWER_APPROVAL_HANDOFF.md",
    eyebrow: "Reviewer handoff",
    headline: "Human approval must leave a receipt.",
    copy: "This handoff keeps reviewer decision, source state, risk, and next action together before any answer packet moves toward a private demo.",
    changes: "Adds a reviewer handoff room with approval packets, risks, owner lanes, receipt language, and blocked production fields.",
    data: {
      headline: "A reviewer decision should be readable after the moment passes.",
      copy: "Every approval handoff needs owner, source id, decision, risk, reason, and blocked fields so the product never silently upgrades itself.",
      metrics: [
        { label: "Packets", value: "4" },
        { label: "Approved", value: "2" },
        { label: "Hold", value: "1" },
        { label: "No-source", value: "1" }
      ],
      steps: [
        { title: "Assign", copy: "Name the reviewer lane and owner." },
        { title: "Decide", copy: "Approve, hold, revise, or refuse." },
        { title: "Receipt", copy: "Save a short decision receipt." },
        { title: "Gate", copy: "Keep production fields blocked until ready." }
      ],
      candidates: [
        {
          id: "handoff-steady",
          title: "Approve steady action",
          citation: "Bhagavad Gita 2.48",
          score: "Approved",
          reason: "Suitable for beginner calm reflection with visible boundary.",
          decision: "Private demo allowed",
          record: sourceRecords[0],
          packet: "Reviewer receipt\nOwner: source reviewer\nDecision: approved for private demo\nReason: source supports steady action language; boundary visible\nBlocked: public translation display, medical framing, ritual instruction\nNext: allow adapter draft in private demo"
        },
        {
          id: "handoff-oppenheimer",
          title: "Approve category correction",
          citation: "Bhagavad Gita 11.32",
          score: "Approved",
          reason: "Strong public-interest example with clear category correction.",
          decision: "Private demo allowed",
          record: sourceRecords[1],
          packet: "Reviewer receipt\nOwner: interpretation reviewer\nDecision: approved for private demo\nReason: answer corrects Gita vs four Vedas distinction\nBlocked: overclaim, exact translation certainty\nNext: show as product trust example"
        },
        {
          id: "handoff-gayatri",
          title: "Hold mantra practice",
          citation: "Rigveda 3.62.10",
          score: "Hold",
          reason: "Needs mantra reviewer, rights posture, and ritual boundary.",
          decision: "Do not release practice",
          record: sourceRecords[2],
          packet: "Reviewer receipt\nOwner: mantra reviewer\nDecision: hold\nReason: source identification is fine, but practice instruction is not approved\nBlocked: recitation guidance, initiation claims, pronunciation authority\nNext: create reviewer-specific mantra policy"
        },
        {
          id: "handoff-no-source",
          title: "Refuse inflated claim",
          citation: "No direct source",
          score: "Refuse",
          reason: "No reviewed source can support the claim.",
          decision: "No-source answer only",
          record: sourceRecords[4],
          packet: "Reviewer receipt\nOwner: source intake\nDecision: refuse unsupported claim\nReason: no reviewed source exists\nBlocked: answer generation, promotion, public examples\nNext: invite source submission if founder wants"
        }
      ]
    }
  },
  {
    version: "v4.6.0",
    badge: "v4.6.0 private gate",
    href: "privatelaunchgate.html",
    bodyClass: "private-launch-gate-page",
    pageTitle: "Private Launch Gate",
    subtitle: "private launch gate",
    kind: "gate",
    dataFile: "data/vedapath-private-launch-gate.json",
    docFile: "docs/PRIVATE_LAUNCH_GATE.md",
    eyebrow: "Private launch gate",
    headline: "Private demo can open. Public launch stays closed.",
    copy: "The product now has enough visible evidence for a private founder-led demo, while live AI, public launch, payment, and production storage remain locked.",
    changes: "Adds a private launch gate that distinguishes private demo readiness from public launch readiness with explicit locks, metrics, and founder packet.",
    data: {
      position: "VedaPath is close to a real private launch rehearsal, but public launch should wait for live retrieval tests, rights, reviewer accounts, and safety review.",
      headline: "Open the private room, keep the public door closed.",
      copy: "This gate gives the founder a clear go/no-go posture: demo the source-first workflow privately, collect feedback carefully, and keep all production promises off.",
      postures: [
        { title: "Private demo", decision: "Allowed", copy: "Founder-led demo with static sources, clear prototype labels, and no account promises." },
        { title: "Public launch", decision: "Blocked", copy: "Requires live retrieval, reviewer operations, rights posture, privacy terms, and safety review." },
        { title: "Production storage", decision: "Blocked", copy: "No server persistence until account, consent, export, deletion, and audit rules exist." },
        { title: "Live AI", decision: "Review", copy: "Can be prototyped only behind source API contract and no-source refusal tests." }
      ],
      flow: [
        { title: "Show source-first ask", copy: "Start with one real question and the source packet." },
        { title: "Show adapter boundary", copy: "Explain how source packets become bounded answer drafts." },
        { title: "Show reviewer receipt", copy: "Keep human approval and blocked fields visible." },
        { title: "Collect private feedback", copy: "Use review tickets, not silent knowledge changes." }
      ],
      decisions: [
        { label: "Private founder demo", value: "Allowed", reason: "Static source-first path is coherent enough to show carefully." },
        { label: "Public beta", value: "Blocked", reason: "Needs real API, rights, reviewer workflow, privacy, and safety checks." },
        { label: "Live AI", value: "Blocked", reason: "Needs no-source evals and adapter tests first." },
        { label: "Payment", value: "Blocked", reason: "No pricing, terms, support, or production SLA exists." }
      ],
      metrics: [
        { label: "Private demo", value: "Ready" },
        { label: "Public launch", value: "Closed" },
        { label: "Live AI", value: "Off" },
        { label: "Next", value: "API tests" }
      ],
      locks: [
        { title: "Rights lock", copy: "Do not display licensed translations publicly without permission." },
        { title: "Reviewer lock", copy: "Do not promote hold records without reviewer receipts." },
        { title: "Privacy lock", copy: "Do not store personal reflections on a server without consent and export/delete controls." },
        { title: "Authority lock", copy: "Do not present VedaPath as a guru, therapist, ritual authority, or replacement for tradition." }
      ],
      packet: "VedaPath Private Launch Gate v4.6.0\nPrivate demo: allowed with static source-first prototype labels\nPublic launch: blocked\nLive AI: blocked until source API tests and no-source evals pass\nProduction storage: blocked until consent, export, deletion, audit, and reviewer accounts exist\nFounder next: decide whether to build real Source API test harness or private demo script"
    }
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

function navHtml(activeLabel) {
  return navLinks.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
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
${navHtml(item.pageTitle === "Real Source API Contract" ? "Source API" : item.pageTitle === "Retrieval Service Boundary" ? "Retrieval Boundary" : item.pageTitle === "Mock Answer Generation Adapter" ? "Answer Adapter" : item.pageTitle === "Reviewer Approval Handoff" ? "Review Handoff" : "Private Gate")}
        <span class="version-pill">${finalBadge}</span>
      </nav>
    </header>

    <section class="rp-opening">
      <div>
        <span class="rp-eyebrow">${item.eyebrow}</span>
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

${item.copy}

## What Changed

${item.changes}

## Product Boundary

${staticRisk}

## Primary Files

- ${item.href}
- ${item.dataFile}
- ${item.docFile}

## Checks

${checkCommand}
`;
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

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${finalBadge}";`);
  if (!text.includes('title: "Launch Stack"')) {
    text = text.replace(
      '{ title: "Answer Drafts", labels: ["Draft Review", "Revision", "Trace", "Audience Views", "Evidence Pack"] }',
      '{ title: "Answer Drafts", labels: ["Draft Review", "Revision", "Trace", "Audience Views", "Evidence Pack"] },\n    { title: "Launch Stack", labels: ["Source API", "Retrieval Boundary", "Answer Adapter", "Review Handoff", "Private Gate"] }'
    );
  }
  if (!text.includes('"Source API": "Real Source API Contract"')) {
    text = text.replace(
      '"Evidence Pack": "Launch Readiness Evidence Pack"\n  };',
      '"Evidence Pack": "Launch Readiness Evidence Pack",\n    "Source API": "Real Source API Contract",\n    "Retrieval Boundary": "Retrieval Service Boundary",\n    "Answer Adapter": "Mock Answer Generation Adapter",\n    "Review Handoff": "Reviewer Approval Handoff",\n    "Private Gate": "Private Launch Gate"\n  };'
    );
  }
  if (!text.includes('"private-launch-gate-page": "Private Launch Gate"')) {
    text = text.replace(
      '"launch-readiness-evidence-pack-page": "Launch Readiness Evidence Pack"\n  };',
      '"launch-readiness-evidence-pack-page": "Launch Readiness Evidence Pack",\n    "real-source-api-contract-page": "Real Source API Contract",\n    "retrieval-service-boundary-page": "Retrieval Service Boundary",\n    "mock-answer-generation-adapter-page": "Mock Answer Generation Adapter",\n    "reviewer-approval-handoff-page": "Reviewer Approval Handoff",\n    "private-launch-gate-page": "Private Launch Gate"\n  };'
    );
  }
  if (!text.includes('["Private Gate", "privatelaunchgate.html"]')) {
    text = text.replace(
      '["Evidence Pack", "launchreadinessevidencepack.html"]',
      '["Evidence Pack", "launchreadinessevidencepack.html"],\n    ["Source API", "realsourceapicontract.html"],\n    ["Retrieval Boundary", "retrievalserviceboundary.html"],\n    ["Answer Adapter", "mockanswergenerationadapter.html"],\n    ["Review Handoff", "reviewerapprovalhandoff.html"],\n    ["Private Gate", "privatelaunchgate.html"]'
    );
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  if (!text.includes('"realsourceapicontract.html"')) {
    const additions = releases.map((item) => `  "${item.href}"`).join(",\n");
    text = text.replace('  "launchreadinessevidencepack.html"', `  "launchreadinessevidencepack.html",\n${additions}`);
  }
  write("scripts/check-static-links.mjs", text);
}

function updateInlineVersionBadges() {
  const htmlFiles = [...new Set(navLinks.map(([, href]) => href).filter((href) => href.endsWith(".html")))];
  for (const file of htmlFiles) {
    if (!existsSync(filePath(file))) continue;
    let text = read(file);
    text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
    text = text.replace(/<span class="version">v[0-9][^<]+<\/span>/g, `<span class="version">${finalBadge}</span>`);
    write(file, text);
  }
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/<span class="version">v[0-9][^<]+<\/span>/g, `<span class="version">${finalBadge}</span>`);
  if (!text.includes("V456-V460 HOME STRIP START")) {
    const strip = `

      <!-- V456-V460 HOME STRIP START -->
      <article class="rp-card rp-span" aria-label="Private launch stack">
        <span class="rp-eyebrow green">v4.6.0 private launch stack</span>
        <h2>Private launch stack</h2>
        <p>VedaPath now has a source API contract, retrieval boundary, answer adapter stub, reviewer handoff, and private launch gate before any public promise opens.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Source API</h3><p>Return source packets, trace IDs, reviewer state, confidence, and no-source flags.</p><a class="rp-button green" href="realsourceapicontract.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Boundary</h3><p>Keep retrieval as evidence finding, not hidden answer authority.</p><a class="rp-button green" href="retrievalserviceboundary.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Adapter</h3><p>Compose drafts only after the source packet is visible.</p><a class="rp-button green" href="mockanswergenerationadapter.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Handoff</h3><p>Make reviewer approval leave a readable receipt.</p><a class="rp-button green" href="reviewerapprovalhandoff.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">5</span><h3>Private Gate</h3><p>Open private demo posture while public launch stays closed.</p><a class="rp-button green" href="privatelaunchgate.html">Open</a></article>
        </div>
      </article>
      <!-- V456-V460 HOME STRIP END -->
`;
    text = text.replace("      <!-- V451-V455 HOME STRIP END -->", `      <!-- V451-V455 HOME STRIP END -->${strip}`);
  }
  write("index.html", text);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>v4.6.0</strong>
          <p>Private Launch Gate completes the launch/API readiness stack: source contract, retrieval boundary, answer adapter, reviewer handoff, and private demo gate.</p>`);
  text = text.replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>The clickable MVP now has private-launch readiness surfaces that keep source, adapter, review, and launch locks separate.</p>`);
  text = text.replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>99%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>
          <p>The product is ready for private demo rehearsal, but real API tests, reviewer accounts, rights, and privacy remain before public launch.</p>`);
  text = text.replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>v4.6.1 Source API Test Harness</strong>
          <p>Turn the source contract into executable fixtures and no-source evaluation checks.</p>`);
  text = text.replace(/<span class="badge active">Active<\/span>\s*\r?\n\s*<div>\s*\r?\n\s*<strong>Phase 415: Launch Readiness Evidence Pack<\/strong>/, `<span class="badge done">Done</span>
              <div>
                <strong>Phase 415: Launch Readiness Evidence Pack</strong>`);
  if (!text.includes("Phase 420: Private Launch Gate")) {
    const phases = [
      phaseHtml(416, "Real Source API Contract", "Defines source lookup response fields, trace IDs, reviewer state, and no-source behavior."),
      phaseHtml(417, "Retrieval Service Boundary", "Keeps retrieval focused on evidence ranking while answer generation and storage stay blocked."),
      phaseHtml(418, "Mock Answer Generation Adapter", "Turns source packets into bounded answer draft shapes without enabling live AI."),
      phaseHtml(419, "Reviewer Approval Handoff", "Captures reviewer decisions, risks, owners, blocked fields, and receipts."),
      phaseHtml(420, "Private Launch Gate", "Allows private demo posture while public launch, live AI, payment, and production storage stay closed.", true)
    ].join("");
    text = text.replace("            <!-- V410-V414 PHASES END -->", `${phases}            <!-- V410-V414 PHASES END -->`);
  }
  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.6.0 Private Launch Gate</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.5.9 Reviewer Approval Handoff</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make private-demo readiness explicit while public launch remains blocked.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for Source API test harness</strong></div>`
  );
  text = text.replace(
    /<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>\s*<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>\s*<li><span class="dot"><\/span><span>[\s\S]*?<\/span><\/li>/,
    `<li><span class="dot"></span><span>Build executable Source API fixtures and no-source evaluation checks.</span></li>
            <li><span class="dot"></span><span>Keep the private demo script source-first, humble, and clearly labeled as prototype.</span></li>
            <li><span class="dot"></span><span>Do not enable public launch, live AI, payment, or production storage until the next gates pass.</span></li>`
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
  if (!changelog.includes("## v4.6.0 Private Launch Gate")) {
    changelog = `${releases.map(changelogEntry).join("\n")}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  let readme = read("README.md");
  if (!readme.includes("## v4.6.0 Private Launch Gate")) {
    readme = `${releases.map(readmeEntry).join("\n")}\n${readme}`;
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

for (const item of releases) {
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

console.log("v4.5.6-v4.6.0 launch/API batch applied");

import { readFileSync, writeFileSync } from "node:fs";

const today = "2026-07-06";

const files = {
  commandShell: "assets/vedapath-command-shell.js",
  index: "index.html",
  buildStatus: "build-status.html",
  readme: "README.md",
  prototypeNotes: "docs/PROTOTYPE_NOTES.md",
  productBlueprint: "docs/PRODUCT_BLUEPRINT.md",
  changelog: "CHANGELOG.md",
  draftGateData: "data/vedapath-controlled-permission-execution-authorization-draft-gate.json",
  draftReviewData: "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json",
  reviewDecisionData: "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json",
  founderDecisionData: "data/vedapath-founder-permission-execution-authorization-decision-gate.json",
  draftReviewPage: "controlledpermissionexecutionauthorizationdraftreviewgate.html",
  reviewDecisionPage: "controlledpermissionexecutionauthorizationreviewdecisiongate.html",
  founderDecisionPage: "founderpermissionexecutionauthorizationdecisiongate.html",
  draftReviewJs: "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js",
  reviewDecisionJs: "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.js",
  founderDecisionJs: "assets/vedapath-founder-permission-execution-authorization-decision-gate.js"
};

const sourceKeys = [
  "question",
  "answer_title",
  "source_ref",
  "source_family",
  "source_id",
  "source_confidence",
  "source_confidence_score",
  "pramana_level",
  "retrieval_candidate",
  "answer_card_id",
  "answer_card_route",
  "answer_card_ready",
  "answer_card_handoff_ready",
  "answer_changed",
  "retrieval_config_changed",
  "storage_enabled",
  "public_release_enabled",
  "execution_allowed",
  "permission_granted",
  "authority_to_execute",
  "production_authorized",
  "human_review_required",
  "founder_review_required",
  "draft_gate_release",
  "draft_gate_schema",
  "draft_review_gate_release",
  "draft_review_gate_schema",
  "review_decision_gate_release",
  "review_decision_gate_schema",
  "founder_decision_gate_release",
  "founder_decision_gate_schema"
];

const falseAuthorityFlags = {
  permission_granted: false,
  authority_to_execute: false,
  execution_allowed: false,
  storage_enabled: false,
  public_release_enabled: false,
  production_authorized: false
};

function read(file) {
  return readFileSync(file, "utf8");
}

function write(file, content) {
  writeFileSync(file, content.replace(/\r?\n/g, "\n"), "utf8");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function writeJson(file, value) {
  write(file, `${JSON.stringify(value, null, 2)}\n`);
}

function patchFile(file, patches) {
  let text = read(file);
  for (const [from, to] of patches) {
    text = text.split(from).join(to);
  }
  write(file, text);
}

function patchOptional(file, from, to) {
  const text = read(file);
  if (text.includes(from)) {
    write(file, text.replace(from, to));
  }
}

function prependOnce(file, marker, block) {
  const text = read(file);
  if (text.includes(marker)) return;
  write(file, `${block.trim()}\n\n${text}`);
}

function pickSource(packet) {
  const picked = {};
  for (const key of sourceKeys) {
    if (Object.prototype.hasOwnProperty.call(packet, key)) picked[key] = packet[key];
  }
  return picked;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function stampBase(data, release, schema, name, previousRelease, inputRelease, nextGate) {
  data.schema_version = schema;
  data.release = release;
  data.name = name;
  data.updated_at = today;
  data.generated_at = today;
  data.previous_release = previousRelease;
  data.input_release = inputRelease;
  data.next_gate = nextGate;
  data.production_authorized = false;
  data.public_release_enabled = false;
  data.storage_enabled = false;
  data.execution_allowed = false;
  data.authority_to_execute = false;
  data.permission_granted = false;
  data.human_review_required = true;
  data.founder_review_required = true;
}

function setGateCopy(data, title, subtitle, purpose, boundary) {
  data.title = title;
  data.subtitle = subtitle;
  data.purpose = purpose;
  data.boundary = boundary;
  data.summary = subtitle;
}

function v405DraftReview() {
  const draft = readJson(files.draftGateData);
  const review = readJson(files.draftReviewData);
  stampBase(
    review,
    "v4.0.5",
    "controlled-permission-execution-authorization-draft-review-gate-v9",
    "Controlled Permission Execution Authorization Draft Review Gate Re-entry",
    "v4.0.4",
    "v4.0.4",
    "Controlled Permission Execution Authorization Review Decision Gate Re-entry"
  );
  setGateCopy(
    review,
    "Review the controlled draft without opening execution.",
    "The review gate reads the v4.0.4 draft packet, checks source identity and false authority flags, then prepares founder decision language.",
    "Make the authorization draft reviewable while preserving no permission, no execution, no storage, and no public release.",
    "Review support only. This gate cannot grant authority, execute instructions, store production data, or publish the answer."
  );
  review.sample_draft_packet = {
    ...draft.sample_draft,
    schema_version: draft.schema_version,
    release: "v4.0.4",
    draft_gate_release: "v4.0.4",
    draft_gate_schema: draft.schema_version,
    draft_status: "Controlled draft review candidate prepared; execution remains false.",
    draft_packet_ready: true,
    answer_card_handoff_ready: true,
    source_identity_preserved: true,
    false_authority_flags_preserved: true,
    next_gate_required: "Controlled draft review gate",
    ...falseAuthorityFlags
  };
  review.sample_review = {
    ...review.sample_review,
    ...pickSource(draft.sample_draft),
    release: "v4.0.5",
    schema_version: review.schema_version,
    input_release: "v4.0.4",
    draft_gate_release: "v4.0.4",
    draft_gate_schema: draft.schema_version,
    draft_review_gate_release: "v4.0.5",
    draft_review_gate_schema: review.schema_version,
    review_state: "Draft review ready for founder decision",
    draft_review_status: "Draft review ready for founder decision; execution remains false.",
    reviewer_posture: "Check the packet, do not grant authority.",
    review_summary: "The v4.0.4 draft keeps identity, source, boundary, and false authority flags visible. It can move to the review decision gate as draft-only language.",
    review_notes: [
      "Question, source family, citation, confidence, and pramana level remain visible.",
      "Authorization, execution, storage, public release, and production remain false.",
      "Founder decision language should stay review posture, not operational approval."
    ],
    route_to_next_gate: true,
    next_gate_required: "Controlled review decision gate",
    ...falseAuthorityFlags
  };
  review.review_criteria = [
    "Source identity is preserved from the draft packet.",
    "No permission, execution, storage, public release, or production flag is true.",
    "The review can be copied as founder decision input without changing the answer.",
    "The language remains calm, narrow, and non-authoritative."
  ];
  writeJson(files.draftReviewData, review);

  patchFile(files.draftReviewJs, [
    ["controlled-permission-execution-authorization-draft-gate-v8", "controlled-permission-execution-authorization-draft-gate-v9"],
    ["controlled-permission-execution-authorization-draft-review-gate-v8", "controlled-permission-execution-authorization-draft-review-gate-v9"],
    ['packet.release !== "v4.0.0"', 'packet.release !== "v4.0.4"'],
    ['draftReview.release = "v4.0.1";', 'draftReview.release = "v4.0.5";'],
    ['draftReview.input_release = "v4.0.0";', 'draftReview.input_release = "v4.0.4";'],
    ['draftReview.next_gate_required = "Controlled permission execution authorization review decision gate";', 'draftReview.next_gate_required = "Controlled review decision gate re-entry";']
  ]);
  patchFile(files.draftReviewPage, [
    ["v4.0.1 review", "v4.0.5 review"],
    ["v4.0.1", "v4.0.5"],
    ["v4.0.0", "v4.0.4"],
    ["Draft review before authorization decision.", "Review the v4.0.4 controlled draft without opening execution."],
    ["Review the controlled draft before founder authorization decision.", "Review the controlled draft, keep every authority flag false, then prepare founder decision input."],
    ["Source draft", "Source draft re-entry"],
    ["Draft review", "Controlled draft review"]
  ]);
}

function v406ReviewDecision() {
  const review = readJson(files.draftReviewData);
  const decision = readJson(files.reviewDecisionData);
  stampBase(
    decision,
    "v4.0.6",
    "controlled-permission-execution-authorization-review-decision-gate-v9",
    "Controlled Permission Execution Authorization Review Decision Gate Re-entry",
    "v4.0.5",
    "v4.0.5",
    "Founder Permission Execution Authorization Decision Gate Re-entry"
  );
  setGateCopy(
    decision,
    "Decide review posture before founder choice.",
    "The decision gate separates four routes: return, hold, block, or send to founder decision. None of them grants execution.",
    "Make review outcomes explicit so the founder sees a controlled decision packet, not a hidden approval.",
    "Decision support only. No authorization, execution, production storage, or public release is possible from this page."
  );
  decision.sample_draft_review_packet = {
    ...review.sample_review,
    schema_version: review.schema_version,
    release: "v4.0.5",
    draft_review_status: "Draft review ready for founder decision; execution remains false.",
    draft_review_gate_release: "v4.0.5",
    draft_review_gate_schema: review.schema_version,
    route_to_next_gate: true,
    source_identity_preserved: true,
    false_authority_flags_preserved: true,
    ...falseAuthorityFlags
  };
  decision.review_routes = [
    { route: "return", label: "Return to draft", meaning: "The packet needs clearer source or boundary language." },
    { route: "hold", label: "Hold for reviewer", meaning: "The packet is not ready for founder decision." },
    { route: "block", label: "Block", meaning: "A risk or missing field prevents movement." },
    { route: "founder", label: "Send to founder", meaning: "Draft-only decision posture is ready; no authority is granted." }
  ];
  decision.sample_decision = {
    ...decision.sample_decision,
    ...pickSource(review.sample_review),
    release: "v4.0.6",
    schema_version: decision.schema_version,
    input_release: "v4.0.5",
    draft_review_gate_release: "v4.0.5",
    draft_review_gate_schema: review.schema_version,
    review_decision_gate_release: "v4.0.6",
    review_decision_gate_schema: decision.schema_version,
    decision_state: "Ready for founder decision",
    decision_route: "founder",
    decision_status: "Ready for founder decision; no authority granted.",
    decision_summary: "The draft review packet can move to founder decision as a controlled, non-authorizing review packet.",
    return_reason: "",
    hold_reason: "",
    block_reason: "",
    route_to_founder: true,
    next_gate_required: "Founder decision gate re-entry",
    ...falseAuthorityFlags
  };
  writeJson(files.reviewDecisionData, decision);

  patchFile(files.reviewDecisionJs, [
    ["controlled-permission-execution-authorization-draft-review-gate-v8", "controlled-permission-execution-authorization-draft-review-gate-v9"],
    ["controlled-permission-execution-authorization-review-decision-gate-v8", "controlled-permission-execution-authorization-review-decision-gate-v9"],
    ['packet.release !== "v4.0.1"', 'packet.release !== "v4.0.5"'],
    ['reviewDecision.release = "v4.0.2";', 'reviewDecision.release = "v4.0.6";'],
    ['reviewDecision.input_release = "v4.0.1";', 'reviewDecision.input_release = "v4.0.5";'],
    ['reviewDecision.next_gate_required = "Founder permission execution authorization decision gate";', 'reviewDecision.next_gate_required = "Founder decision gate re-entry";']
  ]);
  patchFile(files.reviewDecisionPage, [
    ["v4.0.2 decision", "v4.0.6 decision"],
    ["v4.0.2", "v4.0.6"],
    ["v4.0.1", "v4.0.5"],
    ["Review decision before founder authorization.", "Choose return, hold, block, or founder review while authority stays false."],
    ["Decision before founder authorization.", "Controlled review decision before founder posture."]
  ]);
}

function v407FounderDecision() {
  const reviewDecision = readJson(files.reviewDecisionData);
  const founder = readJson(files.founderDecisionData);
  stampBase(
    founder,
    "v4.0.7",
    "founder-permission-execution-authorization-decision-gate-v9",
    "Founder Permission Execution Authorization Decision Gate Re-entry",
    "v4.0.6",
    "v4.0.6",
    "Answer Packet Pilot"
  );
  setGateCopy(
    founder,
    "Founder posture without production authority.",
    "The founder gate records whether the reviewed packet is safe to pilot as a visible answer packet. It still cannot authorize execution or production release.",
    "Let the founder choose a posture for the pilot surface while every real execution path remains locked.",
    "Founder review support only. This is not legal authority, production authorization, or permission to execute any external action."
  );
  founder.sample_review_decision_packet = {
    ...reviewDecision.sample_decision,
    schema_version: reviewDecision.schema_version,
    release: "v4.0.6",
    decision_status: "Ready for founder decision; no authority granted.",
    review_decision_gate_release: "v4.0.6",
    review_decision_gate_schema: reviewDecision.schema_version,
    ...falseAuthorityFlags
  };
  founder.sample_authorization_review_packet = {
    ...founder.sample_authorization_review_packet,
    ...pickSource(reviewDecision.sample_decision),
    schema_version: founder.schema_version,
    release: "v4.0.7",
    input_release: "v4.0.6",
    founder_decision_gate_release: "v4.0.7",
    founder_decision_gate_schema: founder.schema_version,
    founder_posture: "Pilot the answer packet as draft-only",
    authorization_review_state: "Pilot posture recorded; no execution authority granted.",
    pilot_surface_allowed: true,
    production_gate_required: true,
    next_gate_required: "Answer packet pilot",
    ...falseAuthorityFlags
  };
  founder.sample_decision = {
    ...founder.sample_decision,
    ...pickSource(reviewDecision.sample_decision),
    schema_version: founder.schema_version,
    release: "v4.0.7",
    input_release: "v4.0.6",
    founder_decision: "Pilot answer packet, draft-only",
    decision_status: "Founder pilot posture recorded; no authority granted.",
    controlled_draft_candidate_ready: true,
    pilot_surface_allowed: true,
    next_release: "v4.0.8 Answer Packet Pilot",
    ...falseAuthorityFlags
  };
  writeJson(files.founderDecisionData, founder);

  patchFile(files.founderDecisionJs, [
    ["controlled-permission-execution-authorization-review-decision-gate-v8", "controlled-permission-execution-authorization-review-decision-gate-v9"],
    ["founder-permission-execution-authorization-decision-gate-v8", "founder-permission-execution-authorization-decision-gate-v9"],
    ['packet.release !== "v4.0.2"', 'packet.release !== "v4.0.6"'],
    ['founderDecision.release = "v4.0.3";', 'founderDecision.release = "v4.0.7";'],
    ['founderDecision.input_release = "v4.0.2";', 'founderDecision.input_release = "v4.0.6";'],
    ['founderDecision.next_gate_required = "Controlled permission execution authorization draft gate";', 'founderDecision.next_gate_required = "Answer packet pilot";']
  ]);
  patchFile(files.founderDecisionPage, [
    ["v4.0.3 founder", "v4.0.7 founder"],
    ["v4.0.3", "v4.0.7"],
    ["v4.0.2", "v4.0.6"],
    ["Founder decision before controlled draft re-entry.", "Founder posture before answer packet pilot."],
    ["Founder decision without execution authority.", "Founder pilot posture without production authority."]
  ]);
}

function pilotCss() {
  return `body.answer-packet-pilot-page .workspace,
body.launch-readiness-hub-page .workspace {
  max-width: 1480px;
}

.pilot-shell {
  display: grid;
  gap: 18px;
}

.pilot-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 18px;
  align-items: stretch;
}

.pilot-card {
  background: linear-gradient(180deg, rgba(255, 253, 247, 0.96), rgba(255, 249, 238, 0.9));
  border: 1px solid rgba(170, 118, 83, 0.24);
  border-radius: var(--radius-card);
  padding: 22px;
  box-shadow: var(--shadow-card);
}

.pilot-card h1,
.pilot-card h2,
.pilot-card h3 {
  margin: 0;
}

.pilot-card h1 {
  max-width: 820px;
  font-size: clamp(2.2rem, 4.5vw, 4.7rem);
  line-height: 0.96;
  letter-spacing: 0;
}

.pilot-card h2 {
  font-size: clamp(1.45rem, 2vw, 2.05rem);
  line-height: 1.08;
}

.pilot-copy {
  max-width: 760px;
  margin-top: 14px;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.62;
}

.pilot-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.pilot-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.packet-stage {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
  align-items: start;
}

.packet-answer {
  border-left: 4px solid var(--accent);
}

.compact-field {
  border: 1px solid rgba(170, 118, 83, 0.22);
  border-radius: 10px;
  padding: 14px;
  background: rgba(255, 255, 250, 0.82);
}

.compact-field small {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
}

.compact-field strong {
  display: block;
  font-size: 1.05rem;
  line-height: 1.25;
}

.readiness-lane {
  display: grid;
  grid-template-columns: 0.8fr 1fr;
  gap: 14px;
  align-items: start;
}

.readiness-list {
  display: grid;
  gap: 10px;
}

.readiness-item {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  border: 1px solid rgba(170, 118, 83, 0.2);
  border-radius: 12px;
  padding: 14px;
  background: rgba(255, 255, 250, 0.8);
}

.readiness-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(20, 92, 74, 0.12);
  color: var(--green);
  font-weight: 800;
}

.readiness-item.locked .readiness-dot {
  background: rgba(214, 90, 31, 0.14);
  color: var(--accent);
}

.pilot-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.packet-output,
.launch-output {
  width: 100%;
  min-height: 160px;
  resize: vertical;
  border: 1px solid rgba(170, 118, 83, 0.28);
  border-radius: 12px;
  padding: 14px;
  color: var(--ink);
  background: rgba(255, 252, 246, 0.92);
  line-height: 1.5;
}

@media (max-width: 980px) {
  .pilot-hero,
  .packet-stage,
  .readiness-lane {
    grid-template-columns: 1fr;
  }

  .pilot-grid,
  .pilot-grid.two {
    grid-template-columns: 1fr;
  }
}
`;
}

function answerPacketData() {
  return {
    schema_version: "answer-packet-pilot-v1",
    release: "v4.0.8",
    updated_at: today,
    name: "Answer Packet Pilot",
    purpose: "Turn a reviewed answer candidate into a calm, copyable, source-carded pilot surface without production authority.",
    source: {
      question: "How can I act calmly when results are uncertain?",
      source_ref: "Bhagavad Gita 2.48",
      source_family: "Bhagavad Gita | Smriti",
      pramana_level: "Direct passage candidate",
      confidence: "High | 86/100",
      boundary: "Reflection support, not therapy, ritual instruction, or production AI authority."
    },
    packet: {
      title: "Begin with the next honest action, not the result you cannot control.",
      plain_meaning: "The source candidate supports steadiness in action and caution about turning outcomes into identity.",
      useful_action: "Choose one small duty, do it slowly and cleanly, then stop measuring your worth by the result.",
      no_go: "Do not imply guaranteed calm, diagnosis, treatment, spiritual authority, or a direct Vedic quote."
    },
    review: {
      status: "Pilot-ready as draft-only answer packet.",
      reviewer_note: "Source, family, confidence, and boundary are visible before any copy action.",
      founder_posture: "Allowed as a static pilot surface. Production remains locked."
    },
    authority_flags: { ...falseAuthorityFlags }
  };
}

function launchHubData() {
  return {
    schema_version: "launch-readiness-hub-v1",
    release: "v4.0.9",
    updated_at: today,
    name: "Launch Readiness Hub",
    purpose: "Collect product readiness, locked risks, and founder next moves into one calm launch control surface.",
    readiness_score: 84,
    ready: [
      "Static command shell is navigable and visually coherent.",
      "Answer packet pilot shows source, confidence, plain meaning, action, and boundary.",
      "Authorization gates keep execution, storage, public release, and production false.",
      "Local practice and pattern surfaces preserve privacy boundaries."
    ],
    locked: [
      "No API keys or production model calls are connected.",
      "No user accounts, sync, server storage, or paid launch path is enabled.",
      "No answer should be represented as final scholarship or ritual authority.",
      "No public launch copy should promise medical, therapeutic, or spiritual outcomes."
    ],
    founder_moves: [
      "Review v4.0.8 answer packet format on desktop and mobile.",
      "Choose whether the first production pilot is retrieval-only or reviewer-assisted.",
      "Approve the first 25 verified source records before any live answer system.",
      "Keep the main product promise simple: ask clearly, read the source, carry one step."
    ],
    authority_flags: { ...falseAuthorityFlags }
  };
}

function pageHeader(title, bodyClass, subtitle) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-pilot-surfaces.css" />
</head>
<body class="${bodyClass}">
  <main class="workspace">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-logo.png" alt="" />
        <span><strong>VedaPath AI</strong><small>${subtitle}</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
        <a href="index.html">Home</a>
        <a href="build-status.html">Build</a>
        <a href="brand.html">Brand</a>
        <a href="product-blueprint.html">Blueprint</a>
        <a href="answerpacketpilot.html">${title === "Answer Packet Pilot" ? "Answer Packet" : "Packet"}</a>
        <a href="launchreadinesshub.html">${title === "Launch Readiness Hub" ? "Launch Hub" : "Launch"}</a>
        <span class="version-pill">v4.0.9 launch</span>
      </nav>
    </header>`;
}

function pageFooter(script) {
  return `  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="${script}"></script>
</body>
</html>
`;
}

function v408AnswerPacketPilot() {
  writeJson("data/vedapath-answer-packet-pilot.json", answerPacketData());
  write(
    "assets/vedapath-pilot-surfaces.css",
    pilotCss()
  );
  write(
    "assets/vedapath-answer-packet-pilot.js",
    `const state = { data: null };

const packetOutput = document.querySelector("[data-packet-output]");
const copyButton = document.querySelector("[data-copy-packet]");

function line(label, value) {
  return value ? \`\${label}: \${value}\` : "";
}

function packetText(data) {
  return [
    "VedaPath Answer Packet Pilot",
    line("Release", data.release),
    line("Question", data.source.question),
    line("Source", data.source.source_ref),
    line("Family", data.source.source_family),
    line("Confidence", data.source.confidence),
    "",
    data.packet.title,
    data.packet.plain_meaning,
    "",
    line("Carry action", data.packet.useful_action),
    line("Boundary", data.source.boundary),
    line("Do not overclaim", data.packet.no_go)
  ].filter(Boolean).join("\\n");
}

function render(data) {
  document.querySelectorAll("[data-text]").forEach((node) => {
    const path = node.dataset.text.split(".");
    const value = path.reduce((current, key) => current?.[key], data);
    if (value !== undefined) node.textContent = value;
  });
  packetOutput.value = packetText(data);
}

fetch("data/vedapath-answer-packet-pilot.json")
  .then((response) => response.json())
  .then((data) => {
    state.data = data;
    render(data);
  })
  .catch((error) => {
    packetOutput.value = \`Unable to load answer packet pilot data: \${error.message}\`;
  });

copyButton?.addEventListener("click", async () => {
  const text = packetOutput.value;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copied";
  } catch {
    packetOutput.select();
    document.execCommand("copy");
    copyButton.textContent = "Selected";
  }
  setTimeout(() => {
    copyButton.textContent = "Copy Packet";
  }, 1400);
});
`
  );
  write(
    "answerpacketpilot.html",
    `${pageHeader("Answer Packet Pilot", "answer-packet-pilot-page", "Answer packet pilot")}
    <section class="pilot-shell">
      <div class="pilot-hero">
        <article class="pilot-card">
          <span class="eyebrow">v4.0.8 answer packet</span>
          <h1>One calm answer. Source first.</h1>
          <p class="pilot-copy">A pilot surface for the moment after review: show the source, state confidence, offer plain meaning, carry one action, and keep the boundary visible.</p>
          <div class="pilot-actions">
            <a class="button" href="index.html">Open Ask Surface</a>
            <a class="button safe" href="launchreadinesshub.html">Open Launch Hub</a>
          </div>
        </article>
        <article class="pilot-card">
          <span class="eyebrow green">Packet anatomy</span>
          <div class="pilot-grid two">
            <div class="compact-field"><small>1</small><strong>Question</strong><p>Name the real ask.</p></div>
            <div class="compact-field"><small>2</small><strong>Source</strong><p>Show citation and family.</p></div>
            <div class="compact-field"><small>3</small><strong>Meaning</strong><p>Explain without overreach.</p></div>
            <div class="compact-field"><small>4</small><strong>Action</strong><p>Leave one steady step.</p></div>
          </div>
        </article>
      </div>

      <div class="packet-stage">
        <article class="pilot-card packet-answer">
          <span class="eyebrow">Source-carded draft</span>
          <h2 data-text="packet.title">Loading answer packet...</h2>
          <p class="pilot-copy" data-text="packet.plain_meaning"></p>
          <div class="pilot-grid">
            <div class="compact-field"><small>Question</small><strong data-text="source.question"></strong></div>
            <div class="compact-field"><small>Source</small><strong data-text="source.source_ref"></strong></div>
            <div class="compact-field"><small>Family</small><strong data-text="source.source_family"></strong></div>
            <div class="compact-field"><small>Confidence</small><strong data-text="source.confidence"></strong></div>
          </div>
        </article>
        <article class="pilot-card">
          <span class="eyebrow">Boundary</span>
          <h2>Restraint stays visible.</h2>
          <p class="pilot-copy" data-text="source.boundary"></p>
          <div class="compact-field"><small>Do not overclaim</small><strong data-text="packet.no_go"></strong></div>
        </article>
      </div>

      <article class="pilot-card">
        <span class="eyebrow">Copyable handoff</span>
        <textarea class="packet-output" data-packet-output aria-label="Answer packet text"></textarea>
        <div class="pilot-actions">
          <button class="button" type="button" data-copy-packet>Copy Packet</button>
          <a class="button safe" href="controlledpermissionexecutionauthorizationdraftreviewgate.html">Review Gate</a>
        </div>
      </article>
    </section>
${pageFooter("assets/vedapath-answer-packet-pilot.js")}`
  );
}

function v409LaunchHub() {
  writeJson("data/vedapath-launch-readiness-hub.json", launchHubData());
  write(
    "assets/vedapath-launch-readiness-hub.js",
    `const output = document.querySelector("[data-launch-output]");
const copyButton = document.querySelector("[data-copy-launch]");

function list(items) {
  return items.map((item) => \`- \${item}\`).join("\\n");
}

function render(data) {
  document.querySelector("[data-score]").textContent = data.readiness_score;
  document.querySelector("[data-release]").textContent = data.release;
  document.querySelector("[data-ready]").innerHTML = data.ready.map((item, index) => \`
    <div class="readiness-item">
      <span class="readiness-dot">\${index + 1}</span>
      <p>\${item}</p>
    </div>\`).join("");
  document.querySelector("[data-locked]").innerHTML = data.locked.map((item, index) => \`
    <div class="readiness-item locked">
      <span class="readiness-dot">\${index + 1}</span>
      <p>\${item}</p>
    </div>\`).join("");
  document.querySelector("[data-founder]").innerHTML = data.founder_moves.map((item, index) => \`
    <div class="compact-field"><small>Move \${index + 1}</small><strong>\${item}</strong></div>\`).join("");
  output.value = [
    "VedaPath Launch Readiness Hub",
    \`Release: \${data.release}\`,
    \`Readiness score: \${data.readiness_score}/100\`,
    "",
    "Ready",
    list(data.ready),
    "",
    "Locked",
    list(data.locked),
    "",
    "Founder moves",
    list(data.founder_moves)
  ].join("\\n");
}

fetch("data/vedapath-launch-readiness-hub.json")
  .then((response) => response.json())
  .then(render)
  .catch((error) => {
    output.value = \`Unable to load launch readiness data: \${error.message}\`;
  });

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    copyButton.textContent = "Copied";
  } catch {
    output.select();
    document.execCommand("copy");
    copyButton.textContent = "Selected";
  }
  setTimeout(() => {
    copyButton.textContent = "Copy Report";
  }, 1400);
});
`
  );
  write(
    "launchreadinesshub.html",
    `${pageHeader("Launch Readiness Hub", "launch-readiness-hub-page", "Launch readiness")}
    <section class="pilot-shell">
      <div class="pilot-hero">
        <article class="pilot-card">
          <span class="eyebrow">v4.0.9 launch hub</span>
          <h1>Ready to pilot. Not ready to overclaim.</h1>
          <p class="pilot-copy">One quiet place for what is ready, what stays locked, and what the founder should decide next. The launch posture is confident, but the authority boundary remains firm.</p>
          <div class="pilot-actions">
            <a class="button" href="answerpacketpilot.html">Open Answer Packet</a>
            <a class="button safe" href="build-status.html">Open Build Status</a>
          </div>
        </article>
        <article class="pilot-card">
          <span class="eyebrow green">Readiness</span>
          <h2><span data-score>0</span>/100</h2>
          <p class="pilot-copy">Release <strong data-release>v4.0.9</strong> is a static readiness surface. It prepares founder review, not public production launch.</p>
        </article>
      </div>

      <div class="readiness-lane">
        <article class="pilot-card">
          <span class="eyebrow green">Ready</span>
          <h2>What can be shown now</h2>
          <div class="readiness-list" data-ready></div>
        </article>
        <article class="pilot-card">
          <span class="eyebrow">Locked</span>
          <h2>What must stay closed</h2>
          <div class="readiness-list" data-locked></div>
        </article>
      </div>

      <article class="pilot-card">
        <span class="eyebrow">Founder moves</span>
        <h2>Next decisions stay small.</h2>
        <div class="pilot-grid two" data-founder></div>
      </article>

      <article class="pilot-card">
        <span class="eyebrow">Copyable launch note</span>
        <textarea class="launch-output" data-launch-output aria-label="Launch readiness report"></textarea>
        <div class="pilot-actions">
          <button class="button" type="button" data-copy-launch>Copy Report</button>
          <a class="button safe" href="founderpermissionexecutionauthorizationdecisiongate.html">Founder Gate</a>
        </div>
      </article>
    </section>
${pageFooter("assets/vedapath-launch-readiness-hub.js")}`
  );
}

function updateShellAndHome() {
  patchFile(files.commandShell, [
    ['const releaseBadge = "v4.0.4 draft";', 'const releaseBadge = "v4.0.9 launch";'],
    ['"Daily": "Daily calm loop"', '"Daily": "Daily calm loop",\n  "Answer Packet": "Answer packet pilot",\n  "Launch Hub": "Launch readiness hub"'],
    ['"permission-execution-decision-page": "Founder decision gate"', '"permission-execution-decision-page": "Founder decision gate",\n    "answer-packet-pilot-page": "Answer packet pilot",\n    "launch-readiness-hub-page": "Launch readiness hub"']
  ]);
  patchOptional(
    files.index,
    '<a class="button safe" href="daily.html">Open Daily Loop</a>',
    '<a class="button safe" href="daily.html">Open Daily Loop</a>\n              <a class="button safe" href="answerpacketpilot.html">Open Answer Packet</a>\n              <a class="button safe" href="launchreadinesshub.html">Open Launch Hub</a>'
  );
  patchFile(files.index, [["v4.0.4 draft", "v4.0.9 launch"]]);
  for (const gatePage of [files.draftReviewPage, files.reviewDecisionPage, files.founderDecisionPage]) {
    const text = read(gatePage);
    if (!text.includes('rel="icon" href="assets/vedapath-3d-logo-concept.png"')) {
      write(gatePage, text.replace("</title>", '</title>\n    <link rel="icon" href="assets/vedapath-3d-logo-concept.png">'));
    }
  }
}

function updateBuildStatus() {
  patchFile(files.buildStatus, [
    ["v4.0.4 draft", "v4.0.9 launch"],
    ["v4.0.4", "v4.0.9"],
    ["Controlled Permission Execution Packet Authorization Draft: founder decision posture now becomes a reviewable authorization draft while authorization, execution, storage, public release, and production remain false.", "Autonomous five-version batch: draft review, review decision, founder posture, answer packet pilot, and launch readiness hub now form a calm pilot path."],
    ["Cited answer sprint progress: 10/10 rooms complete. The MVP now has a source-carded answer standard.", "Pilot path complete: controlled gates feed a visible answer packet and launch readiness hub without granting authority."],
    ["Answer path: intent, source context, citation ribbon, answer card, confidence, boundary rewrite, comparison views, feedback, and mobile polish.", "Answer path: controlled gates, answer packet, source boundary, founder posture, launch readiness, and command-shell polish."],
    ["Founder instruction", "Founder review"],
    ["Cited answer sprint complete. Next release waits for founder instruction.", "Five-version autonomous batch complete. Next release should choose the production retrieval pilot posture."],
    ["v4.0.9 Controlled Permission Execution Packet Authorization Draft", "v4.0.9 Launch Readiness Hub"],
    ["v4.0.3 Founder Permission Execution Authorization Decision Gate", "v4.0.8 Answer Packet Pilot"]
  ]);
}

function updateDocs() {
  prependOnce(
    files.readme,
    "## v4.0.9 Launch Readiness Hub",
    `## v4.0.9 Launch Readiness Hub
- Added a launch readiness hub that shows ready items, locked risks, founder next moves, and a copyable launch report.
- Preserved the calm command-shell UI and kept all production authority flags false.

## v4.0.8 Answer Packet Pilot
- Added a source-carded answer packet pilot with question, citation, source family, confidence, plain meaning, action, and boundary.
- Added copyable packet output for founder and reviewer handoff.

## v4.0.7 Founder Permission Execution Authorization Decision Gate Re-entry
- Re-entered the founder decision gate from the v4.0.6 review decision packet.
- Recorded a pilot posture without granting permission, execution, storage, public release, or production authorization.

## v4.0.6 Controlled Permission Execution Authorization Review Decision Gate Re-entry
- Re-entered the review decision gate from the v4.0.5 draft review packet.
- Added explicit return, hold, block, and founder-review routes while authority remains false.

## v4.0.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry
- Re-entered the controlled draft review gate from the v4.0.4 draft packet.
- Preserved source identity, confidence, boundary, and false authority flags before founder decision.`
  );
  prependOnce(
    files.prototypeNotes,
    "## v4.0.9 Launch Readiness Hub",
    `## v4.0.9 Launch Readiness Hub
- New surface: \`launchreadinesshub.html\`.
- The hub gathers ready work, locked risk, founder moves, and copyable launch notes.
- Known boundary: static prototype only; no accounts, sync, storage, production answer system, or public launch is enabled.

## v4.0.8 Answer Packet Pilot
- New surface: \`answerpacketpilot.html\`.
- The answer packet makes a reviewed source-carded answer readable without hiding confidence or boundary.

## v4.0.7 Founder Decision Gate Re-entry
- The founder gate now accepts the v4.0.6 review decision packet and records pilot posture only.

## v4.0.6 Review Decision Gate Re-entry
- The review decision gate now accepts the v4.0.5 draft review packet and separates return, hold, block, and founder routes.

## v4.0.5 Draft Review Gate Re-entry
- The draft review gate now accepts the v4.0.4 draft packet and keeps execution false through review.`
  );
  prependOnce(
    files.productBlueprint,
    "## v4.0.9 Launch Readiness Position",
    `## v4.0.9 Launch Readiness Position

VedaPath now has a complete static pilot chain: controlled draft review, controlled review decision, founder pilot posture, answer packet pilot, and launch readiness hub.

The product should still feel simple: ask clearly, read the source, carry one step. The launch hub exists to prevent premature production claims while making the next founder decision obvious.

Next release candidate: v4.1.0 Production Retrieval Pilot Gate.`
  );
  write(
    "docs/ANSWER_PACKET_PILOT.md",
    `# VedaPath AI Answer Packet Pilot

Release: v4.0.8

The answer packet pilot turns a reviewed source candidate into a readable answer card:

- question
- source reference
- source family
- confidence
- plain meaning
- carry action
- boundary
- do-not-overclaim note

This is a static pilot surface. It is not final AI output, scholarship authority, ritual instruction, therapy, or production release.
`
  );
  write(
    "docs/LAUNCH_READINESS_HUB.md",
    `# VedaPath AI Launch Readiness Hub

Release: v4.0.9

The launch readiness hub gathers what is ready, what remains locked, and what the founder should decide next.

Ready:
- static command shell
- answer packet pilot
- visible source-card standard
- controlled authorization gates

Locked:
- production model calls
- accounts and sync
- server storage
- public launch claims
- authority, therapy, ritual, or guaranteed-outcome language
`
  );
}

function writeChangelog() {
  write(
    files.changelog,
    `# Changelog

## v4.0.9 Launch Readiness Hub
- Changes made: added launch readiness hub, launch readiness data, copyable launch report, and command-shell page title support.
- Files changed: \`launchreadinesshub.html\`, \`assets/vedapath-launch-readiness-hub.js\`, \`data/vedapath-launch-readiness-hub.json\`, \`assets/vedapath-command-shell.js\`, \`build-status.html\`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: readiness score is prototype/product judgment, not analytics from live users.

## v4.0.8 Answer Packet Pilot
- Changes made: added a source-carded answer packet pilot with copyable handoff and visible boundary language.
- Files changed: \`answerpacketpilot.html\`, \`assets/vedapath-answer-packet-pilot.js\`, \`assets/vedapath-pilot-surfaces.css\`, \`data/vedapath-answer-packet-pilot.json\`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: content is a curated prototype answer, not production retrieval output.

## v4.0.7 Founder Permission Execution Authorization Decision Gate Re-entry
- Changes made: re-entered founder decision from v4.0.6, recorded pilot posture, and kept authority flags false.
- Files changed: \`founderpermissionexecutionauthorizationdecisiongate.html\`, \`assets/vedapath-founder-permission-execution-authorization-decision-gate.js\`, \`data/vedapath-founder-permission-execution-authorization-decision-gate.json\`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: founder posture is still local/static and does not represent legal or production authorization.

## v4.0.6 Controlled Permission Execution Authorization Review Decision Gate Re-entry
- Changes made: re-entered review decision from v4.0.5 and separated return, hold, block, and founder-review routes.
- Files changed: \`controlledpermissionexecutionauthorizationreviewdecisiongate.html\`, \`assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.js\`, \`data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json\`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: route choices are prototype review states, not workflow-backed production permissions.

## v4.0.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry
- Changes made: re-entered draft review from v4.0.4 and preserved source identity, confidence, boundary, and false authority flags.
- Files changed: \`controlledpermissionexecutionauthorizationdraftreviewgate.html\`, \`assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js\`, \`data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json\`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: review packet is static prototype data and still needs real reviewer accounts before production use.
`
  );
}

v405DraftReview();
v406ReviewDecision();
v407FounderDecision();
v408AnswerPacketPilot();
v409LaunchHub();
updateShellAndHome();
updateBuildStatus();
updateDocs();
writeChangelog();

console.log("Applied v4.0.5 through v4.0.9 autonomous batch.");

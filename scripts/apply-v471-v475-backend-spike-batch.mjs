import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const finalBadge = "v4.7.5 backend handoff";
const staticRisk = "Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.";
const checkCommand = "`node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA";

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
  ["Backend Ready", "backendreadinesscontrolroom.html"]
];

const releases = [
  {
    version: "v4.7.1",
    pageTitle: "Backend Spike Choice",
    activeLabel: "Backend Choice",
    href: "backendspikechoice.html",
    bodyClass: "backend-spike-choice-page",
    subtitle: "backend spike choice",
    dataFile: "data/vedapath-backend-spike-choice.json",
    docFile: "docs/BACKEND_SPIKE_CHOICE.md",
    eyebrow: "Backend spike",
    headline: "Choose one small backend path before adding power.",
    copy: "VedaPath now chooses a local Node Source API as the first backend spike because it keeps the source packet visible, deterministic, and private-demo safe.",
    changes: "Selects the first backend spike path and keeps serverless, production corpus, accounts, telemetry, payments, and public launch explicitly closed.",
    data: {
      position: "Local Node Source API first; production launch still closed",
      headline: "The next backend move is deliberately small.",
      copy: "The spike should prove source packet shape, no-source behavior, and local demo flow before any live retrieval or AI generation is allowed.",
      postures: [
        posture("Local Node API", "Allowed", "Fastest way to wrap the existing source stub without changing the GitHub Pages product."),
        posture("Serverless function", "Later", "Useful after packet contracts are stable and deployment secrets are defined."),
        posture("Separate service repo", "Later", "Too much structure before the source packet contract is proven."),
        posture("Live AI answers", "Blocked", "No generated answer pipeline opens in this batch."),
        posture("Public launch", "Blocked", "Rights, privacy, reviewer operations, security, and support still need real systems.")
      ],
      flow: [
        step("Pick", "Use the local Node Source API spike."),
        step("Wrap", "Expose health, source, and fixture endpoints."),
        step("Test", "Assert every packet field before UI integration."),
        step("Demo", "Run the private handoff with launch locks visible.")
      ],
      decisions: [
        decision("Backend path", "Local Node Source API", "It protects simplicity and avoids premature infrastructure."),
        decision("Storage", "None", "The spike returns packets; it does not store users, reviewers, or telemetry."),
        decision("Corpus", "Fixture only", "Reviewed fixture records remain the only source set."),
        decision("Launch", "Blocked", "Private demo readiness is not public launch readiness.")
      ],
      metrics: metrics("1", "0", "5", "Local API"),
      locks: locks("No account, payment, live model, telemetry, or licensed corpus path opens here."),
      packet: "Backend Spike Choice v4.7.1\nDecision: local Node Source API first.\nReason: prove source packet shape before real retrieval or AI generation.\nBlocked: public launch, production storage, accounts, payments, live model calls, licensed corpus delivery."
    }
  },
  {
    version: "v4.7.2",
    pageTitle: "Local Source API Server",
    activeLabel: "Local API",
    href: "localsourceapiserver.html",
    bodyClass: "local-source-api-server-page",
    subtitle: "local source api server",
    dataFile: "data/vedapath-local-source-api-server.json",
    docFile: "docs/LOCAL_SOURCE_API_SERVER.md",
    eyebrow: "Local API",
    headline: "Serve source packets locally before serving answers.",
    copy: "A tiny Node HTTP server now exposes health, fixture, and source endpoints over the same deterministic source packet model.",
    changes: "Adds a local Node Source API server script with health, fixture, GET source, POST source, JSON, CORS, and explicit no-storage posture.",
    data: {
      position: "Private local API, not production service",
      headline: "The source stub can now answer through HTTP.",
      copy: "This gives the team a demoable backend boundary without changing the static site or pretending a real corpus service exists.",
      postures: [
        posture("GET /health", "Ready", "Returns service, version, fixture count, and launch/storage posture."),
        posture("GET /source", "Ready", "Accepts q or question and returns the source packet."),
        posture("POST /source", "Ready", "Accepts JSON with a question for future UI adapters."),
        posture("GET /fixtures", "Ready", "Shows local fixture questions and records for demo visibility."),
        posture("Persistence", "Blocked", "The server stores nothing.")
      ],
      flow: [
        step("Start", "Run node scripts/vedapath-local-source-api-server.mjs --port 8787."),
        step("Health", "Check /health before any source request."),
        step("Source", "Ask /source?q=What scripture did Oppenheimer quote?"),
        step("Stop", "Close the process after the private demo.")
      ],
      decisions: [
        decision("Runtime", "Node HTTP", "No framework dependency is needed for the first spike."),
        decision("Data", "Existing fixture records", "The source packet contract stays stable."),
        decision("CORS", "Local demo only", "Allowed for browser adapter testing, not production policy."),
        decision("Persistence", "None", "No file or account writes are performed.")
      ],
      metrics: metrics("3", "2", "0", "Server tests"),
      locks: locks("The local server is a demo harness, not a hosted API or production trust boundary."),
      packet: "Local Source API Server v4.7.2\nRun: node scripts/vedapath-local-source-api-server.mjs --port 8787\nEndpoints: /health, /fixtures, /source?q=..., POST /source.\nBoundary: no storage, no live AI, no public launch."
    }
  },
  {
    version: "v4.7.3",
    pageTitle: "Source Packet Contract Tests",
    activeLabel: "Packet Tests",
    href: "sourcepacketcontracttests.html",
    bodyClass: "source-packet-contract-tests-page",
    subtitle: "source packet contract tests",
    dataFile: "data/vedapath-source-packet-contract-tests.json",
    docFile: "docs/SOURCE_PACKET_CONTRACT_TESTS.md",
    eyebrow: "Packet tests",
    headline: "Do not trust a backend until the packet shape holds.",
    copy: "The new contract checker starts the local API in-process and verifies health, GET source, POST source, no-source behavior, fixture suite results, and handoff packet text.",
    changes: "Adds a backend spike contract test that validates source packet fields, local API responses, fixture outcomes, command shell links, static links, and handoff script output.",
    data: {
      position: "Contract tests before integration",
      headline: "The backend spike now has measurable acceptance checks.",
      copy: "Every useful backend step must keep citation, family, confidence, reviewer state, rights state, boundary, and no-source behavior intact.",
      postures: [
        posture("Health contract", "Ready", "Server identifies service, version, storage, and launch posture."),
        posture("GET packet", "Ready", "Oppenheimer returns Bhagavad Gita 11.32 with category boundary."),
        posture("POST packet", "Ready", "Unsupported overclaims return no-source behavior."),
        posture("Fixture suite", "Ready", "Existing six-question suite still passes."),
        posture("UI links", "Ready", "New release rooms are in static link checks and command shell navigation.")
      ],
      flow: [
        step("Syntax", "Check every new script before execution."),
        step("API", "Start and stop the server inside the test."),
        step("Packet", "Assert required source packet fields."),
        step("Evidence", "Verify docs, pages, JSON, links, and handoff text.")
      ],
      decisions: [
        decision("Required fields", "Locked", "Trace, query, source, citation, family, confidence, states, boundary, and next action."),
        decision("No-source", "Required", "Unsupported modern claims must refuse politely."),
        decision("Fixture regression", "Required", "The previous backend prototype suite remains in the check chain."),
        decision("Visual QA", "Required", "Frontend pages still need browser review after the batch.")
      ],
      metrics: metrics("10+", "6", "0", "Visual QA"),
      locks: locks("A passing local contract is not production reliability, security, or rights approval."),
      packet: "Source Packet Contract Tests v4.7.3\nRequired: health, GET source, POST source, source packet fields, no-source fallback, fixture suite, static links, command shell labels.\nBoundary: tests prove prototype behavior only."
    }
  },
  {
    version: "v4.7.4",
    pageTitle: "Local API Adapter Fallback",
    activeLabel: "API Adapter",
    href: "localapiadapterfallback.html",
    bodyClass: "local-api-adapter-fallback-page",
    subtitle: "local api adapter fallback",
    dataFile: "data/vedapath-local-api-adapter-fallback.json",
    docFile: "docs/LOCAL_API_ADAPTER_FALLBACK.md",
    eyebrow: "UI adapter",
    headline: "The browser may ask locally, but it must fall back calmly.",
    copy: "A small browser adapter defines how future UI screens can call the local Source API and return a safe static fallback when the server is unavailable.",
    changes: "Adds a browser-safe local API adapter with timeout, GET source request construction, unavailable fallback packet, and no automatic production integration.",
    data: {
      position: "Adapter pattern only; static site remains stable",
      headline: "VedaPath now has a safe bridge from UI to local backend.",
      copy: "The adapter proves how the frontend can ask a local source server without breaking GitHub Pages or hiding the boundary when the server is absent.",
      postures: [
        posture("Request builder", "Ready", "Builds a /source?question=... URL from a local API base."),
        posture("Timeout", "Ready", "Fails quickly so the interface does not feel stuck."),
        posture("Fallback packet", "Ready", "Returns source_found false with a clear local-server-unavailable reason."),
        posture("Static site", "Protected", "No page depends on the local API to render."),
        posture("Production", "Blocked", "No hosted endpoint or secret-bearing integration exists.")
      ],
      flow: [
        step("Detect", "Only call the local API when a base URL is supplied."),
        step("Ask", "Fetch one source packet with a short timeout."),
        step("Fallback", "Show unavailable state instead of inventing a source."),
        step("Surface", "Keep the user-facing boundary visible.")
      ],
      decisions: [
        decision("Default base", "http://127.0.0.1:8787", "Useful for private demos, not public web use."),
        decision("Timeout", "1500ms", "Fast enough for UI confidence without masking a missing server."),
        decision("Fallback", "No-source packet", "The UI should never fabricate retrieval."),
        decision("Integration", "Manual later", "The adapter is present but not wired as a dependency.")
      ],
      metrics: metrics("1", "1", "0", "Handoff"),
      locks: locks("The adapter is not a remote API client, account layer, telemetry pipe, or launch integration."),
      packet: "Local API Adapter Fallback v4.7.4\nUse: window.VedaPathLocalApiAdapter.querySourcePacket(question, { baseUrl: 'http://127.0.0.1:8787' })\nFallback: local-server-unavailable no-source packet.\nBoundary: no production endpoint is configured."
    }
  },
  {
    version: "v4.7.5",
    pageTitle: "Private Demo Backend Handoff",
    activeLabel: "Backend Handoff",
    href: "privatedemobackendhandoff.html",
    bodyClass: "private-demo-backend-handoff-page",
    subtitle: "private demo backend handoff",
    dataFile: "data/vedapath-private-demo-backend-handoff.json",
    docFile: "docs/PRIVATE_DEMO_BACKEND_HANDOFF.md",
    eyebrow: "Backend handoff",
    headline: "A private demo can show the backend path without pretending launch.",
    copy: "The handoff packet combines local API run steps, test expectations, demo script, risk locks, and founder decision criteria for the next backend move.",
    changes: "Adds a private demo backend handoff script, handoff room, docs, build status update, homepage strip, command shell links, and final batch changelog.",
    data: {
      position: "Private demo handoff, not public launch",
      headline: "The backend spike now has a founder-readable demo packet.",
      copy: "This release turns the local API, contract tests, adapter fallback, and launch locks into a single handoff that a founder can run and review.",
      postures: [
        posture("Demo script", "Ready", "Run server, call health, call source, run contract checks, review locks."),
        posture("Handoff packet", "Ready", "Script outputs the next decision and boundaries."),
        posture("UI fallback", "Ready", "The product can explain missing local API safely."),
        posture("Production backend", "Review", "Next choice is the smallest real service slice."),
        posture("Public launch", "Blocked", "Still requires rights, privacy, security, support, reviewer operations, and real corpus controls.")
      ],
      flow: [
        step("Prepare", "Run contract tests from a clean worktree."),
        step("Demo", "Start the local API and ask two source questions."),
        step("Review", "Check packet fields and fallback behavior."),
        step("Decide", "Approve or reject a real backend spike scope.")
      ],
      decisions: [
        decision("Private demo", "Ready", "Useful for founder review of source packet behavior."),
        decision("Backend spike", "Next", "Choose Node route, serverless route, or hosted prototype after review."),
        decision("Launch readiness", "No", "This remains pre-launch evidence."),
        decision("Trust posture", "Source first", "No answer should appear without visible source or visible no-source reason.")
      ],
      metrics: metrics("5", "1", "5", "Founder gate"),
      locks: locks("Do not demo this as real AI, real corpus retrieval, therapeutic help, spiritual authority, or production software."),
      packet: "Private Demo Backend Handoff v4.7.5\nReady: local API server, contract tests, browser fallback adapter, handoff packet, release room.\nRun: node scripts/check-v471-v475-backend-spike.mjs\nDemo server: node scripts/vedapath-local-source-api-server.mjs --port 8787\nDecision needed: approve smallest real backend slice or continue local fixture hardening.\nLaunch: blocked."
    }
  }
];

function fp(file) {
  return path.join(root, file);
}

function read(file) {
  return readFileSync(fp(file), "utf8");
}

function write(file, content) {
  writeFileSync(fp(file), content, "utf8");
}

function posture(title, decisionText, copy) {
  return { title, decision: decisionText, copy };
}

function step(title, copy) {
  return { title, copy };
}

function decision(label, value, reason) {
  return { label, value, reason };
}

function metrics(endpoints, scripts, storage, next) {
  return [
    { label: "Endpoints", value: endpoints },
    { label: "Scripts", value: scripts },
    { label: "Storage writes", value: storage },
    { label: "Next", value: next }
  ];
}

function locks(extra) {
  return [
    { title: "Live AI lock", copy: "No live model call is enabled by this release." },
    { title: "Storage lock", copy: "No durable user, reviewer, telemetry, or account storage is created." },
    { title: "Rights lock", copy: "No licensed source text delivery is assumed." },
    { title: "Authority lock", copy: "VedaPath remains source-backed study and reflection support, not a guru or clinician." },
    { title: "Launch lock", copy: extra }
  ];
}

function navHtml(activeLabel) {
  return navLinks.map(([label, href]) => {
    const active = label === activeLabel ? " active" : "";
    return `        <a class="link${active}" href="${href}">${label}</a>`;
  }).join("\n");
}

function pageTemplate(item) {
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
${navHtml(item.activeLabel)}
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

    <section data-retrieval-app data-kind="gate" data-data-file="${item.dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-retrieval-pilot.js"></script>
  ${item.version === "v4.7.4" ? '<script src="assets/vedapath-local-api-adapter.js"></script>' : ""}
</body>
</html>
`;
}

function docTemplate(item) {
  return `# ${item.version} ${item.pageTitle}

## Purpose

${item.copy}

## What Changed

${item.changes}

## Demo Boundary

${staticRisk}

## Acceptance Checks

${checkCommand}

## Founder Packet

\`\`\`text
${item.data.packet}
\`\`\`
`;
}

function sourceApiServerModule() {
  return `import http from "node:http";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fixtureQueries, querySource, sourceRecords } from "./vedapath-source-api-stub.mjs";

const serviceVersion = "v4.7.2";

function json(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function healthPayload() {
  return {
    ok: true,
    service: "vedapath-local-source-api",
    version: serviceVersion,
    fixtures: fixtureQueries.length,
    records: sourceRecords.length,
    storage: "none",
    launch: "blocked",
    authority: "source packet prototype only"
  };
}

export function createLocalSourceApiServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") {
        json(res, 204, {});
        return;
      }

      const url = new URL(req.url || "/", "http://127.0.0.1");

      if (req.method === "GET" && url.pathname === "/health") {
        json(res, 200, healthPayload());
        return;
      }

      if (req.method === "GET" && url.pathname === "/fixtures") {
        json(res, 200, {
          service: "vedapath-local-source-api",
          records: sourceRecords.map((record) => ({
            id: record.id,
            citation: record.citation,
            family: record.family,
            status: record.status,
            boundary: record.boundary
          })),
          queries: fixtureQueries
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/source") {
        const question = url.searchParams.get("question") || url.searchParams.get("q") || "";
        json(res, 200, querySource(question));
        return;
      }

      if (req.method === "POST" && url.pathname === "/source") {
        const body = await readBody(req);
        const parsed = body ? JSON.parse(body) : {};
        json(res, 200, querySource(parsed.question || parsed.q || ""));
        return;
      }

      json(res, 404, {
        ok: false,
        error: "not_found",
        allowed: ["/health", "/fixtures", "/source?q=..."]
      });
    } catch (error) {
      json(res, 500, {
        ok: false,
        error: "local_source_api_error",
        message: error.message
      });
    }
  });
}

export function startLocalSourceApiServer(options = {}) {
  const host = options.host || "127.0.0.1";
  const port = Number(options.port || process.env.PORT || 8787);
  const server = createLocalSourceApiServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve({ server, host, port: server.address().port });
    });
  });
}

function cliOptions(argv) {
  const portIndex = argv.indexOf("--port");
  const hostIndex = argv.indexOf("--host");
  return {
    port: portIndex >= 0 ? argv[portIndex + 1] : process.env.PORT || 8787,
    host: hostIndex >= 0 ? argv[hostIndex + 1] : "127.0.0.1"
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = cliOptions(process.argv.slice(2));
  const { host, port } = await startLocalSourceApiServer(options);
  console.log("vedapath-local-source-api listening http://" + host + ":" + port);
  console.log("boundary: private demo only; no storage, accounts, payments, public launch, or live AI");
}
`;
}

function adapterModule() {
  return `(function () {
  const defaultBaseUrl = "http://127.0.0.1:8787";

  function traceId(question) {
    const slug = String(question || "query").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "query";
    return "vp-browser-" + slug;
  }

  function buildSourceUrl(question, options) {
    const baseUrl = (options && options.baseUrl) || defaultBaseUrl;
    const url = new URL("/source", baseUrl);
    url.searchParams.set("question", String(question || ""));
    return url.toString();
  }

  function fallbackPacket(question, reason) {
    return {
      trace_id: traceId(question),
      query: String(question || ""),
      source_found: false,
      primary_source_id: null,
      citation: "No local source response",
      family: "Local API unavailable",
      confidence: 0,
      reviewer_state: "unavailable",
      rights_state: "not-requested",
      answer_boundary: "Do not answer from memory when the local Source API is unavailable.",
      summary: "The local source server did not return a packet. Keep the UI calm and show the boundary.",
      no_source_reason: reason || "local-server-unavailable",
      next_action: "start local source api or use static fixture view"
    };
  }

  function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, timeoutMs || 1500);
    return fetch(url, { signal: controller.signal, cache: "no-store" }).finally(function () {
      clearTimeout(timer);
    });
  }

  async function querySourcePacket(question, options) {
    const settings = options || {};
    try {
      const response = await fetchWithTimeout(buildSourceUrl(question, settings), settings.timeoutMs || 1500);
      if (!response.ok) throw new Error("local api status " + response.status);
      return await response.json();
    } catch (error) {
      return fallbackPacket(question, error.name === "AbortError" ? "local-api-timeout" : "local-server-unavailable");
    }
  }

  window.VedaPathLocalApiAdapter = {
    buildSourceUrl: buildSourceUrl,
    fallbackPacket: fallbackPacket,
    querySourcePacket: querySourcePacket
  };
})();
`;
}

function handoffModule() {
  return `import { fileURLToPath } from "node:url";
import path from "node:path";
import { runFixtureSuite } from "./vedapath-retrieval-fixture-cli.mjs";

export function buildBackendHandoffPacket() {
  const suite = runFixtureSuite();
  return {
    release: "v4.7.5 Private Demo Backend Handoff",
    readiness: suite.failed === 0 ? "ready for private founder demo" : "blocked by fixture failure",
    checks: {
      fixtureTotal: suite.total,
      fixturePassed: suite.passed,
      fixtureFailed: suite.failed,
      localServer: "run node scripts/vedapath-local-source-api-server.mjs --port 8787",
      contract: "run node scripts/check-v471-v475-backend-spike.mjs"
    },
    demoSteps: [
      "Run contract checks from a clean worktree.",
      "Start the local Source API server.",
      "Call /health and /source with one approved source and one no-source claim.",
      "Show the browser fallback adapter boundary.",
      "Ask founder to approve the smallest real backend slice or keep hardening fixtures."
    ],
    launchLocks: [
      "No live AI generation.",
      "No production corpus delivery.",
      "No durable account, reviewer, telemetry, or payment storage.",
      "No therapeutic, ritual, legal, medical, or spiritual authority.",
      "No public launch until rights, privacy, security, support, and reviewer operations are real."
    ]
  };
}

export function formatBackendHandoffPacket(packet = buildBackendHandoffPacket()) {
  return [
    packet.release,
    "Readiness: " + packet.readiness,
    "Fixtures: " + packet.checks.fixturePassed + "/" + packet.checks.fixtureTotal + " passed",
    "Local server: " + packet.checks.localServer,
    "Contract: " + packet.checks.contract,
    "Demo steps:",
    ...packet.demoSteps.map((step, index) => (index + 1) + ". " + step),
    "Launch locks:",
    ...packet.launchLocks.map((lock) => "- " + lock)
  ].join("\\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const packet = buildBackendHandoffPacket();
  console.log(formatBackendHandoffPacket(packet));
  if (packet.checks.fixtureFailed) process.exit(1);
}
`;
}

function checkModule() {
  return `import { existsSync, readFileSync } from "node:fs";
import { createLocalSourceApiServer } from "./vedapath-local-source-api-server.mjs";
import { runFixtureSuite } from "./vedapath-retrieval-fixture-cli.mjs";
import { buildBackendHandoffPacket } from "./vedapath-private-demo-backend-handoff.mjs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const files = ${JSON.stringify(releases.map((item) => ({
    page: item.href,
    data: item.dataFile,
    doc: item.docFile,
    label: item.activeLabel
  })), null, 2)};

for (const item of files) {
  assert(existsSync(item.page), item.page + " missing");
  assert(existsSync(item.data), item.data + " missing");
  assert(existsSync(item.doc), item.doc + " missing");
  const page = readFileSync(item.page, "utf8");
  assert(page.includes(item.data), item.page + " missing data binding");
  assert(page.includes("assets/vedapath-command-shell.js"), item.page + " missing command shell");
  assert(page.includes('href="index.html#top"'), item.page + " missing home logo link");
  const data = JSON.parse(readFileSync(item.data, "utf8"));
  for (const key of ["position", "headline", "copy", "postures", "flow", "decisions", "metrics", "locks", "packet"]) {
    assert(Object.prototype.hasOwnProperty.call(data, key), item.data + " missing " + key);
  }
}

const commandShell = readFileSync("assets/vedapath-command-shell.js", "utf8");
for (const item of files) {
  assert(commandShell.includes(item.label), "command shell missing " + item.label);
}
assert(commandShell.includes("${finalBadge}"), "command shell release badge not updated");
assert(commandShell.includes("Backend Spike"), "command shell missing Backend Spike group");

const staticLinks = readFileSync("scripts/check-static-links.mjs", "utf8");
for (const item of files) {
  assert(staticLinks.includes(item.page), "static link checker missing " + item.page);
}

const adapter = readFileSync("assets/vedapath-local-api-adapter.js", "utf8");
assert(adapter.includes("VedaPathLocalApiAdapter"), "browser adapter global missing");
assert(adapter.includes("local-server-unavailable"), "browser adapter fallback reason missing");

const suite = runFixtureSuite();
assert(suite.failed === 0, "fixture suite failed");

const server = createLocalSourceApiServer();
const address = await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => resolve(server.address()));
});

try {
  const baseUrl = "http://127.0.0.1:" + address.port;
  const health = await fetch(baseUrl + "/health").then((response) => response.json());
  assert(health.ok === true, "health not ok");
  assert(health.storage === "none", "health must declare no storage");
  assert(health.launch === "blocked", "health must keep launch blocked");

  const getPacket = await fetch(baseUrl + "/source?q=What%20scripture%20did%20Oppenheimer%20quote%3F").then((response) => response.json());
  assert(getPacket.citation === "Bhagavad Gita 11.32", "GET source did not return Gita citation");
  assert(getPacket.source_found === true, "GET source should find source");
  for (const key of ["trace_id", "query", "primary_source_id", "family", "confidence", "reviewer_state", "rights_state", "answer_boundary", "next_action"]) {
    assert(Object.prototype.hasOwnProperty.call(getPacket, key), "GET packet missing " + key);
  }

  const postPacket = await fetch(baseUrl + "/source", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "Did the Vedas predict bitcoin?" })
  }).then((response) => response.json());
  assert(postPacket.source_found === false, "POST no-source should not find source");
  assert(postPacket.no_source_reason, "POST no-source reason missing");
} finally {
  await new Promise((resolve) => server.close(resolve));
}

const handoff = buildBackendHandoffPacket();
assert(handoff.readiness.includes("private founder demo"), "handoff readiness missing");
assert(handoff.launchLocks.length >= 5, "handoff launch locks missing");

console.log("backend-spike-ok v4.7.1-v4.7.5");
`;
}

function writeReleaseFiles() {
  for (const item of releases) {
    write(item.href, pageTemplate(item));
    write(item.dataFile, JSON.stringify(item.data, null, 2) + "\n");
    write(item.docFile, docTemplate(item));
    verifyVersion(item);
  }
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "[^"]+";/, `const releaseBadge = "${finalBadge}";`);

  if (!text.includes('title: "Backend Spike"')) {
    text = text.replace(
      '{ title: "Backend Prototype", labels: ["Backend Gate", "Source Stub", "Retrieval CLI", "Demo Ledger", "Backend Ready"] }',
      '{ title: "Backend Prototype", labels: ["Backend Gate", "Source Stub", "Retrieval CLI", "Demo Ledger", "Backend Ready"] },\n    { title: "Backend Spike", labels: ["Backend Choice", "Local API", "Packet Tests", "API Adapter", "Backend Handoff"] }'
    );
  }

  const titleAdditions = [
    ['"Backend Choice": "Backend Spike Choice"', '"Backend Ready": "Backend Readiness Control Room"'],
    ['"Local API": "Local Source API Server"', '"Backend Choice": "Backend Spike Choice"'],
    ['"Packet Tests": "Source Packet Contract Tests"', '"Local API": "Local Source API Server"'],
    ['"API Adapter": "Local API Adapter Fallback"', '"Packet Tests": "Source Packet Contract Tests"'],
    ['"Backend Handoff": "Private Demo Backend Handoff"', '"API Adapter": "Local API Adapter Fallback"']
  ];
  for (const [addition, anchor] of titleAdditions) {
    if (!text.includes(addition)) text = text.replace(anchor, `${anchor},\n    ${addition}`);
  }

  const bodyAdditions = releases.map((item) => [`"${item.bodyClass}": "${item.pageTitle}"`, item.bodyClass]).map(([addition]) => addition);
  for (const addition of bodyAdditions) {
    if (!text.includes(addition)) {
      text = text.replace(
        '"backend-readiness-control-room-page": "Backend Readiness Control Room"',
        `"backend-readiness-control-room-page": "Backend Readiness Control Room",\n    ${addition}`
      );
    }
  }

  const linkAdditions = releases.map((item) => `    ["${item.activeLabel}", "${item.href}"]`);
  for (const addition of linkAdditions) {
    if (!text.includes(addition.trim())) {
      text = text.replace('    ["Backend Ready", "backendreadinesscontrolroom.html"]', `    ["Backend Ready", "backendreadinesscontrolroom.html"],\n${addition}`);
    }
  }

  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  const additions = releases.map((item) => `  "${item.href}"`);
  for (const addition of additions) {
    if (!text.includes(addition.trim().replace(/"/g, ""))) {
      text = text.replace(/\n\];\n\nconst missing/, `,\n${addition}\n];\n\nconst missing`);
    }
  }
  write("scripts/check-static-links.mjs", text);
}

function replaceSummaryTile(text, label, value, copy) {
  const pattern = new RegExp(`(<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>([\\s\\S]*?<p>)[\\s\\S]*?(<\\/p>)`);
  return text.replace(pattern, `$1<strong>${value}</strong>$2${copy}$3`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = replaceSummaryTile(text, "Current version", "v4.7.5", "Private Demo Backend Handoff completes the local backend spike chain: choice, local API server, packet tests, browser fallback adapter, and handoff packet.");
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now has a small backend path that can be run, checked, and demonstrated privately without opening launch.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "The product is closer to real backend readiness, but production service, rights, security, reviewer ops, and privacy systems remain.");
  text = replaceSummaryTile(text, "Next release", "v4.7.6 Backend Spike Review Gate", "Review the private demo evidence and choose the smallest production-grade backend slice.");
  text = text.replace(
    /<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/,
    `<div class="version-row"><span>Release</span><strong>v4.7.5 Private Demo Backend Handoff</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.7.4 Local API Adapter Fallback</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make the first backend spike demoable, testable, and bounded before production work begins.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for backend spike review gate</strong></div>`
  );
  if (!text.includes("Review the local Source API demo output.")) {
    text = text.replace(
      /<h2>Next Build Checklist<\/h2>\s*<ul class="checklist">[\s\S]*?<\/ul>/,
      `<h2>Next Build Checklist</h2>
          <ul class="checklist">
            <li><span class="dot"></span><span>Review the local Source API demo output.</span></li>
            <li><span class="dot"></span><span>Choose production backend slice: Node service, serverless route, or hosted prototype.</span></li>
            <li><span class="dot"></span><span>Keep real corpus, accounts, telemetry, payment, and public launch closed until reviewed.</span></li>
            <li><span class="dot"></span><span>Convert handoff packet into implementation acceptance criteria.</span></li>
          </ul>`
    );
  }
  write("build-status.html", text);
}

function updateIndex() {
  let text = read("index.html");
  text = text.replace(/<span class="version-pill">[^<]+<\/span>/g, `<span class="version-pill">${finalBadge}</span>`);
  text = text.replace(/<span class="version">v[0-9][^<]+<\/span>/g, `<span class="version">${finalBadge}</span>`);
  if (!text.includes("V471-V475 BACKEND SPIKE STRIP START")) {
    const strip = `

      <!-- V471-V475 BACKEND SPIKE STRIP START -->
      <article class="rp-card rp-span" aria-label="Backend spike handoff">
        <span class="rp-eyebrow green">v4.7.5 backend handoff</span>
        <h2>Let the backend prove the source before it serves the answer.</h2>
        <p>The next layer keeps VedaPath calm and honest: local Source API, packet contract checks, browser fallback, and a private demo handoff before any production backend opens.</p>
        <div class="rp-flow">
          <article class="rp-flow-step"><span class="rp-number">1</span><h3>Choose</h3><p>Pick the smallest backend spike.</p><a class="rp-button green" href="backendspikechoice.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">2</span><h3>Serve</h3><p>Run a local Source API.</p><a class="rp-button green" href="localsourceapiserver.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">3</span><h3>Test</h3><p>Validate source packets.</p><a class="rp-button green" href="sourcepacketcontracttests.html">Open</a></article>
          <article class="rp-flow-step"><span class="rp-number">4</span><h3>Handoff</h3><p>Demo privately, launch locked.</p><a class="rp-button green" href="privatedemobackendhandoff.html">Open</a></article>
        </div>
      </article>
      <!-- V471-V475 BACKEND SPIKE STRIP END -->
`;
    const anchor = "<!-- V466-V470 HOME STRIP END -->";
    text = text.includes(anchor) ? text.replace(anchor, `${anchor}${strip}`) : text.replace("</main>", `${strip}\n</main>`);
  }
  write("index.html", text);
}

function changelogEntry(item) {
  const files = [
    item.href,
    item.dataFile,
    item.docFile,
    "scripts/vedapath-local-source-api-server.mjs",
    "assets/vedapath-local-api-adapter.js",
    "scripts/vedapath-private-demo-backend-handoff.mjs",
    "scripts/check-v471-v475-backend-spike.mjs",
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

${item.copy}

- Open: [${item.pageTitle}](${item.href})
- Data: \`${item.dataFile}\`
- Boundary: ${staticRisk}
`;
}

function updateDocs() {
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## v4.7.5 Private Demo Backend Handoff")) {
    changelog = `${releases.map(changelogEntry).join("\n")}\n${changelog}`;
  }
  write("CHANGELOG.md", changelog);

  let readme = read("README.md");
  if (!readme.includes("## v4.7.5 Private Demo Backend Handoff")) {
    readme = `${releases.map(readmeEntry).join("\n")}\n${readme}`;
  }
  write("README.md", readme);
}

function verifyVersion(item) {
  if (!existsSync(fp(item.href))) throw new Error(`${item.href} missing`);
  if (!existsSync(fp(item.dataFile))) throw new Error(`${item.dataFile} missing`);
  const page = read(item.href);
  if (!page.includes(item.dataFile)) throw new Error(`${item.href} missing data file`);
  if (!page.includes("assets/vedapath-command-shell.js")) throw new Error(`${item.href} missing command shell`);
  if (!page.includes('href="index.html#top"')) throw new Error(`${item.href} missing home logo link`);
  const data = JSON.parse(read(item.dataFile));
  if (!Array.isArray(data.flow) || data.flow.length < 4) throw new Error(`${item.dataFile} flow too short`);
  console.log(`${item.version} checks ok`);
}

writeReleaseFiles();
write("scripts/vedapath-local-source-api-server.mjs", sourceApiServerModule());
write("assets/vedapath-local-api-adapter.js", adapterModule());
write("scripts/vedapath-private-demo-backend-handoff.mjs", handoffModule());
write("scripts/check-v471-v475-backend-spike.mjs", checkModule());
updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateIndex();
updateDocs();

console.log("v4.7.1-v4.7.5 backend spike batch applied");

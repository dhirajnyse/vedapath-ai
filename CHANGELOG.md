## v4.8.1 Source Path Readiness Console

- Changes made: Adds an end-to-end source path checker and founder-readable readiness console covering success, refusal, validation, search, UI integration, legacy regressions, and launch locks.
- Files changed: 'sourcepathreadinessconsole.html', 'data/vedapath-source-path-readiness-console.json', 'docs/SOURCE_PATH_READINESS_CONSOLE.md', 'scripts/apply-v477-v481-integrated-source-path-batch.mjs', 'scripts/check-v477-v481-integrated-source-path.mjs', 'scripts/check-v471-v475-backend-spike.mjs', 'assets/vedapath-command-shell.js', 'scripts/check-static-links.mjs', 'build-status.html', 'README.md', 'CHANGELOG.md'.
- Checks run: Per-version page, data, document, syntax, API contract, registry, static-link, HTTP smoke, and browser visual checks.
- Known risks: Private-demo and reviewed-preview only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## v4.8.0 Integrated Ask Demo

- Changes made: Adds an accessible learner-facing Ask workspace with sample questions, reviewed-preview and local-API modes, source cards, no-source states, visible boundaries, and no storage or telemetry.
- Files changed: 'askdemo.html', 'data/vedapath-integrated-ask-demo.json', 'docs/INTEGRATED_ASK_DEMO.md', 'assets/vedapath-ask-demo.js', 'assets/vedapath-ask-demo.css', 'assets/vedapath-local-api-adapter.js', 'index.html'.
- Checks run: Per-version page, data, document, syntax, API contract, registry, static-link, HTTP smoke, and browser visual checks.
- Known risks: Private-demo and reviewed-preview only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## v4.7.9 Curated Source Registry

- Changes made: Adds a JSON-backed curated source registry, deterministic search module, source and search API endpoints, family filters, review states, and citation-only rights posture.
- Files changed: 'curatedsourceregistry.html', 'data/vedapath-curated-source-registry.json', 'data/vedapath-source-registry.json', 'docs/CURATED_SOURCE_REGISTRY.md', 'scripts/vedapath-source-registry.mjs', 'scripts/vedapath-source-api-stub.mjs', 'scripts/vedapath-local-source-api-server.mjs'.
- Checks run: Per-version page, data, document, syntax, API contract, registry, static-link, HTTP smoke, and browser visual checks.
- Known risks: Private-demo and reviewed-preview only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## v4.7.8 Source API Reliability Contract

- Changes made: Hardens the local Source API with a versioned response contract, request tracing, 400, 404, 405, 413, and 422 error paths, and safer local CORS behavior.
- Files changed: 'sourceapireliabilitycontract.html', 'data/vedapath-source-api-reliability-contract.json', 'docs/SOURCE_API_RELIABILITY_CONTRACT.md', 'scripts/vedapath-local-source-api-server.mjs', 'assets/vedapath-local-api-adapter.js'.
- Checks run: Per-version page, data, document, syntax, API contract, registry, static-link, HTTP smoke, and browser visual checks.
- Known risks: Private-demo and reviewed-preview only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## v4.7.7 Backend Spike Review Gate

- Changes made: Adds an evidence-based backend spike review gate with acceptance criteria, unresolved risks, decision language, and explicit launch locks.
- Files changed: 'backendspikereviewgate.html', 'data/vedapath-backend-spike-review-gate.json', 'docs/BACKEND_SPIKE_REVIEW_GATE.md'.
- Checks run: Per-version page, data, document, syntax, API contract, registry, static-link, HTTP smoke, and browser visual checks.
- Known risks: Private-demo and reviewed-preview only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## v4.7.6 Route Safety Guard

- Changes made: Fixes Brand-board subfolder links so GitHub Pages opens root rooms correctly, hardens the command-shell rail link resolver for nested pages, adds a custom 404 route guard for stale `/brand/*.html` URLs, and expands static route checks.
- Files changed: `brand/brand-board.html`, `assets/vedapath-command-shell.js`, `404.html`, `scripts/check-static-links.mjs`, `scripts/check-v476-route-safety.mjs`, `scripts/check-v471-v475-backend-spike.mjs`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-command-shell.js`, `node --check scripts/check-v476-route-safety.mjs`, `node scripts/check-v476-route-safety.mjs`, `node scripts/check-static-links.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, and local HTTP smoke checks.
- Known risks: GitHub Pages may take a minute to publish the fix; the custom 404 redirect only runs after GitHub serves the 404 page, and any future subfolder page still needs route-safe links.

## v4.7.1 Backend Spike Choice

- Changes made: Selects the first backend spike path and keeps serverless, production corpus, accounts, telemetry, payments, and public launch explicitly closed.
- Files changed: `backendspikechoice.html`, `data/vedapath-backend-spike-choice.json`, `docs/BACKEND_SPIKE_CHOICE.md`, `scripts/vedapath-local-source-api-server.mjs`, `assets/vedapath-local-api-adapter.js`, `scripts/vedapath-private-demo-backend-handoff.mjs`, `scripts/check-v471-v475-backend-spike.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## v4.7.2 Local Source API Server

- Changes made: Adds a local Node Source API server script with health, fixture, GET source, POST source, JSON, CORS, and explicit no-storage posture.
- Files changed: `localsourceapiserver.html`, `data/vedapath-local-source-api-server.json`, `docs/LOCAL_SOURCE_API_SERVER.md`, `scripts/vedapath-local-source-api-server.mjs`, `assets/vedapath-local-api-adapter.js`, `scripts/vedapath-private-demo-backend-handoff.mjs`, `scripts/check-v471-v475-backend-spike.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## v4.7.3 Source Packet Contract Tests

- Changes made: Adds a backend spike contract test that validates source packet fields, local API responses, fixture outcomes, command shell links, static links, and handoff script output.
- Files changed: `sourcepacketcontracttests.html`, `data/vedapath-source-packet-contract-tests.json`, `docs/SOURCE_PACKET_CONTRACT_TESTS.md`, `scripts/vedapath-local-source-api-server.mjs`, `assets/vedapath-local-api-adapter.js`, `scripts/vedapath-private-demo-backend-handoff.mjs`, `scripts/check-v471-v475-backend-spike.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## v4.7.4 Local API Adapter Fallback

- Changes made: Adds a browser-safe local API adapter with timeout, GET source request construction, unavailable fallback packet, and no automatic production integration.
- Files changed: `localapiadapterfallback.html`, `data/vedapath-local-api-adapter-fallback.json`, `docs/LOCAL_API_ADAPTER_FALLBACK.md`, `scripts/vedapath-local-source-api-server.mjs`, `assets/vedapath-local-api-adapter.js`, `scripts/vedapath-private-demo-backend-handoff.mjs`, `scripts/check-v471-v475-backend-spike.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## v4.7.5 Private Demo Backend Handoff

- Changes made: Adds a private demo backend handoff script, handoff room, docs, build status update, homepage strip, command shell links, and final batch changelog.
- Files changed: `privatedemobackendhandoff.html`, `data/vedapath-private-demo-backend-handoff.json`, `docs/PRIVATE_DEMO_BACKEND_HANDOFF.md`, `scripts/vedapath-local-source-api-server.mjs`, `assets/vedapath-local-api-adapter.js`, `scripts/vedapath-private-demo-backend-handoff.mjs`, `scripts/check-v471-v475-backend-spike.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## v4.6.6 Backend Prototype Decision Gate

- Changes made: Adds a founder-readable backend decision gate that narrows the next infrastructure step to a local Source API stub and fixture CLI.
- Files changed: `backendprototypedecisiongate.html`, `data/vedapath-backend-prototype-decision-gate.json`, `docs/BACKEND_PROTOTYPE_DECISION_GATE.md`, `scripts/vedapath-source-api-stub.mjs`, `scripts/vedapath-retrieval-fixture-cli.mjs`, `scripts/check-v466-v470-backend-prototype.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## v4.6.7 Source API Stub

- Changes made: Adds an executable local Source API stub module plus a source-stub control room that documents required response fields.
- Files changed: `sourceapistub.html`, `data/vedapath-source-api-stub.json`, `docs/SOURCE_API_STUB.md`, `scripts/vedapath-source-api-stub.mjs`, `scripts/vedapath-retrieval-fixture-cli.mjs`, `scripts/check-v466-v470-backend-prototype.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## v4.6.8 Retrieval Fixture CLI

- Changes made: Adds a local retrieval fixture CLI that runs deterministic queries through the Source API stub and reports expected found, hold, review, and no-source behavior.
- Files changed: `retrievalfixturecli.html`, `data/vedapath-retrieval-fixture-cli.json`, `docs/RETRIEVAL_FIXTURE_CLI.md`, `scripts/vedapath-source-api-stub.mjs`, `scripts/vedapath-retrieval-fixture-cli.mjs`, `scripts/check-v466-v470-backend-prototype.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## v4.6.9 Private Demo Session Ledger

- Changes made: Adds a private demo session ledger contract so demo events, consent posture, local storage, and deletion/export boundaries are visible before telemetry begins.
- Files changed: `privatedemosessionledger.html`, `data/vedapath-private-demo-session-ledger.json`, `docs/PRIVATE_DEMO_SESSION_LEDGER.md`, `scripts/vedapath-source-api-stub.mjs`, `scripts/vedapath-retrieval-fixture-cli.mjs`, `scripts/check-v466-v470-backend-prototype.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## v4.7.0 Backend Readiness Control Room

- Changes made: Adds a backend readiness control room and validation script tying source packets, fixture CLI results, demo ledger boundaries, and launch locks into one backend-readiness evidence layer.
- Files changed: `backendreadinesscontrolroom.html`, `data/vedapath-backend-readiness-control-room.json`, `docs/BACKEND_READINESS_CONTROL_ROOM.md`, `scripts/vedapath-source-api-stub.mjs`, `scripts/vedapath-retrieval-fixture-cli.mjs`, `scripts/check-v466-v470-backend-prototype.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## v4.6.1 Source API Test Harness

- Changes made: Adds executable-style source API fixtures and a validation script so contract readiness can be checked before live retrieval exists.
- Files changed: `sourceapitestharness.html`, `data/vedapath-source-api-test-harness.json`, `docs/SOURCE_API_TEST_HARNESS.md`, `scripts/check-v461-v465-launch-tests.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## v4.6.2 No-Source Evaluation Suite

- Changes made: Adds a no-source evaluation suite with refusal cases, expected boundaries, and public-launch blockers for unsupported claims.
- Files changed: `nosourceevaluationsuite.html`, `data/vedapath-no-source-evaluation-suite.json`, `docs/NO_SOURCE_EVALUATION_SUITE.md`, `scripts/check-v461-v465-launch-tests.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## v4.6.3 Source Candidate Fixture Runner

- Changes made: Adds a source candidate fixture runner that models ranking output, match reasons, rejected alternatives, and reviewer decisions.
- Files changed: `sourcecandidatefixturerunner.html`, `data/vedapath-source-candidate-fixture-runner.json`, `docs/SOURCE_CANDIDATE_FIXTURE_RUNNER.md`, `scripts/check-v461-v465-launch-tests.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## v4.6.4 Adapter Contract Tests

- Changes made: Adds adapter contract tests for evidence order, no-source refusal, reviewer hold handling, and boundary-preserving answer draft packets.
- Files changed: `adaptercontracttests.html`, `data/vedapath-adapter-contract-tests.json`, `docs/ADAPTER_CONTRACT_TESTS.md`, `scripts/check-v461-v465-launch-tests.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## v4.6.5 Private Demo Script

- Changes made: Adds a private demo script with talk track, allowed claims, blocked claims, and founder-ready handoff packet.
- Files changed: `privatedemoscript.html`, `data/vedapath-private-demo-script.json`, `docs/PRIVATE_DEMO_SCRIPT.md`, `scripts/check-v461-v465-launch-tests.mjs`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## v4.5.6 Real Source API Contract

- Changes made: Defines the first source lookup contract with required fields, response example, quality rules, and trace boundaries.
- Files changed: `realsourceapicontract.html`, `data/vedapath-real-source-api-contract.json`, `docs/REAL_SOURCE_API_CONTRACT.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## v4.5.7 Retrieval Service Boundary

- Changes made: Separates the future retrieval service responsibilities from answer composition, reviewer decisions, storage, and public launch authority.
- Files changed: `retrievalserviceboundary.html`, `data/vedapath-retrieval-service-boundary.json`, `docs/RETRIEVAL_SERVICE_BOUNDARY.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## v4.5.8 Mock Answer Generation Adapter

- Changes made: Adds a mock answer adapter specification with selected source packets, composition order, refusal path, and boundary-first draft packets.
- Files changed: `mockanswergenerationadapter.html`, `data/vedapath-mock-answer-generation-adapter.json`, `docs/MOCK_ANSWER_GENERATION_ADAPTER.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## v4.5.9 Reviewer Approval Handoff

- Changes made: Adds a reviewer handoff room with approval packets, risks, owner lanes, receipt language, and blocked production fields.
- Files changed: `reviewerapprovalhandoff.html`, `data/vedapath-reviewer-approval-handoff.json`, `docs/REVIEWER_APPROVAL_HANDOFF.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## v4.6.0 Private Launch Gate

- Changes made: Adds a private launch gate that distinguishes private demo readiness from public launch readiness with explicit locks, metrics, and founder packet.
- Files changed: `privatelaunchgate.html`, `data/vedapath-private-launch-gate.json`, `docs/PRIVATE_LAUNCH_GATE.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## v4.5.1 Learner Answer Draft Review

- Changes made: Adds a learner answer draft review room with sample questions, cited draft packets, carry steps, and visible boundaries before live generation.
- Files changed: `learneranswerdraftreview.html`, `data/vedapath-learner-answer-draft-review.json`, `docs/LEARNER_ANSWER_DRAFT_REVIEW.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.5.2 Answer Revision Workbench

- Changes made: Adds a revision workbench that turns risky answer drafts into clearer, shorter, boundary-first answer packets.
- Files changed: `answerrevisionworkbench.html`, `data/vedapath-answer-revision-workbench.json`, `docs/ANSWER_REVISION_WORKBENCH.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.5.3 Source-to-Answer Trace View

- Changes made: Adds a source-to-answer trace view that maps answer sentences to source packet, confidence, boundary, and reviewer state.
- Files changed: `sourcetoanswertraceview.html`, `data/vedapath-source-to-answer-trace-view.json`, `docs/SOURCE_TO_ANSWER_TRACE_VIEW.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.5.4 Audience View Toggle

- Changes made: Adds audience view toggles so a single source packet can be reviewed for beginner, Sanskrit, and scholar-reading depths without changing the source.
- Files changed: `audienceviewtoggle.html`, `data/vedapath-audience-view-toggle.json`, `docs/AUDIENCE_VIEW_TOGGLE.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.5.5 Launch Readiness Evidence Pack

- Changes made: Adds a launch readiness evidence pack that summarizes source, answer, revision, trace, audience, and safety evidence before public release decisions.
- Files changed: `launchreadinessevidencepack.html`, `data/vedapath-launch-readiness-evidence-pack.json`, `docs/LAUNCH_READINESS_EVIDENCE_PACK.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.6 Source Coverage Expansion

- Changes made: Adds a coverage expansion room that shows ready, review, and no-source lanes before the corpus grows.
- Files changed: `sourcecoverageexpansion.html`, `data/vedapath-source-coverage-expansion.json`, `docs/SOURCE_COVERAGE_EXPANSION.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v446-v450-source-expansion-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; source coverage, passage dossiers, reviewer approvals, and answer gates do not provide live AI retrieval, licensed corpus coverage, production storage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.7 Source Family Coverage Map

- Changes made: Adds a family coverage map so Veda, Upanishad, Gita, Itihasa, Purana, commentary, and source-gap lanes remain separate.
- Files changed: `sourcefamilycoveragemap.html`, `data/vedapath-source-family-coverage-map.json`, `docs/SOURCE_FAMILY_COVERAGE_MAP.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v446-v450-source-expansion-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; source coverage, passage dossiers, reviewer approvals, and answer gates do not provide live AI retrieval, licensed corpus coverage, production storage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.8 Passage Dossier Builder

- Changes made: Adds a passage dossier builder that turns each source candidate into meaning, use, boundary, missing fields, and reviewer notes.
- Files changed: `passagedossierbuilder.html`, `data/vedapath-passage-dossier-builder.json`, `docs/PASSAGE_DOSSIER_BUILDER.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v446-v450-source-expansion-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; source coverage, passage dossiers, reviewer approvals, and answer gates do not provide live AI retrieval, licensed corpus coverage, production storage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.9 Reviewer Approval Workflow

- Changes made: Adds a reviewer approval workflow so source expansion requires role, scope, decision, audit, and boundary before answer promotion.
- Files changed: `reviewerapprovalworkflow.html`, `data/vedapath-reviewer-approval-workflow.json`, `docs/REVIEWER_APPROVAL_WORKFLOW.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v446-v450-source-expansion-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; source coverage, passage dossiers, reviewer approvals, and answer gates do not provide live AI retrieval, licensed corpus coverage, production storage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.5.0 Retrieval-to-Answer Integration Gate

- Changes made: Adds the retrieval-to-answer integration gate that defines when a source packet may become a learner-facing answer draft.
- Files changed: `retrievaltoanswerintegrationgate.html`, `data/vedapath-retrieval-to-answer-integration-gate.json`, `docs/RETRIEVAL_TO_ANSWER_INTEGRATION_GATE.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v446-v450-source-expansion-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA.
- Known risks: Static prototype only; source coverage, passage dossiers, reviewer approvals, and answer gates do not provide live AI retrieval, licensed corpus coverage, production storage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.1 Retrieval Fixture Adapter

- Changes made: Adds a visible fixture adapter room that reads curated source candidates, exposes source ids, match reasons, confidence, and blocks answer composition until review.
- Files changed: `retrievalfixtureadapter.html`, `data/vedapath-retrieval-fixture-adapter.json`, `docs/RETRIEVAL_FIXTURE_ADAPTER.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v441-v445-retrieval-quality-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON/page/doc validation for the new retrieval-quality rooms.
- Known risks: Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.2 Source Candidate Ranking Contract

- Changes made: Adds a ranking contract room that names fit, citation, rights, review state, and boundary penalties before a source candidate can be top-ranked.
- Files changed: `sourcecandidaterankingcontract.html`, `data/vedapath-source-candidate-ranking-contract.json`, `docs/SOURCE_CANDIDATE_RANKING_CONTRACT.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v441-v445-retrieval-quality-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON/page/doc validation for the new retrieval-quality rooms.
- Known risks: Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.3 No-Source Answer Behavior

- Changes made: Adds a no-source behavior room so VedaPath has a graceful answer path when the fixture set cannot support a question.
- Files changed: `nosourceanswerbehavior.html`, `data/vedapath-no-source-answer-behavior.json`, `docs/NO_SOURCE_ANSWER_BEHAVIOR.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v441-v445-retrieval-quality-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON/page/doc validation for the new retrieval-quality rooms.
- Known risks: Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.4 Citation Packet Renderer

- Changes made: Adds a citation packet renderer that turns a selected source candidate into a structured answer packet with citation, confidence, boundary, and carry action.
- Files changed: `citationpacketrenderer.html`, `data/vedapath-citation-packet-renderer.json`, `docs/CITATION_PACKET_RENDERER.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v441-v445-retrieval-quality-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON/page/doc validation for the new retrieval-quality rooms.
- Known risks: Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.4.5 Retrieval QA Harness

- Changes made: Adds a retrieval QA harness with pass, review, and no-source cases so future retrieval changes can be checked before they affect answer cards.
- Files changed: `retrievalqaharness.html`, `data/vedapath-retrieval-qa-harness.json`, `docs/RETRIEVAL_QA_HARNESS.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v441-v445-retrieval-quality-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON/page/doc validation for the new retrieval-quality rooms.
- Known risks: Static prototype only; fixture retrieval, local copy packets, and QA cases do not provide live AI retrieval, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

## v4.3.6 Pilot Invite Review

- Changes made: Adds a final invite review room so each private pilot invitation has purpose, boundary, consent posture, and hold reasons before a person is added.
- Files changed: `pilotinvitereview.html`, `data/vedapath-pilot-invite-review.json`, `docs/PILOT_INVITE_REVIEW.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v436-v440-pilot-launch-governance-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse checks for the new launch-governance data.
- Known risks: Static prototype only; local storage and copy packets prove the pilot workflow shape but do not provide production identity, source licensing, durable audit storage, live AI retrieval, or public launch authority.

## v4.3.7 Source Rights Approval Board

- Changes made: Adds a rights approval board that separates public-domain, cited-only, excerpt-only, review-needed, and blocked source use before pilot answers expand.
- Files changed: `sourcerightsapprovalboard.html`, `data/vedapath-source-rights-approval-board.json`, `docs/SOURCE_RIGHTS_APPROVAL_BOARD.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v436-v440-pilot-launch-governance-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse checks for the new launch-governance data.
- Known risks: Static prototype only; local storage and copy packets prove the pilot workflow shape but do not provide production identity, source licensing, durable audit storage, live AI retrieval, or public launch authority.

## v4.3.8 Pilot Session Export Packet

- Changes made: Adds a pilot session export packet so a completed session can become one copyable, reviewable artifact without hidden analytics.
- Files changed: `pilotsessionexportpacket.html`, `data/vedapath-pilot-session-export-packet.json`, `docs/PILOT_SESSION_EXPORT_PACKET.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v436-v440-pilot-launch-governance-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse checks for the new launch-governance data.
- Known risks: Static prototype only; local storage and copy packets prove the pilot workflow shape but do not provide production identity, source licensing, durable audit storage, live AI retrieval, or public launch authority.

## v4.3.9 Feedback-to-Ticket Audit Trail

- Changes made: Adds a feedback-to-ticket audit trail so pilot feedback can show source, owner, decision, and reason before it changes product behavior.
- Files changed: `feedbacktoticketaudittrail.html`, `data/vedapath-feedback-to-ticket-audit-trail.json`, `docs/FEEDBACK_TO_TICKET_AUDIT_TRAIL.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v436-v440-pilot-launch-governance-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse checks for the new launch-governance data.
- Known risks: Static prototype only; local storage and copy packets prove the pilot workflow shape but do not provide production identity, source licensing, durable audit storage, live AI retrieval, or public launch authority.

## v4.4.0 First Real Retrieval Adapter Shell

- Changes made: Adds the first real retrieval adapter shell: a bounded contract for fixture source input, citation output, no-answer behavior, and review gating before live AI retrieval.
- Files changed: `retrievaladaptershell.html`, `data/vedapath-retrieval-adapter-shell.json`, `docs/RETRIEVAL_ADAPTER_SHELL.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v436-v440-pilot-launch-governance-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse checks for the new launch-governance data.
- Known risks: Static prototype only; local storage and copy packets prove the pilot workflow shape but do not provide production identity, source licensing, durable audit storage, live AI retrieval, or public launch authority.

## v4.3.1 Pilot Feedback Intake

- Changes made: Adds a private pilot feedback intake room so comments become bounded review tickets instead of hidden telemetry.
- Files changed: `pilotfeedbackintake.html`, `data/vedapath-pilot-feedback-intake.json`, `docs/PILOT_FEEDBACK_INTAKE.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v431-v435-private-pilot-feedback-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for private pilot readiness data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.3.2 Feedback Review Desk

- Changes made: Adds a feedback review desk with explicit accept/revise/hold/discard/escalate decisions.
- Files changed: `feedbackreviewdesk.html`, `data/vedapath-feedback-review-desk.json`, `docs/FEEDBACK_REVIEW_DESK.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v431-v435-private-pilot-feedback-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for private pilot readiness data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.3.3 Pilot User Session Script

- Changes made: Adds a guided pilot session script so the first private pilot test has one calm, repeatable path.
- Files changed: `pilotusersessionscript.html`, `data/vedapath-pilot-user-session-script.json`, `docs/PILOT_USER_SESSION_SCRIPT.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v431-v435-private-pilot-feedback-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for private pilot readiness data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.3.4 Launch Safety Checklist

- Changes made: Adds a launch safety checklist that makes on/off controls visible before private pilot invites.
- Files changed: `launchsafetychecklist.html`, `data/vedapath-launch-safety-checklist.json`, `docs/LAUNCH_SAFETY_CHECKLIST.md`, `assets/vedapath-command-shell.js`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v431-v435-private-pilot-feedback-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for private pilot readiness data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.3.5 Private Pilot Readiness Score

- Changes made: Adds a private pilot readiness score that gathers the feedback, session, safety, source, and answer gates into one founder view, then tightens the mobile command rail and top controls into a compact command tray after visual QA.
- Files changed: `privatepilotreadinessscore.html`, `data/vedapath-private-pilot-readiness-score.json`, `docs/PRIVATE_PILOT_READINESS_SCORE.md`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v431-v435-private-pilot-feedback-batch.mjs`, `node scripts/check-static-links.mjs`, JSON parse for private pilot readiness data, and browser visual QA across desktop and mobile.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.2.6 Pilot Learning Signal Review

- Changes made: Adds a review layer for consented pilot-learning signals so local prototype behavior cannot silently become product memory.
- Files changed: `pilotlearningsignalreview.html`, `data/vedapath-pilot-learning-signal-review.json`, `docs/PILOT_LEARNING_SIGNAL_REVIEW.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-command-shell.js`, `assets/vedapath-pilot-readiness.css`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v426-v430-launch-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for launch data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.2.7 First Session Launch Spine

- Changes made: Adds a first-session launch spine so new users enter through one guided loop instead of the full product map.
- Files changed: `firstsessionlaunchspine.html`, `data/vedapath-first-session-launch-spine.json`, `docs/FIRST_SESSION_LAUNCH_SPINE.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-command-shell.js`, `assets/vedapath-pilot-readiness.css`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v426-v430-launch-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for launch data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.2.8 Source Readiness Triage

- Changes made: Adds source readiness triage so retrieval can route source records before they become answer material.
- Files changed: `sourcereadinesstriage.html`, `data/vedapath-source-readiness-triage.json`, `docs/SOURCE_READINESS_TRIAGE.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-command-shell.js`, `assets/vedapath-pilot-readiness.css`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v426-v430-launch-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for launch data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.2.9 Answer Readiness Gate

- Changes made: Adds an answer readiness gate to keep pilot answers bounded, source-carded, and reviewable.
- Files changed: `answerreadinessgate.html`, `data/vedapath-answer-readiness-gate.json`, `docs/ANSWER_READINESS_GATE.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-command-shell.js`, `assets/vedapath-pilot-readiness.css`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v426-v430-launch-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for launch data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

## v4.3.0 Private Pilot Launch Console

- Changes made: Adds a private pilot launch console that gathers the readiness chain into one founder go/hold surface.
- Files changed: `privatepilotlaunchconsole.html`, `data/vedapath-private-pilot-launch-console.json`, `docs/PRIVATE_PILOT_LAUNCH_CONSOLE.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-command-shell.js`, `assets/vedapath-pilot-readiness.css`, `scripts/check-static-links.mjs`, `index.html`, and `build-status.html`.
- Checks run: `node --check assets/vedapath-pilot-readiness.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v426-v430-launch-batch.mjs`, `node scripts/check-static-links.mjs`, and JSON parse for launch data.
- Known risks: Static prototype only; local storage and copy packets prove workflow shape but do not provide production identity, persistence, analytics, or reviewer permissions.

# Changelog

## v4.2.5 Pilot Telemetry Consent
- Changes made: Pilot Telemetry Consent adds an opt-in, local-only pilot learning consent room, a copyable consent packet, and a VedaPath identity context pill in the command shell so the project stays unmistakably VedaPath before any telemetry begins.
- Files changed: `pilottelemetryconsent.html`, `data/vedapath-pilot-telemetry-consent.json`, `docs/PILOT_TELEMETRY_CONSENT.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `index.html`, `build-status.html`, `README.md`, `CHANGELOG.md`, and `scripts/check-static-links.mjs`.
- Checks run: Node syntax checks, JSON parse checks, static link check, and browser visual QA.
- Known risks: telemetry remains browser-local prototype state; production analytics, accounts, consent backend, source rights approval, and live AI retrieval remain disabled.

<!-- V420-V424 CHANGELOG START -->
## v4.2.4 Pilot Invite Packet
- Changes made: Pilot Invite Packet gives the founder a calm, bounded invitation builder for a small public pilot without account, payment, or production promises, plus a mobile rail composure fix for the expanded retrieval navigation with calmer scrollable room rows.
- Files changed: `pilotinvitepacket.html`, `data/vedapath-pilot-invite-packet.json`, `docs/PILOT_INVITE_PACKET.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-pilot-readiness.css`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `index.html`, `build-status.html`, `README.md`, and `scripts/check-static-links.mjs`.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: pilot-readiness data is still prototype seed data; production accounts, licensed source review, durable audit storage, public launch approval, and live AI retrieval remain unresolved.

## v4.2.3 Answer Promotion Rules
- Changes made: Answer Promotion Rules stop a source candidate from becoming a public answer pattern until citation, rights, review, and boundary checks pass.
- Files changed: `answerpromotionrules.html`, `data/vedapath-answer-promotion-rules.json`, `docs/ANSWER_PROMOTION_RULES.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-pilot-readiness.css`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `index.html`, `build-status.html`, `README.md`, and `scripts/check-static-links.mjs`.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: pilot-readiness data is still prototype seed data; production accounts, licensed source review, durable audit storage, public launch approval, and live AI retrieval remain unresolved.

## v4.2.2 Reviewer Identity Lite
- Changes made: Reviewer Identity Lite makes source decisions carry role, scope, conflict, and authority boundaries without creating real accounts.
- Files changed: `revieweridentitylite.html`, `data/vedapath-reviewer-identity-lite.json`, `docs/REVIEWER_IDENTITY_LITE.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-pilot-readiness.css`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `index.html`, `build-status.html`, `README.md`, and `scripts/check-static-links.mjs`.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: pilot-readiness data is still prototype seed data; production accounts, licensed source review, durable audit storage, public launch approval, and live AI retrieval remain unresolved.

## v4.2.1 Rights Review Desk
- Changes made: Rights Review Desk separates allowed, review-needed, excerpt-only, and blocked source use before public pilot answers expand.
- Files changed: `rightsreviewdesk.html`, `data/vedapath-rights-review-desk.json`, `docs/RIGHTS_REVIEW_DESK.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-pilot-readiness.css`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `index.html`, `build-status.html`, `README.md`, and `scripts/check-static-links.mjs`.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: pilot-readiness data is still prototype seed data; production accounts, licensed source review, durable audit storage, public launch approval, and live AI retrieval remain unresolved.

## v4.2.0 Source Edition Intake
- Changes made: Source Edition Intake captures edition, translator, language, rights posture, and missing source fields before pilot use.
- Files changed: `sourceeditionintake.html`, `data/vedapath-source-edition-intake.json`, `docs/SOURCE_EDITION_INTAKE.md`, `assets/vedapath-pilot-readiness.js`, `assets/vedapath-pilot-readiness.css`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `index.html`, `build-status.html`, `README.md`, and `scripts/check-static-links.mjs`.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: pilot-readiness data is still prototype seed data; production accounts, licensed source review, durable audit storage, public launch approval, and live AI retrieval remain unresolved.
<!-- V420-V424 CHANGELOG END -->

<!-- V415-V419 CHANGELOG START -->
## v4.1.9 Public Pilot Waitlist Gate
- Changes made: Public Pilot Waitlist Gate creates a privacy-light pilot entry path with local interest capture, eligibility boundaries, and no account or payment promises.
- Files changed: `publicpilotwaitlistgate.html`, `data/vedapath-public-pilot-waitlist-gate.json`, `docs/PUBLIC_PILOT_WAITLIST_GATE.md`, `assets/vedapath-trust-launch.js`, `assets/vedapath-trust-launch.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: trust-launch data is still prototype seed data and source edition, rights, reviewer identity, and production storage remain unresolved.

## v4.1.8 Retrieval Scoring Explanation
- Changes made: Retrieval Scoring Explanation shows why a source candidate ranks higher or lower through fit, citation quality, rights, and boundary scores.
- Files changed: `retrievalscoringexplanation.html`, `data/vedapath-retrieval-scoring-explanation.json`, `docs/RETRIEVAL_SCORING_EXPLANATION.md`, `assets/vedapath-trust-launch.js`, `assets/vedapath-trust-launch.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: trust-launch data is still prototype seed data and source edition, rights, reviewer identity, and production storage remain unresolved.

## v4.1.7 Reviewer Decision History
- Changes made: Reviewer Decision History turns source review outcomes into a visible local audit trail instead of silent knowledge rewrites.
- Files changed: `reviewerdecisionhistory.html`, `data/vedapath-reviewer-decision-history.json`, `docs/REVIEWER_DECISION_HISTORY.md`, `assets/vedapath-trust-launch.js`, `assets/vedapath-trust-launch.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: trust-launch data is still prototype seed data and source edition, rights, reviewer identity, and production storage remain unresolved.

## v4.1.6 Source Edition and Rights Matrix
- Changes made: Source Edition and Rights Matrix separates public-domain, licensed, excerpt-only, and blocked source use before any public pilot answer expands.
- Files changed: `sourceeditionrightsmatrix.html`, `data/vedapath-source-edition-rights-matrix.json`, `docs/SOURCE_EDITION_RIGHTS_MATRIX.md`, `assets/vedapath-trust-launch.js`, `assets/vedapath-trust-launch.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: trust-launch data is still prototype seed data and source edition, rights, reviewer identity, and production storage remain unresolved.

## v4.1.5 Citation Deep Link Layer
- Changes made: Citation Deep Link Layer gives each learner-visible source card a stable citation anchor, copyable reference packet, and passage navigation posture.
- Files changed: `citationdeeplinklayer.html`, `data/vedapath-citation-deep-link-layer.json`, `docs/CITATION_DEEP_LINK_LAYER.md`, `assets/vedapath-trust-launch.js`, `assets/vedapath-trust-launch.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, interaction smoke, and visual QA in the browser for the batch.
- Known risks: trust-launch data is still prototype seed data and source edition, rights, reviewer identity, and production storage remain unresolved.

<!-- V415-V419 CHANGELOG END -->

<!-- V410-V414 CHANGELOG START -->
## v4.1.4 Learner Ask Flow
- Changes made: Learner Ask Flow gives users one simple, source-carded question path over the curated demo source pack.
- Files changed: `learneraskflow.html`, `data/vedapath-learner-ask-flow.json`, `docs/LEARNER_ASK_FLOW.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-retrieval-pilot.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, and visual QA in the browser for the batch.
- Known risks: records are curated prototype data and still need licensed/source-edition review before production answers.

## v4.1.3 First 25 Source QA Pack
- Changes made: First 25 Source QA Pack creates a visible curated seed set with coverage, review status, and risks.
- Files changed: `first25sourceqapack.html`, `data/vedapath-first-25-source-qa-pack.json`, `docs/FIRST_25_SOURCE_QA_PACK.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-retrieval-pilot.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, and visual QA in the browser for the batch.
- Known risks: records are curated prototype data and still need licensed/source-edition review before production answers.

## v4.1.2 Retrieval Reviewer Desk
- Changes made: Retrieval Reviewer Desk lets a reviewer inspect candidate matches, missing fields, and safe decisions.
- Files changed: `retrievalreviewerdesk.html`, `data/vedapath-retrieval-reviewer-desk.json`, `docs/RETRIEVAL_REVIEWER_DESK.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-retrieval-pilot.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, and visual QA in the browser for the batch.
- Known risks: records are curated prototype data and still need licensed/source-edition review before production answers.

## v4.1.1 Verified Source Record Schema
- Changes made: Verified Source Record Schema defines the minimum source contract before retrieval can be trusted.
- Files changed: `verifiedsourcerecordschema.html`, `data/vedapath-verified-source-record-schema.json`, `docs/VERIFIED_SOURCE_RECORD_SCHEMA.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-retrieval-pilot.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, and visual QA in the browser for the batch.
- Known risks: records are curated prototype data and still need licensed/source-edition review before production answers.

## v4.1.0 Production Retrieval Pilot Gate
- Changes made: Production Retrieval Pilot Gate separates allowed static retrieval pilot work from blocked live-answer authority.
- Files changed: `productionretrievalpilotgate.html`, `data/vedapath-production-retrieval-pilot-gate.json`, `docs/PRODUCTION_RETRIEVAL_PILOT_GATE.md`, `assets/vedapath-retrieval-pilot.js`, `assets/vedapath-retrieval-pilot.css`, `assets/vedapath-command-shell.js`, `index.html`, `build-status.html`, docs, and static-link checks.
- Checks run: Node syntax checks, JSON parse checks, `scripts/check-static-links.mjs`, and visual QA in the browser for the batch.
- Known risks: records are curated prototype data and still need licensed/source-edition review before production answers.
<!-- V410-V414 CHANGELOG END -->

## v4.0.9 Launch Readiness Hub
- Changes made: added launch readiness hub, launch readiness data, copyable launch report, and command-shell page title support.
- Files changed: `launchreadinesshub.html`, `assets/vedapath-launch-readiness-hub.js`, `data/vedapath-launch-readiness-hub.json`, `assets/vedapath-command-shell.js`, `assets/vedapath-command-shell.css`, `assets/vedapath-ui.css`, `build-status.html`, `scripts/check-static-links.mjs`, docs.
- Checks run: JSON parse, Node syntax checks, `scripts/check-static-links.mjs`, and visual QA after the batch.
- Known risks: readiness score is prototype/product judgment, not analytics from live users.

## v4.0.8 Answer Packet Pilot
- Changes made: added a source-carded answer packet pilot with copyable handoff and visible boundary language.
- Files changed: `answerpacketpilot.html`, `assets/vedapath-answer-packet-pilot.js`, `assets/vedapath-pilot-surfaces.css`, `assets/vedapath-ui.css`, `data/vedapath-answer-packet-pilot.json`, docs.
- Checks run: JSON parse, Node syntax checks, `scripts/check-static-links.mjs`, and visual QA after the batch.
- Known risks: content is a curated prototype answer, not production retrieval output.

## v4.0.7 Founder Permission Execution Authorization Decision Gate Re-entry
- Changes made: re-entered founder decision from v4.0.6, recorded pilot posture, and kept authority flags false.
- Files changed: `founderpermissionexecutionauthorizationdecisiongate.html`, `assets/vedapath-founder-permission-execution-authorization-decision-gate.js`, `data/vedapath-founder-permission-execution-authorization-decision-gate.json`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: founder posture is still local/static and does not represent legal or production authorization.

## v4.0.6 Controlled Permission Execution Authorization Review Decision Gate Re-entry
- Changes made: re-entered review decision from v4.0.5 and separated return, hold, block, and founder-review routes.
- Files changed: `controlledpermissionexecutionauthorizationreviewdecisiongate.html`, `assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.js`, `data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: route choices are prototype review states, not workflow-backed production permissions.

## v4.0.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry
- Changes made: re-entered draft review from v4.0.4 and preserved source identity, confidence, boundary, and false authority flags.
- Files changed: `controlledpermissionexecutionauthorizationdraftreviewgate.html`, `assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js`, `data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json`, docs.
- Checks run: JSON parse, Node syntax checks, static reference checks, and visual QA after the batch.
- Known risks: review packet is static prototype data and still needs real reviewer accounts before production use.

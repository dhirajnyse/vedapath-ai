# Changelog

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

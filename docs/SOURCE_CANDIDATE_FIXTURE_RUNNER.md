# Source Candidate Fixture Runner

Version: v4.6.3

## Purpose

This runner tests source-candidate ranking with visible match reasons, rejected alternatives, confidence posture, and reviewer state.

## What Changed

Adds a source candidate fixture runner that models ranking output, match reasons, rejected alternatives, and reviewer decisions.

## Product Boundary

Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## Primary Files

- sourcecandidatefixturerunner.html
- data/vedapath-source-candidate-fixture-runner.json
- docs/SOURCE_CANDIDATE_FIXTURE_RUNNER.md

## Checks

`node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

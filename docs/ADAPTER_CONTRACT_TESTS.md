# Adapter Contract Tests

Version: v4.6.4

## Purpose

These tests define how source packets become answer drafts: direct answer, source card, plain meaning, boundary, and one carry action.

## What Changed

Adds adapter contract tests for evidence order, no-source refusal, reviewer hold handling, and boundary-preserving answer draft packets.

## Product Boundary

Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## Primary Files

- adaptercontracttests.html
- data/vedapath-adapter-contract-tests.json
- docs/ADAPTER_CONTRACT_TESTS.md

## Checks

`node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

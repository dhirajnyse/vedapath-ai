# Source API Test Harness

Version: v4.6.1

## Purpose

This harness turns the v4.5.6 source contract into fixture checks for trace IDs, source IDs, family labels, confidence, reviewer state, and no-source flags.

## What Changed

Adds executable-style source API fixtures and a validation script so contract readiness can be checked before live retrieval exists.

## Product Boundary

Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## Primary Files

- sourceapitestharness.html
- data/vedapath-source-api-test-harness.json
- docs/SOURCE_API_TEST_HARNESS.md

## Checks

`node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

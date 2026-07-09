# No-Source Evaluation Suite

Version: v4.6.2

## Purpose

This suite defines the refusal behavior for inflated claims, unsupported modern-science claims, missing rights, and ritual authority gaps.

## What Changed

Adds a no-source evaluation suite with refusal cases, expected boundaries, and public-launch blockers for unsupported claims.

## Product Boundary

Static launch-test prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, payment, or account sync.

## Primary Files

- nosourceevaluationsuite.html
- data/vedapath-no-source-evaluation-suite.json
- docs/NO_SOURCE_EVALUATION_SUITE.md

## Checks

`node --check scripts/apply-v461-v465-launch-test-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/check-v461-v465-launch-tests.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

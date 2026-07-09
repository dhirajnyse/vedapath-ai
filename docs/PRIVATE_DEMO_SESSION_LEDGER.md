# Private Demo Session Ledger

Version: v4.6.9

## Purpose

This ledger defines local-only demo events, consent posture, export shape, and deletion boundary before any production account or telemetry exists.

## What Changed

Adds a private demo session ledger contract so demo events, consent posture, local storage, and deletion/export boundaries are visible before telemetry begins.

## Product Boundary

Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## Primary Files

- privatedemosessionledger.html
- data/vedapath-private-demo-session-ledger.json
- docs/PRIVATE_DEMO_SESSION_LEDGER.md

## Checks

`node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

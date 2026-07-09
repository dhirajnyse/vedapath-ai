# Backend Prototype Decision Gate

Version: v4.6.6

## Purpose

This gate selects a local Source API prototype, fixture runner, and private demo ledger while keeping live AI, payments, public launch, and production storage closed.

## What Changed

Adds a founder-readable backend decision gate that narrows the next infrastructure step to a local Source API stub and fixture CLI.

## Product Boundary

Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## Primary Files

- backendprototypedecisiongate.html
- data/vedapath-backend-prototype-decision-gate.json
- docs/BACKEND_PROTOTYPE_DECISION_GATE.md

## Checks

`node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

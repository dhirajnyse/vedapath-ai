# Retrieval Fixture CLI

Version: v4.6.8

## Purpose

The fixture CLI evaluates Oppenheimer, steady-action, Gayatri, and unsupported modern-claim questions against the local Source API stub.

## What Changed

Adds a local retrieval fixture CLI that runs deterministic queries through the Source API stub and reports expected found, hold, review, and no-source behavior.

## Product Boundary

Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## Primary Files

- retrievalfixturecli.html
- data/vedapath-retrieval-fixture-cli.json
- docs/RETRIEVAL_FIXTURE_CLI.md

## Checks

`node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

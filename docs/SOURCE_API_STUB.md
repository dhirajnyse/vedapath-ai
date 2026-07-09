# Source API Stub

Version: v4.6.7

## Purpose

This local stub models the smallest backend response: trace id, source found, citation, family, confidence, reviewer state, rights state, boundary, and next action.

## What Changed

Adds an executable local Source API stub module plus a source-stub control room that documents required response fields.

## Product Boundary

Backend prototype is local/static only; it does not enable live AI generation, licensed corpus delivery, public launch, payment, production accounts, durable storage, or medical/legal/ritual/spiritual authority.

## Primary Files

- sourceapistub.html
- data/vedapath-source-api-stub.json
- docs/SOURCE_API_STUB.md

## Checks

`node --check scripts/apply-v466-v470-backend-prototype-batch.mjs`, per-version JSON/page/doc validation, `node --check scripts/vedapath-source-api-stub.mjs`, `node --check scripts/vedapath-retrieval-fixture-cli.mjs`, `node --check scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

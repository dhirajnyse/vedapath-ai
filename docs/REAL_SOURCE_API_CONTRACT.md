# Real Source API Contract

Version: v4.5.6

## Purpose

The next real backend must return traceable source packets, reviewer state, confidence, and no-source behavior before any answer text is composed.

## What Changed

Defines the first source lookup contract with required fields, response example, quality rules, and trace boundaries.

## Product Boundary

Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## Primary Files

- realsourceapicontract.html
- data/vedapath-real-source-api-contract.json
- docs/REAL_SOURCE_API_CONTRACT.md

## Checks

`node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

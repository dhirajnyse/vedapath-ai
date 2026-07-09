# Mock Answer Generation Adapter

Version: v4.5.8

## Purpose

This mock adapter turns a source packet into an answer draft using a fixed order: direct answer, source card, plain meaning, boundary, carry step.

## What Changed

Adds a mock answer adapter specification with selected source packets, composition order, refusal path, and boundary-first draft packets.

## Product Boundary

Static launch/API prototype only; it does not enable live retrieval, live AI generation, licensed corpus delivery, production storage, public launch, medical/legal/ritual/spiritual authority, or payment.

## Primary Files

- mockanswergenerationadapter.html
- data/vedapath-mock-answer-generation-adapter.json
- docs/MOCK_ANSWER_GENERATION_ADAPTER.md

## Checks

`node --check scripts/apply-v456-v460-launch-api-batch.mjs`, per-version JSON/page/doc validation, `node --check assets/vedapath-command-shell.js`, `node --check assets/vedapath-retrieval-pilot.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

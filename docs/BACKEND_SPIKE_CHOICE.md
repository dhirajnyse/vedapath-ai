# v4.7.1 Backend Spike Choice

## Purpose

VedaPath now chooses a local Node Source API as the first backend spike because it keeps the source packet visible, deterministic, and private-demo safe.

## What Changed

Selects the first backend spike path and keeps serverless, production corpus, accounts, telemetry, payments, and public launch explicitly closed.

## Demo Boundary

Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## Acceptance Checks

`node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

## Founder Packet

```text
Backend Spike Choice v4.7.1
Decision: local Node Source API first.
Reason: prove source packet shape before real retrieval or AI generation.
Blocked: public launch, production storage, accounts, payments, live model calls, licensed corpus delivery.
```

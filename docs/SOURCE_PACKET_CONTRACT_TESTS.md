# v4.7.3 Source Packet Contract Tests

## Purpose

The new contract checker starts the local API in-process and verifies health, GET source, POST source, no-source behavior, fixture suite results, and handoff packet text.

## What Changed

Adds a backend spike contract test that validates source packet fields, local API responses, fixture outcomes, command shell links, static links, and handoff script output.

## Demo Boundary

Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## Acceptance Checks

`node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

## Founder Packet

```text
Source Packet Contract Tests v4.7.3
Required: health, GET source, POST source, source packet fields, no-source fallback, fixture suite, static links, command shell labels.
Boundary: tests prove prototype behavior only.
```

# v4.7.4 Local API Adapter Fallback

## Purpose

A small browser adapter defines how future UI screens can call the local Source API and return a safe static fallback when the server is unavailable.

## What Changed

Adds a browser-safe local API adapter with timeout, GET source request construction, unavailable fallback packet, and no automatic production integration.

## Demo Boundary

Backend spike artifacts are local/private-demo only; they do not enable live AI generation, public corpus delivery, production storage, accounts, payments, public launch, or medical/legal/ritual/spiritual authority.

## Acceptance Checks

`node --check scripts/apply-v471-v475-backend-spike-batch.mjs`, per-version page/data/doc validation, `node --check scripts/vedapath-local-source-api-server.mjs`, `node --check scripts/vedapath-private-demo-backend-handoff.mjs`, `node --check assets/vedapath-local-api-adapter.js`, `node --check scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v471-v475-backend-spike.mjs`, `node scripts/check-v466-v470-backend-prototype.mjs`, `node scripts/check-v461-v465-launch-tests.mjs`, `node --check assets/vedapath-command-shell.js`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

## Founder Packet

```text
Local API Adapter Fallback v4.7.4
Use: window.VedaPathLocalApiAdapter.querySourcePacket(question, { baseUrl: 'http://127.0.0.1:8787' })
Fallback: local-server-unavailable no-source packet.
Boundary: no production endpoint is configured.
```

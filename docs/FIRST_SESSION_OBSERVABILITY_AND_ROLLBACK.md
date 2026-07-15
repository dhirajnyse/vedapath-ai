# v5.1.5 First-Session Observability and Rollback

## Purpose

A thirty-minute fixture now accepts only opened, source-viewed, boundary-acknowledged, and closed events with status and latency metadata, a checkpoint digest, named rollback owner, no raw content, no export, no network, and no live session.

## What Changed

Adds a first-session observability evaluator with consent dependency, pseudonymous fixture identifiers, four ordered event types, strict metadata field allowlist, status and latency bounds, thirty-minute duration, named rollback owner, checkpoint digest, local aggregate-only telemetry, and permanent no-raw-content, no-export, no-provider, no-network, no-participant, and no-live-session outputs.

## Files Changed

- `firstsessionobservability.html`
- `data/vedapath-first-session-observability.json`
- `docs/FIRST_SESSION_OBSERVABILITY_AND_ROLLBACK.md`
- `scripts/vedapath-first-session-observability.mjs`
- `scripts/apply-v512-v516-private-pilot-operations-batch.mjs`
- `scripts/check-v512-v516-private-pilot-operations.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`
- `historical compatibility checkers`

## Acceptance Checks

node --check scripts/vedapath-first-session-observability.mjs; valid, consent, identifiers, owner, checkpoint, telemetry, duration, event order, field, timeline, status, latency, raw content, export, provider, network, session, and public-access assertions; batch checker through v5.1.5; static links.

## Known Risks

Private-pilot operations contract evidence only; candidate stack, invitation adapter, consent, observability, and founder review remain deterministic fixtures. No credentials, direct identity, token, account, email, delivery, provider connection, deployment activation, real invitation, participant, live session, exported telemetry, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath First-Session Observability and Rollback
Consent fixture: required
Session fixture: pseudonymous
Allowed events: 4
Allowed event fields: 4
Maximum duration: 30 minutes
Rollback owner: required
Checkpoint digest: required
Telemetry mode: local aggregate only
Raw content captured: false
Telemetry exported: false
Provider connected: false
Network requests: 0
Live session started: false
Participant created: false
Public launch: blocked

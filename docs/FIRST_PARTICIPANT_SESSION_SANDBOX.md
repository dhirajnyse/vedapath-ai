# v5.0.9 First Participant Session Sandbox

## Purpose

A thirty-minute maximum sandbox now rehearses arrival, source reading, local reflection, and exit with pseudonymous consent, strict event fields, read-only mode, no live model, no persistence, and no external participant.

## What Changed

Adds a deterministic first-session sandbox with pseudonymous participant and consent checks, thirty-minute duration limit, four-event order and field allowlist, read-only and local-only requirements, direct-identity rejection, transcript hashing, and permanent zero-network, zero-durable-write, zero-participant, and zero-real-session outputs.

## Files Changed

- `firstparticipantsessionsandbox.html`
- `data/vedapath-first-participant-session-sandbox.json`
- `docs/FIRST_PARTICIPANT_SESSION_SANDBOX.md`
- `scripts/vedapath-first-participant-session-sandbox.mjs`
- `scripts/apply-v507-v511-private-pilot-validation-batch.mjs`
- `scripts/check-v507-v511-private-pilot-validation.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`

## Acceptance Checks

node --check scripts/vedapath-first-participant-session-sandbox.mjs; valid, consent, identity, duration, event order, event field, read-only, local-only, network, persistence, live-model, write-route, participant, and public-access assertions; batch checker through v5.0.9; static links.

## Known Risks

Private-pilot validation evidence only; no credentials, direct identity, token, account, email, delivery, live invitation, real participant, external notification, provider mutation, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath First Participant Session Sandbox
Pseudonymous participant: required
Sandbox consent: recorded
Maximum duration: 30 minutes
Mode: read-only and local-only
Allowed events: 4
Live model: disabled
Network requests: 0
Durable writes: 0
Participant created: false
Invitation issued: false
Real session started: false
Public launch: blocked

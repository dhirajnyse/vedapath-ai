# v4.9.0 Rights Operations Queue

## Purpose

A session-only queue now lets bounded prototype roles claim, route, hold, and mark evidence ready while preserving immutable publication and registry locks.

## What Changed

Adds a pure queue transition contract, role-aware session workflow, status filters, visible audit events, explicit copy and reset controls, and invariants that keep publication blocked and registry merge manual.

## Acceptance Checks

node --check scripts/vedapath-rights-operations-queue.mjs; node --check assets/vedapath-rights-operations-queue.js; authorized and denied transition tests; invariant and immutability assertions; batch checker through v4.9.0; browser interaction QA.

## Known Risks

Controlled-pilot foundation only; no provider deployment, real authentication, durable queue, production monitoring, licensed corpus delivery, live AI generation, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Rights Operations Queue v4.9.0
Persistence: page session only.
Identity: unverified role label.
Publication: blocked.
Registry merge: manual only.

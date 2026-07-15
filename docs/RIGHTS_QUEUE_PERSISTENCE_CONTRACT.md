# v4.9.5 Rights Queue Persistence Contract

## Purpose

A reference repository now proves optimistic concurrency, idempotent event replay, role-aware transitions, append-only audit history, and immutable publication locks without pretending page memory is durable storage.

## What Changed

Adds a provider-neutral queue repository, expected-version conflicts, idempotency keys, append-only audit events, immutable publication and registry locks, a functional browser simulator, and explicit no-database posture.

## Acceptance Checks

node --check scripts/vedapath-rights-queue-repository.mjs; node --check assets/vedapath-queue-persistence-simulator.js; successful transition, idempotent replay, stale conflict, denied role, immutable input, audit, publication, and registry-lock assertions; batch checker through v4.9.5; browser interaction QA.

## Known Risks

Pilot implementation reference only; no provider deployment, real identity provider, production secrets, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Rights Queue Persistence Contract
Concurrency: expected record version
Retry safety: idempotent event id
Audit: append one event per accepted transition
Authorization: bounded reviewer role
Publication: blocked
Registry merge: manual only
Durable provider: not connected
Identity provider: not connected.

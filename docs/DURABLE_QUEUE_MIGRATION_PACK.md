# v5.0.0 Durable Queue Migration Pack

## Purpose

A hash-chained append-only ledger now verifies event order, expected record versions, retry idempotency, role-bounded transitions, replay recovery, immutable publication locks, and tamper detection before a database provider is connected.

## What Changed

Adds a canonical SHA-256 event ledger, genesis and previous-hash chaining, optimistic concurrency, idempotent receipts, bounded queue actions and reviewer roles, replay verification, tamper detection, and permanent publication and registry locks.

## Acceptance Checks

node --check scripts/vedapath-durable-queue-ledger.mjs; append, idempotent replay, stale version, denied action, denied role, lane mismatch, hash-chain verification, tamper detection, deterministic replay, publication, and registry-lock assertions; batch checker through v5.0.0.

## Known Risks

Private-pilot implementation evidence only; no provider account, credentials, endpoint, live identity provider, durable database, licensed corpus delivery, live AI generation, payments, external invitations, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Durable Queue Migration Pack
Event model: append-only
Hash chain: SHA-256 canonical event content
Concurrency: expected record version
Retry safety: idempotency key
Recovery: verified deterministic replay
Publication: blocked
Registry merge: manual only
Durable provider: not connected
Production migration run: false

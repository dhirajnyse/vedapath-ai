# v5.4.4 Durable Database Cutover Rehearsal

Adds a blue-green memory-backed cutover rehearsal with checksummed plans, referential integrity, count and checksum parity, idempotent replay, simulated failure rollback, and explicit return to the blue slot.

## Goal

Prove the cutover and rollback sequence before selecting or writing to a real durable database.

## Flow

1. Snapshot a checked source dataset.
2. Copy every related table to green.
3. Compare counts, checksum, and references.
4. Switch or restore blue as one bounded operation.

## Contract checks

- **References:** Validated before switch
- **Parity:** Counts and checksum
- **Failure:** Full state rollback
- **Retry:** One completed run

## Packet

- `strategy:blue-green`
- `parity:verified`
- `idempotent:true`
- `rollback:true`
- `durable-provider:null`

## Boundary

Private-pilot deployment readiness only; provider and region activation, managed production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

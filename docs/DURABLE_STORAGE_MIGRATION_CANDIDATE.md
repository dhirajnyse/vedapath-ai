# v5.3.9 Durable Storage Migration Candidate

Adds a versioned four-table migration plan with checksum verification, transactional commit, rollback on failure, referential integrity, and idempotent replay in a memory-backed candidate store.

## Goal

Prove migration behavior and rollback before choosing or writing to a real durable database.

## Flow

1. Build a checksummed plan.
2. Validate references before commit.
3. Commit all tables transactionally.
4. Replay safely or restore the snapshot.

## Contract checks

- **Checksum:** Plan integrity required
- **References:** Queue source must exist
- **Failure:** Full rollback
- **Retry:** One migration record

## Packet

- `schema:1`
- `tables:4`
- `transactional:true`
- `idempotent:true`
- `durable-provider:null`

## Boundary

Private-pilot platform candidate only; provider and region binding, production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

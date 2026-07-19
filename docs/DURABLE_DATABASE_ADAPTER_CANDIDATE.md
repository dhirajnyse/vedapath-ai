# v5.5.0 Durable Database Adapter Candidate

Adds a provider-neutral transactional repository candidate with schema versioning, idempotent receipts, optimistic concurrency, atomic rollback, checksummed checkpoints, restore, and synthetic-data enforcement.

## Goal

Prove durable repository behavior before choosing or binding a production database.

## Flow

1. Commit one synthetic source transaction.
2. Replay safely and reject a stale revision.
3. Roll back an unsafe personal-data write.
4. Checkpoint, advance, and restore the prior snapshot.

## Contract checks

- **Concurrency:** Revision guarded
- **Failure:** Atomic rollback
- **Restore:** Checksummed
- **Data:** Synthetic only

## Packet

- `schema:1`
- `transactions:atomic`
- `idempotency:true`
- `checkpoints:true`
- `durable-provider:null`

## Boundary

Hosted-pilot implementation evidence only; provider activation, managed production credentials, durable production data, real external identities, participant telemetry, live AI, deployment, and public launch remain closed.

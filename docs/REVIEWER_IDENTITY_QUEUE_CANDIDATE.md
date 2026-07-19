# v5.3.5 Reviewer Identity & Queue Candidate

Adds fixture session verification, reviewer role enforcement, owner-aware queue transitions, idempotency keys, required decision notes, and an append-only audit stream.

## Goal

Prove the reviewer service boundary before selecting a real identity provider or durable queue store.

## Flow

1. Verify a reviewer session.
2. Claim one open ticket.
3. Record a noted decision.
4. Replay retries without duplicate events.

## Contract checks

- **Missing session:** 401
- **Wrong role:** 403
- **Decision note:** Required
- **Idempotency:** Replay safe

## Packet

- `identity:fixture-session-verifier`
- `role:reviewer`
- `owner:required`
- `audit:append-only`
- `idempotency:required`

## Boundary

Hosted-pilot candidate only; vendor and region remain unbound, secrets are references only, persistence is ephemeral, telemetry and live AI are off, and public launch and production authorization remain closed.

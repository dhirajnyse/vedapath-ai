# v5.3.6 Consent Ledger Service Candidate

Completes the hosted-candidate runtime with participant role checks, append-only consent events, idempotent retries, effective-consent projection, and explicit export and deletion requests.

## Goal

Make every candidate learning or memory action consent-bound before telemetry or durable storage can exist.

## Flow

1. Verify a participant session.
2. Append purpose and scope.
3. Derive effective consent.
4. Keep export and deletion requests visible.

## Contract checks

- **Identity:** Pseudonymous fixture
- **Withdrawal:** Immediate projection
- **Export/deletion:** Explicit events
- **Launch:** Still closed

## Packet

- `consent:append-only`
- `projection:effective`
- `idempotency:required`
- `telemetry:off`
- `public-launch:false`

## Boundary

Hosted-pilot candidate only; vendor and region remain unbound, secrets are references only, persistence is ephemeral, telemetry and live AI are off, and public launch and production authorization remain closed.

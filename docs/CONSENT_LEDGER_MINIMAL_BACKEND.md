# v5.3.1 Consent Ledger Minimal Backend

Adds an append-only consent ledger adapter for grant, withdrawal, export request, and deletion request events, plus an integrated backend-readiness gate.

## Goal

Prove that pilot memory and learning signals remain consent-bound before hosted storage is authorized.

## Flow

1. Record explicit purpose and scope.
2. Append grant or withdrawal events.
3. Record export and deletion requests.
4. Keep telemetry and hosted writes disabled by default.

## Decisions

- Use append-only consent events rather than mutable flags.
- Separate withdrawal from deletion so both remain auditable.
- Require founder review before selecting real identity, database, or hosting services.

## Packet

- `ledger:append-only`
- `identity:pseudonymous`
- `consent:explicit`
- `withdrawal:supported`
- `telemetry:disabled`

## Boundary

Minimal-backend prototype only; no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.

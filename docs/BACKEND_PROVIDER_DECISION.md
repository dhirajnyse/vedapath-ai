# v5.2.8 Backend Provider Decision

Compares three backend patterns and selects an edge-worker plus relational-storage pattern for the smallest private pilot slice.

## Goal

Choose a backend shape by privacy, operational simplicity, reversibility, and bounded cost rather than feature volume.

## Flow

1. Compare privacy and data residency.
2. Compare operational burden and rollback.
3. Select only the minimum provider pattern.
4. Defer vendor binding until credentials are approved.

## Decisions

- Use an edge worker with relational storage as the implementation pattern.
- Keep the static interface independently deployable.
- Require explicit region, secret, backup, and deletion choices before hosting.

## Packet

- `pattern:edge-worker-relational`
- `frontend:static-pages`
- `region:founder-reviewed`
- `secrets:binding-only`
- `rollback:required`

## Boundary

Minimal-backend prototype only; no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.

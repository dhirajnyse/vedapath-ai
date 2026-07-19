# v5.2.7 Founder Hosted-Pilot Review Gate

Turns the hosted-pilot architecture into a founder decision packet with evidence, unresolved conditions, and an explicit spike-only authorization lane.

## Goal

Make the hosted-pilot decision reviewable without accidentally authorizing deployment or launch.

## Flow

1. Confirm the readiness evidence.
2. Name every unresolved condition.
3. Choose hold, rework, or spike-only review.
4. Keep deployment and public launch closed.

## Decisions

- Authorize only a local or private implementation spike.
- Do not treat document completeness as production readiness.
- Carry all four launch blockers into the provider decision.

## Packet

- `evidence:gap-map`
- `evidence:threat-model`
- `evidence:privacy-ledger`
- `evidence:rights-pack`
- `decision:review`

## Boundary

Minimal-backend prototype only; no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.

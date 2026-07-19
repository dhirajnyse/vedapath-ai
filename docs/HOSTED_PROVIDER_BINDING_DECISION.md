# v5.4.2 Hosted Provider Binding Decision

Adds a checksummed, maker-checker-reviewed hosted binding manifest with eight required evidence gates and reference-only runtime, storage, identity, and secret bindings while operational activation remains false.

## Goal

Turn the provider recommendation into a reviewable implementation decision without silently binding infrastructure or granting deployment authority.

## Flow

1. Name the candidate host and residency region.
2. Review eight independent evidence gates.
3. Checksum one reference-only binding manifest.
4. Keep operational activation and deployment false.

## Contract checks

- **Residency:** Explicit evidence
- **Review:** Different maker and checker
- **Bindings:** References only
- **Activation:** Still blocked

## Packet

- `evidence:8/8`
- `review:maker-checker`
- `manifest:checksummed`
- `operational-binding:false`
- `deployment:false`

## Boundary

Private-pilot deployment readiness only; provider and region activation, managed production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

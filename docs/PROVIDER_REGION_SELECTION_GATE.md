# v5.3.7 Provider & Region Selection Gate

Adds an evidence-complete provider and region comparison gate with residency, rights, privacy, security, rollback, exit, and cost requirements while operational binding remains deferred.

## Goal

Make provider and region comparison reviewable without silently converting a recommendation into deployment authority.

## Flow

1. Name one candidate provider and region.
2. Review six independent evidence gates.
3. Record a bounded recommendation.
4. Keep operational binding at false.

## Contract checks

- **Residency:** Evidence required
- **Exit plan:** Required before recommendation
- **Cost:** Explicit monthly cap
- **Authority:** Recommendation is not binding

## Packet

- `decision:recommend-candidate`
- `evidence:6-gates`
- `cost-cap:required`
- `provider-bound:false`
- `region-bound:false`

## Boundary

Private-pilot platform candidate only; provider and region binding, production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

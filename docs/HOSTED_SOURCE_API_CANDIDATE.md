# v5.3.4 Hosted Source API Candidate

Implements a fetch-compatible read-only Source API candidate with explicit no-source behavior, CORS refusal, request IDs, no-store responses, body limits, and ephemeral rate limiting.

## Goal

Join the source contract to a deployable runtime shape without enabling answer generation or source mutation.

## Flow

1. Accept one bounded source ID.
2. Apply origin and rate boundaries.
3. Return reviewed fixture fields.
4. Return explicit no-source without guessing.

## Contract checks

- **CORS:** Allowlist only
- **Cache:** No store
- **Mutation:** Method rejected
- **Generated answer:** Always null

## Packet

- `GET:/v1/health`
- `GET:/v1/readiness`
- `GET:/v1/sources/:id`
- `answer-generation:false`
- `mutation-routes:0`

## Boundary

Hosted-pilot candidate only; vendor and region remain unbound, secrets are references only, persistence is ephemeral, telemetry and live AI are off, and public launch and production authorization remain closed.

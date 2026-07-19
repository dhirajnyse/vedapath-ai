# v5.2.9 Source API Minimal Endpoint

Implements a deterministic read-only source endpoint contract with citation fields, rights posture, safe no-source behavior, and local HTTP smoke coverage.

## Goal

Prove one citation-safe source read path before any answer generation or broad corpus access exists.

## Flow

1. Receive one source record ID.
2. Verify citation and rights fields.
3. Return a bounded source packet or no-source response.
4. Never generate or mutate an answer.

## Decisions

- Expose only reviewed fixture records in the spike.
- Use stable source IDs and explicit rights status.
- Treat unknown IDs as a normal no-source result, not a guessed answer.

## Packet

- `method:GET`
- `route:/api/sources/:id`
- `rights:required`
- `no-source:explicit`
- `answer-generation:blocked`

## Boundary

Minimal-backend prototype only; no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.

# Minimal Hosted Pilot Architecture Decision

Chooses the smallest hosted-pilot architecture posture: one bounded source API, reviewer queue, consent ledger, and read-only demo shell.

## Goal

Choose the smallest real backend slice without authorizing production launch.

## Boundary

Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.

## Required Flow

1. Select only the minimum hosted slice.
2. Keep source API, review queue, consent, and logs separate.
3. Require founder review before any deployment.
4. Keep public launch closed.

## Decision Options

- Prototype on a bounded backend path only.
- Do not connect payment, broad accounts, or public AI access.
- Use this packet as the next founder review input.

## Packet

- architecture: minimal-hosted-pilot
- source-api: bounded
- review-queue: required
- consent-ledger: required
- owner:founder

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, store production data, run live AI, publish telemetry, deliver a corpus, invite public participants, or authorize launch.

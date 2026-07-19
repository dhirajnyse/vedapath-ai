# Security Threat Model

Adds a founder-readable threat model for identity, source data, review queues, telemetry, prompt injection, and abuse boundaries.

## Goal

Turn launch anxiety into named risks, mitigations, owners, and explicit non-capabilities.

## Boundary

Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.

## Required Flow

1. List threats by asset.
2. Pair each threat with mitigation and owner.
3. Block secret collection in fixtures.
4. Keep live identity and storage disabled.

## Decision Options

- Use least-privilege reviewer roles.
- Treat prompt injection and source poisoning as first-class risks.
- Require incident notes before public pilot decisions.

## Packet

- asset: identity
- asset: source-records
- threat: prompt-injection
- mitigation: reviewer-gate
- owner:security

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, store production data, run live AI, publish telemetry, deliver a corpus, invite public participants, or authorize launch.

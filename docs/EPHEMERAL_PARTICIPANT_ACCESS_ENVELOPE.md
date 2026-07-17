# Ephemeral Participant Access Envelope

A least-permission access envelope now binds the redacted session token to one pseudonymous participant role, one consent receipt, one session window, and one revocation path without creating identity or storage.

## Goal

Keep participant access ephemeral, scoped, and reversible.

## Boundary

Private-pilot execution readiness evidence only; all records are deterministic fixtures. No credentials, direct identity, token value, account, email delivery, provider connection, deployment activation, live invitation, participant creation, live session, telemetry export, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Required Flow

1. Token digest
2. Consent receipt
3. Role
4. Revocation

## Decision Options

- Accept access envelope
- Shorten session window
- Return to consent handshake

## Packet

- Role: pilot-learner-readonly
- Consent receipt: consent-fixture-v1
- Session window: 30 minutes
- Durable account: false

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, create participants, start a session, export telemetry, or authorize public launch.

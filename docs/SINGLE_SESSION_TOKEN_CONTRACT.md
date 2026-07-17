# Single-Session Token Contract

A redacted token-request contract now defines one short-lived, one-session, pseudonymous access shape without issuing a token value, account, email, or provider mutation.

## Goal

Make private session access reviewable before any token exists.

## Boundary

Private-pilot execution readiness evidence only; all records are deterministic fixtures. No credentials, direct identity, token value, account, email delivery, provider connection, deployment activation, live invitation, participant creation, live session, telemetry export, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Required Flow

1. Subject
2. Scope
3. TTL
4. Digest

## Decision Options

- Accept redacted token envelope
- Reduce scope
- Reject until replay protection is clearer

## Packet

- Subject: pilot-subject-001
- TTL: 30 minutes
- Token value: redacted-none
- Issuer: fixture-only

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, create participants, start a session, export telemetry, or authorize public launch.

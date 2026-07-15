# v5.1.3 One-Invitation Adapter Contract

## Purpose

A fixture-only adapter now binds readiness, pseudonymous identity, role, purpose, idempotency, pending consent, and seventy-two-hour expiry into one deterministic digest with no transport or provider path.

## What Changed

Adds a one-invitation adapter evaluator with stack-readiness dependency, pseudonymous identifiers, idempotency, bounded role and purpose, pending-consent posture, seventy-two-hour expiry, canonical request digest, direct-identity rejection, and permanent no-token, no-account, no-email, no-delivery, no-provider-mutation, and no-invitation outputs.

## Files Changed

- `oneinvitationadapter.html`
- `data/vedapath-one-invitation-adapter.json`
- `docs/ONE_INVITATION_ADAPTER_CONTRACT.md`
- `scripts/vedapath-one-invitation-adapter.mjs`
- `scripts/apply-v512-v516-private-pilot-operations-batch.mjs`
- `scripts/check-v512-v516-private-pilot-operations.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`
- `historical compatibility checkers`

## Acceptance Checks

node --check scripts/vedapath-one-invitation-adapter.mjs; valid, readiness, identifiers, idempotency, role, purpose, consent, transport, expiry, identity, token, account, email, provider, and public-access assertions; batch checker through v5.1.3; static links.

## Known Risks

Private-pilot operations contract evidence only; candidate stack, invitation adapter, consent, observability, and founder review remain deterministic fixtures. No credentials, direct identity, token, account, email, delivery, provider connection, deployment activation, real invitation, participant, live session, exported telemetry, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath One-Invitation Adapter Contract
Stack readiness: required
Pseudonymous participant: required
Role and purpose: bounded
Consent: pending
Idempotency key: required
Expiry: 72 hours maximum
Delivery mode: fixture only
Transport: none
Token created: false
Account created: false
Email sent: false
Provider mutation: false
Invitation issued: false
Public launch: blocked

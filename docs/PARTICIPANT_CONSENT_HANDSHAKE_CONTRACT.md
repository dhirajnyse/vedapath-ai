# v5.1.4 Participant Consent Handshake Contract

## Purpose

A fixture-only consent handshake now requires an adult-volunteer attestation, source-first scope, bounded safety-and-quality data use, zero telemetry, pre-session withdrawal, pseudonymous identity, and seventy-two-hour expiry.

## What Changed

Adds a participant-consent handshake evaluator with adapter dependency, versioned consent and privacy notice, adult-volunteer attestation, source-first scope, bounded data use, zero-telemetry and withdrawal requirements, seventy-two-hour expiry, deterministic receipt digest, direct-identity rejection, and permanent no-account, no-token, no-participant, and no-session outputs.

## Files Changed

- `participantconsenthandshake.html`
- `data/vedapath-participant-consent-handshake.json`
- `docs/PARTICIPANT_CONSENT_HANDSHAKE_CONTRACT.md`
- `scripts/vedapath-participant-consent-handshake.mjs`
- `scripts/apply-v512-v516-private-pilot-operations-batch.mjs`
- `scripts/check-v512-v516-private-pilot-operations.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`
- `historical compatibility checkers`

## Acceptance Checks

node --check scripts/vedapath-participant-consent-handshake.mjs; valid, adapter, fixture mode, versions, attestation, scope, data use, telemetry, withdrawal, identity, expiry, account, token, session, and public-access assertions; batch checker through v5.1.4; static links.

## Known Risks

Private-pilot operations contract evidence only; candidate stack, invitation adapter, consent, observability, and founder review remain deterministic fixtures. No credentials, direct identity, token, account, email, delivery, provider connection, deployment activation, real invitation, participant, live session, exported telemetry, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Participant Consent Handshake Contract
Adapter status: required
Consent mode: fixture only
Consent version: required
Privacy notice version: required
Adult volunteer attestation: required
Scope: source-first reflection only
Data use: session safety and quality only
Telemetry: none
Withdrawal: available before session
Expiry: 72 hours maximum
Account created: false
Participant created: false
Session started: false
Public launch: blocked

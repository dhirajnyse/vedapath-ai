# v5.0.7 Private Invitation Issuance Dry Run

## Purpose

A deterministic dry-run contract now proves the exact participant role, purpose, consent, expiry, founder owner, and zero-delivery boundary before any real invitation system is considered.

## What Changed

Adds a pure private-invitation dry-run evaluator with pseudonymous identifiers, direct-identity rejection, seventy-two-hour expiry, bounded role and purpose, consent and founder ownership checks, deterministic request digest, and permanent zero-token, zero-account, zero-email, zero-delivery, and zero-invitation outputs.

## Files Changed

- `privateinvitationdryrun.html`
- `data/vedapath-private-invitation-dry-run.json`
- `docs/PRIVATE_INVITATION_ISSUANCE_DRY_RUN.md`
- `scripts/vedapath-private-invitation-dry-run.mjs`
- `scripts/apply-v507-v511-private-pilot-validation-batch.mjs`
- `scripts/check-v507-v511-private-pilot-validation.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`
- `historical compatibility checkers`

## Acceptance Checks

node --check scripts/vedapath-private-invitation-dry-run.mjs; valid, incomplete, direct-identity, token, email, delivery, expiry, public-access, existing-invitation, and participant assertions; batch checker through v5.0.7; static links.

## Known Risks

Private-pilot validation evidence only; no credentials, direct identity, token, account, email, delivery, live invitation, real participant, external notification, provider mutation, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Private Invitation Issuance Dry Run
Activation decision: required
Pseudonymous participant: required
Role: private learner
Purpose: source-first private pilot
Consent: recorded
Maximum expiry: 72 hours
Delivery channel: none
Token created: false
Account created: false
Email sent: false
Invitation issued: false
External participants: 0
Public launch: blocked

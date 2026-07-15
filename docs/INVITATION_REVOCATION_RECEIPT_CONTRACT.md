# v5.0.8 Invitation Revocation Receipt Contract

## Purpose

A deterministic receipt now links one dry-run request to an allowlisted reason, named owner, ordered timeline, and immutable digest without mutating a provider or notifying a participant.

## What Changed

Adds a deterministic invitation-revocation receipt evaluator tied to the dry-run digest, allowlisted cancellation reasons, named owner and ordered timeline checks, receipt hashing, and explicit rejection of issued, tokenized, in-use, public, or participant-bearing states.

## Files Changed

- `invitationrevocationreceipt.html`
- `data/vedapath-invitation-revocation-receipt.json`
- `docs/INVITATION_REVOCATION_RECEIPT_CONTRACT.md`
- `scripts/vedapath-invitation-revocation-receipt.mjs`
- `scripts/apply-v507-v511-private-pilot-validation-batch.mjs`
- `scripts/check-v507-v511-private-pilot-validation.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`

## Acceptance Checks

node --check scripts/vedapath-invitation-revocation-receipt.mjs; valid, digest, reason, owner, timeline, issued, token, in-use, participant, and public-access assertions; batch checker through v5.0.8; static links.

## Known Risks

Private-pilot validation evidence only; no credentials, direct identity, token, account, email, delivery, live invitation, real participant, external notification, provider mutation, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Invitation Revocation Receipt Contract
Dry-run request digest: required
Cancellation reason: allowlisted
Revocation owner: required
Timeline: ordered
Live invitation: absent
Live token: absent
Invitation in use: false
Provider mutation: false
Notification sent: false
External participants: 0
Public launch: blocked

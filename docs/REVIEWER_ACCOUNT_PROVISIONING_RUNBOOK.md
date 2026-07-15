# v5.0.4 Reviewer Account Provisioning Runbook

## Purpose

A provisioning planner now validates pseudonymous reviewer IDs, four bounded roles, named sponsors, AAL2 assurance, recorded privacy consent, fourteen-day expiry, and a six-reviewer private-pilot ceiling.

## What Changed

Adds a reviewer-account planning module with pseudonymous identifiers, direct-identity rejection, four role capability sets, sponsor and AAL2 requirements, recorded consent, fourteen-day expiry, duplicate checks, a six-reviewer ceiling, and permanent zero-account, zero-credential, and zero-invitation outputs.

## Files Changed

- `revieweraccountprovisioningrunbook.html`
- `data/vedapath-reviewer-account-provisioning-runbook.json`
- `docs/REVIEWER_ACCOUNT_PROVISIONING_RUNBOOK.md`
- `scripts/vedapath-reviewer-account-plan.mjs`

## Acceptance Checks

node --check scripts/vedapath-reviewer-account-plan.mjs; valid plan plus direct-identity, unsupported-role, missing-AAL2, missing-consent, expiry, duplicate, and reviewer-limit assertions; batch checker through v5.0.4; static links.

## Known Risks

Private implementation evidence only; no credentials, secret values, reviewer accounts, provider endpoint, durable production migration, external invitation, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Reviewer Account Provisioning Runbook
Reviewer identifiers: pseudonymous only
Role types: 4
Private-pilot reviewer ceiling: 6
Sponsor: required
AAL2: required
Privacy consent: recorded before provisioning
Maximum lifetime: 14 days
Direct identity stored: false
Accounts created: 0
Credentials issued: 0
Invitations issued: 0
Public launch: blocked

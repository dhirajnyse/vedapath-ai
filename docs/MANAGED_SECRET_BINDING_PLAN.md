# v5.0.3 Managed Secret Binding Plan

## Purpose

A strict validator now allowlists the session, reviewer-store, and queue-integrity bindings with owners, scopes, rotation windows, pilot-only environment, and mandatory redaction.

## What Changed

Adds a managed-secret binding validator for exactly three required names, secret-reference format checks, duplicate detection, scoped owners, ninety-day rotation ceilings, pilot-only environment rules, redacted safe summaries, and permanent no-apply and no-provider side effects.

## Files Changed

- `managedsecretbindingplan.html`
- `data/vedapath-managed-secret-binding-plan.json`
- `docs/MANAGED_SECRET_BINDING_PLAN.md`
- `scripts/vedapath-managed-secret-binding.mjs`

## Acceptance Checks

node --check scripts/vedapath-managed-secret-binding.mjs; valid, missing, unknown, value-bearing, duplicate, rotation, environment, and redaction assertions; safe-output inspection; batch checker through v5.0.3; static links.

## Known Risks

Private implementation evidence only; no credentials, secret values, reviewer accounts, provider endpoint, durable production migration, external invitation, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Managed Secret Binding Plan
Session signing binding: specified, not applied
Reviewer store binding: specified, not applied
Queue integrity binding: specified, not applied
Environment: pilot only
Owners: required
Rotation: 90 days maximum
Reference paths in safe output: 0
Secret values serialized: 0
Provider connected: false
Public launch: blocked

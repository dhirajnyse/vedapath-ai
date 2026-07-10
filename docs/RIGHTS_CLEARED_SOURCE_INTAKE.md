# v4.8.4 Rights-Cleared Source Intake

## Purpose

The new intake contract validates citation, family, summary, boundary, rights lane, evidence, and reviewer routing while keeping every candidate blocked from publication.

## What Changed

Adds a machine-readable intake contract, pure validator, browser intake desk, guarded rights lanes, sample fixtures, and a publication lock that client input cannot override.

## Acceptance Checks

node --check scripts/vedapath-source-intake-validator.mjs; node --check assets/vedapath-source-intake.js; valid and invalid intake fixtures; batch checker through v4.8.4; browser form QA.

## Known Risks

Private-demo tooling only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Rights-Cleared Source Intake v4.8.4
Output: vedapath.source-intake.v1 draft packet.
Invariant: publication_state is always blocked.
Boundary: metadata and reviewed summary only; no translation text.

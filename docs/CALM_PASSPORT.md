# VedaPath Calm Passport

Calm Passport is the v0.5.1 user-control preview for VedaPath AI.

It turns the Trust Model into a plain user-facing promise: the user can see what VedaPath may remember, what it must not remember, how to export it, and how to delete or withdraw it.

## Why It Exists

VedaPath is a calm product. Calmness becomes fragile if the product remembers silently.

The Calm Passport gives the user one visible rule:

Memory should be visible, reversible, minimal, exportable, deleteable, reviewable, and source-tied.

## Current Prototype

The v0.5.1 Calm Passport includes:

- six passport record types:
  - Daily calm pattern
  - Source shelf
  - Shared circle note
  - Reviewer correction
  - Account profile
  - Distress boundary
- may-remember fields
- must-not-remember fields
- user-control toggles
- local saved passport grants
- copyable passport brief
- copyable delete request

All saved state is browser-local only.

## Product Role

Calm Passport translates backend trust into user language.

It should:

- tell users what is eligible for memory
- tell users what is blocked from memory
- show whether a record is local, review, consent-first, or do-not-retain
- make export and deletion visible before account-backed memory
- prevent private calm patterns from becoming hidden profiles
- route shared or knowledge-changing records through consent, review, and audit

## What It Is Not

Calm Passport is not:

- a privacy policy
- legal advice
- production identity verification
- a therapy record
- a hidden scoring system
- a reason to collect more personal data
- a guarantee of backend deletion before the backend exists

## Next Step

v0.5.2 adds the first backend schema draft for `source_seed`, `consent_grant`, `memory_route`, `review_decision`, `trust_event`, `calm_pattern`, and `passport_grant`. v0.5.3 adds schema fixtures, export payloads, deletion lifecycle notes, route validations, and no-go tests. v0.5.4 adds the Evaluation Drill Room, combining answer checks, fixture checks, and no-go cases. v0.5.5 adds the Learning Loop Seed for repeated questions, reviewer decisions, source gaps, and blocked learning boundaries without hidden profiling. v0.5.6 adds the Sanskrit Lens Seed with Sanskrit text, transliteration, word meaning, meter status, translation notes, source URLs, and recitation boundaries. v0.5.7 adds the Voice Boundary Seed before any audio feature: silent pronunciation support, syllable hints, reviewer gate, license gate, and no ritual authority. v0.5.8 should add a Scholar Review Seed.

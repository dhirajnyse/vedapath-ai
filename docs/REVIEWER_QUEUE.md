# Reviewer Queue

Reviewer Queue is the human-review bridge for VedaPath AI.

It turns failed dashboard examples, flagged passage decisions, retrieval gaps, and user correction notes into visible review cards.

## Product Role

The queue prevents silent knowledge changes.

When the prototype finds a source-family error, unsafe calm boundary, ritual authority issue, modern overclaim, or interpretation flattening risk, the issue should become a review card before it changes an accepted source record or answer rule.

## Current Prototype

The v0.4.3 queue includes:

- seeded review cards from Evaluation Dashboard, Passage Review Pack, Retrieval Lab, and user correction notes
- source family, risk type, severity, origin, reviewer need, and next action for each card
- filters for new, scholar, safety, and decided cards
- browser-local prototype decisions
- decision history
- copyable reviewer brief

## Why It Matters

VedaPath should improve from user feedback without blindly learning from users.

The queue protects three things:

- accuracy: source-family mistakes become review work
- safety: calm and ritual boundary issues do not pass silently
- trust: every accepted change can later carry reviewer identity and version history

## Production Requirements

Before production, this queue should become:

- authenticated reviewer workflow
- source edition and translation policy fields
- reviewer identity and role
- safety review labels
- versioned decision history
- links back to source seeds, passage dossiers, evaluator fixtures, source policy routes, and answer rules
- exportable audit evidence

## Boundary

The current queue is prototype triage only.

It is not final scholarship, source licensing approval, moderation policy, safety approval, or production governance.

## Next Step

v0.4.4 adds Source Policy Console. v0.4.5 adds Trust Ledger so policy routes and queue decisions become visible governance records.

v0.4.6 adds Life Map so personal-life calm routes can stay source-backed, bounded, and local-only in the prototype.

v0.4.7 added Calm Circle so shared moments can stay source-backed, bounded, and local-only in the prototype.

v0.4.8 adds Consent Gate so queue, policy, ledger, life-map, calm-circle, and source-dataset records can show purpose, scope, deletion, source trace, participant consent, and review route before durable memory.

v0.4.9 adds Memory Gate so missing consent, source trace, deletion path, review route, or audit fields become visible blockers before accepted product memory changes.

v0.5.0 adds Trust Model so Reviewer Queue, Consent Gate, Memory Gate, Trust Ledger, Source Seeds, and Calm Rhythm connect as a visible production data architecture.

v0.5.1 adds Calm Passport so corrections and review records can show may-remember fields, must-not-remember fields, export, deletion, withdrawal, and local grants before account-backed memory.

v0.5.2 adds that backend schema draft. v0.5.3 adds schema fixtures, route validation examples, deletion lifecycle notes, export payloads, and no-go tests. v0.5.4 adds the Evaluation Drill Room, combining answer checks, fixture checks, and no-go cases. v0.5.5 adds the Learning Loop Seed for repeated questions, reviewer decisions, source gaps, and blocked learning boundaries without hidden profiling. v0.5.6 adds the Sanskrit Lens Seed with Sanskrit text, transliteration, word meaning, meter status, translation notes, source URLs, and recitation boundaries. v0.5.7 adds the Voice Boundary Seed before any audio feature: silent pronunciation support, syllable hints, reviewer gate, license gate, and no ritual authority. v0.5.8 adds the Scholar Review Seed with reviewer roles, evidence notes, decision states, release gates, and copyable review handoffs. v0.5.9 should add a Launch Gate Seed.

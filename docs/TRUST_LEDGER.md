# Trust Ledger

Trust Ledger turns source policy routes and reviewer queue outcomes into visible governance records.

The core idea:

Before VedaPath changes answer behavior, it should preserve the rule, source family, risk, evidence path, reviewer need, and version status.

## Why It Matters

VedaPath should not become trusted because it sounds calm.

It should become trusted because every important answer rule can show:

- where the issue came from
- which source family it affects
- what policy route applies
- who should review it
- whether it is ready, held, blocked, or still draft
- which version introduced the decision

## Current Prototype

The v0.4.5 ledger includes:

- six sample governance records
- filters for ready, review, blocked, and draft rules
- active record view with policy route, evidence path, reviewer need, source family, and risk
- local decisions for ready, review, and blocked status
- decision history
- copyable governance brief

All state is browser-local only.

## Record Statuses

### Ready Prototype

The rule can power prototype behavior, but still needs production review before becoming authoritative.

### Review Hold

The rule needs source, scholar, safety, translation, or product review before behavior changes.

### Blocked Rule

The rule should prevent or refuse a claim until better source evidence and review exist.

### Draft Rule

The rule is a planning artifact and should not drive product behavior yet.

## Production Requirements

The real product should add:

- authenticated reviewer identity
- durable versioned storage
- source edition and translation-right fields
- safety review state
- policy route links
- reviewer queue links
- evaluator fixture links
- exportable audit evidence

## Boundary

This ledger is a prototype planning surface. It is not final scholarship, safety approval, moderation policy, source licensing, legal approval, or production governance.

## Next Step

v0.4.6 adds Life Map so personal-life calm routes can stay source-backed, bounded, and local-only in the prototype.

v0.4.7 added Calm Circle so shared moments can stay source-backed, bounded, and local-only in the prototype.

v0.4.8 adds Consent Gate so ledger, life-map, calm-circle, reviewer, and source-dataset records can show purpose, scope, deletion, source trace, participant consent, and review route before durable memory.

v0.4.9 adds Memory Gate so Consent Gate fields, source trace, review route, deletion path, and audit state can block or route records before they reach Trust Ledger.

v0.5.0 adds Trust Model so Trust Ledger, Consent Gate, Memory Gate, Reviewer Queue, Source Seeds, and Calm Rhythm connect as a visible production data architecture.

v0.5.1 adds Calm Passport so trust events can show may-remember fields, must-not-remember fields, export, deletion, withdrawal, and local grants before account-backed memory.

v0.5.2 adds that backend schema draft. v0.5.3 adds schema fixtures, route validation examples, deletion lifecycle notes, export payloads, and no-go tests. v0.5.4 adds the Evaluation Drill Room, combining answer checks, fixture checks, and no-go cases. v0.5.5 adds the Learning Loop Seed for repeated questions, reviewer decisions, source gaps, and blocked learning boundaries without hidden profiling. v0.5.6 adds the Sanskrit Lens Seed with Sanskrit text, transliteration, word meaning, meter status, translation notes, source URLs, and recitation boundaries. v0.5.7 adds the Voice Boundary Seed before any audio feature: silent pronunciation support, syllable hints, reviewer gate, license gate, and no ritual authority. v0.5.8 should add a Scholar Review Seed.

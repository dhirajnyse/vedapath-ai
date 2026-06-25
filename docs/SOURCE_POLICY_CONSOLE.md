# Source Policy Console

Source Policy Console makes VedaPath's answer rules visible before the AI speaks.

The core idea:

Ask a question. First decide whether the product should answer, answer with a boundary, ask for a source, route to review, or decline/defer.

## Why It Matters

VedaPath should feel calm because it is honest about limits.

It should not:

- call every Hindu text a Veda
- turn analogy into proof
- invent source citations
- prescribe ritual practice
- become therapy, medical advice, or emergency support
- silently change accepted knowledge without review

## Current Prototype

The v0.4.4 console includes:

- question-type simulator
- gentle, standard, and strict policy modes
- answer gate: answer, boundary, review, decline/defer
- source family, pramana level, risk type, and next path
- six policy matrix rules
- copyable policy handoff
- local route-to-queue marker

All state is browser-local only.

## Policy Routes

### Answer Allowed

Use when the source is named, the passage is identifiable, and the answer can show citation and boundaries.

### Boundary Required

Use when the answer is useful but could confuse text families, ritual authority, personal advice, or popular-culture language.

### Review Route

Use when the claim needs scholar review, passage verification, source licensing, or evaluator coverage before accepted behavior changes.

### Decline Or Defer

Use when a question asks VedaPath to act as therapy, medical advice, emergency support, ritual authority, oracle, or guru.

## Production Requirements

The real product should add:

- server-side policy rules
- versioned source policy records
- reviewer identity
- source edition and translation-right fields
- safety review for calm and distress flows
- evaluator fixtures tied to each policy route
- export and audit trail

## Boundary

This console is a product prototype. It is not final theology, legal advice, medical advice, emergency support, moderation policy, or scholarly approval.

## Next Step

v0.4.5 adds Trust Ledger so every blocked, bounded, or uncertain answer can become a visible governance record.

v0.4.6 adds Life Map so personal-life calm routes can stay source-backed, bounded, and local-only in the prototype.

v0.4.7 added Calm Circle so shared moments can stay source-backed, bounded, and local-only in the prototype.

v0.4.8 adds Consent Gate so policy, ledger, queue, life-map, calm-circle, and source-dataset records can show purpose, scope, deletion, source trace, participant consent, and review route before durable memory.

v0.4.9 adds Memory Gate so missing governance fields become visible route blockers before durable memory.

v0.5.0 adds Trust Model so Source Policy Console routes, Consent Gate, Memory Gate, Trust Ledger, Reviewer Queue, Source Seeds, and Calm Rhythm connect as a visible production data architecture.

v0.5.1 adds Calm Passport so policy-sensitive records can show may-remember fields, must-not-remember fields, export, deletion, withdrawal, and local grants before account-backed memory.

v0.5.2 adds that backend schema draft. v0.5.3 adds schema fixtures, route validation examples, deletion lifecycle notes, export payloads, and no-go tests. v0.5.4 should combine answer drills with fixture drills.

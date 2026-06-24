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

v0.4.5 should connect policy routes to reviewer queue records so every blocked, bounded, or uncertain answer can become a versioned governance artifact.

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

v0.4.9 should enforce missing Consent Gate fields as blockers before accepted product memory changes.

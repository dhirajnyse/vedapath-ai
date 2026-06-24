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
- links back to source seeds, passage dossiers, evaluator fixtures, and answer rules
- exportable audit evidence

## Boundary

The current queue is prototype triage only.

It is not final scholarship, source licensing approval, moderation policy, safety approval, or production governance.

## Next Step

v0.4.4 should add a source policy console for edition, translation rights, reviewer identity, and decision history.

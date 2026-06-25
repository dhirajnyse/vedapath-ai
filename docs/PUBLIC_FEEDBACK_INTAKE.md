# VedaPath Public Feedback Intake

This is the v0.6.3 Public Feedback Intake for VedaPath AI.

The purpose is to turn launch feedback into reviewable product work without silently changing source truth or collecting private distress.

## Intake Promise

Public feedback can improve VedaPath only after it becomes a ticket, gets routed, and is reviewed.

Feedback should never directly rewrite:

- source records
- source-family labels
- answer behavior
- launch copy
- boundary language
- reviewer decisions

## Feedback Categories

### source_issue

Use when a visitor reports:

- wrong citation
- missing passage
- source-family mismatch
- source URL issue
- unsupported source claim

Route:

- Source reviewer
- Translation reviewer when meaning is involved

No-go:

- no direct source rewrite from visitor feedback
- no accepted correction without evidence
- no private distress in the ticket

### category_confusion

Use when a visitor reports confusion between:

- Veda
- Upanishad
- Bhagavad Gita
- Itihasa
- Purana
- commentary
- modern interpretation

Route:

- Source reviewer
- Boundary reviewer if copy could shame or overclaim

No-go:

- no shaming the visitor for popular wording
- no flattening philosophical connections
- no instant promotion without review

### ux_friction

Use when a visitor reports:

- confusing label
- crowded card
- unclear button
- mobile issue
- flow confusion
- too many choices

Route:

- Product backlog
- Boundary reviewer if the UX encourages overclaiming

No-go:

- no feature pileup
- no hidden tracking
- no source rewrite from UX feedback

### boundary_concern

Use when a visitor reports:

- guru voice
- therapy claim
- ritual advice
- crisis-use concern
- modern proof overclaim
- privacy concern

Route:

- Boundary reviewer
- Launch Gate when public copy is involved

No-go:

- no emergency support through public feedback
- no private distress archive
- no spiritual-authority escalation

## Required Ticket Fields

- `feedback_id`
- `ticket_type`
- `visitor_note`
- `reviewer_route`
- `priority`
- `intake_state`
- `evidence_needed`
- `release_id`
- `boundary_note`

## Triage Rules

1. Categorize the feedback.
2. Sanitize personal data and private distress.
3. Route the feedback to review, product backlog, or launch boundary.
4. Match duplicates before creating more work.
5. Promote nothing until evidence and reviewer decision exist.

## Product Boundary

This preview is device-local and does not submit data to a server.

It does not accept feedback as truth, collect private distress, replace reviewers, or provide emergency support.

## v0.6.4 Launch Story

v0.6.4 adds the Launch Story Room so public launch copy can explain VedaPath with warmth, accuracy, source-first humility, no-go claims, reviewer asks, and no overclaiming.

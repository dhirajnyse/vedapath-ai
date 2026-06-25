# VedaPath Scholar Review Seed

This is the v0.5.8 Scholar Review preview for VedaPath AI.

## Product Question

Can VedaPath show what has been reviewed, what evidence supports it, and what remains blocked before the product increases confidence?

## What It Adds

- reviewer roles
- evidence notes
- release decisions
- promotion states
- launch gates
- copyable review brief
- copyable gate JSON
- copyable boundary note

## Why It Matters

Source-first products can still overclaim if review is vague.

VedaPath should separate:

- Sanskrit text review
- translation or interpretation review
- product-boundary review
- rights and audio review
- production promotion decisions

## Prototype Cases

### Sanskrit Lens Source Card

Decision:

- prototype approved
- production pending

Open needs:

- source edition metadata
- rights status

### Gayatri Voice Boundary

Decision:

- silent preview allowed
- audio blocked

Open needs:

- accent review
- source edition review
- performer consent
- audio license
- allowed surfaces
- takedown path

### Katha Upanishad Tone Review

Decision:

- review required

Open needs:

- source edition
- translation context
- tone rubric
- calm-boundary check

## Production Fields

Every future review record should include:

- `review_id`
- `record_type`
- `record_id`
- `source_seed_id`
- `citation`
- `review_role`
- `reviewer_id`
- `reviewer_scope`
- `evidence_note`
- `evidence_url`
- `decision`
- `promotion_state`
- `blocked_reason`
- `allowed_surfaces`
- `restricted_surfaces`
- `reviewed_at`
- `expires_at`
- `appeal_or_revision_path`

## No-Go Rules

Scholar Review must not:

- pretend a scholar board exists before named reviewers exist
- hide missing evidence
- turn prototype review into production authority
- let the AI certify itself
- erase disagreement between traditions or interpretations
- promote audio without rights review
- promote source text without edition metadata

## v0.5.9 Launch Gate

v0.5.9 adds the Launch Gate Seed with public demo readiness, privacy copy, launch notes, scenario decisions, and no-go release gates.

## v0.6.0 Direction

v0.6.0 should add a Production Bridge Seed for durable storage, access boundaries, launch-gate records, and reviewer-owned release history.

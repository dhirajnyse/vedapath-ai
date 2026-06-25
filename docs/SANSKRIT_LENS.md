# VedaPath Sanskrit Lens Seed

This is the v0.5.6 Sanskrit Lens preview for VedaPath AI.

The Lens answers one product question:

Can VedaPath show Sanskrit text, transliteration, word sense, meter status, translation notes, and recitation boundary before it offers meaning?

## What It Adds

- three passage seeds
- source family and citation first
- Devanagari text where available
- IAST transliteration
- word-level sense rows
- meter or chandas status
- source URL handoff
- translation note boundary
- recitation boundary
- copyable source card
- copyable JSON handoff
- copyable boundary note

## Passage Seeds

### Bhagavad Gita 2.48

Source family: Bhagavad Gita | Smriti.

Use:

- steady action
- outcome boundary
- calm practice
- duty reflection

Boundary:

- reflection, not command
- not a productivity slogan
- not detached from ethics
- not ritual instruction

### Katha Upanishad 1.3.14

Source family: Katha Upanishad | Shruti.

Use:

- learning path
- humility
- guidance before certainty
- study discipline

Boundary:

- study prompt, not salvation claim
- no fear pressure
- no guru voice
- chandas review still needed

### Rigveda 3.62.10

Source family: Rigveda | Shruti.

Use:

- mantra source classification
- Gayatri meter display
- cautious word-sense preview
- recitation boundary design

Boundary:

- no ritual instruction
- no initiation guidance
- no lineage claim
- no audio authority
- Vedic accent and practice context need review

## Required Production Fields

Every future Sanskrit Lens record should include:

- `lens_id`
- `source_family`
- `citation`
- `source_url`
- `source_status`
- `devanagari_text`
- `transliteration`
- `word_rows`
- `meter_status`
- `translation_note`
- `recitation_boundary`
- `review_status`
- `audio_license_status`
- `commentary_status`

## Review Rules

Sanskrit Lens can show a prototype layer when:

- the citation is visible
- the source family is visible
- the text is marked as seed or reviewed
- the word split is marked as prototype if not scholar-reviewed
- meter status is honest
- recitation boundary is visible

Sanskrit Lens must not:

- teach ritual practice
- act as a chanting teacher
- infer lineage or eligibility
- claim final translation authority
- hide source uncertainty
- add audio without license and review
- use mantra interest to profile the user

## v0.5.7 Voice Boundary

v0.5.7 adds the Voice Boundary Seed before any audio feature: pronunciation support rules, licensing fields, reviewer status, and a hard separation between study support and ritual instruction.

## v0.5.8 Direction

v0.5.8 adds the Scholar Review Seed with reviewer roles, evidence notes, decision states, release gates, and copyable review handoffs.

## v0.5.9 Launch Gate

v0.5.9 adds the Launch Gate Seed with public demo readiness, privacy copy, launch notes, scenario decisions, and no-go release gates.

## v0.6.0 Direction

v0.6.0 should add a Production Bridge Seed for durable storage, access boundaries, launch-gate records, and reviewer-owned release history.

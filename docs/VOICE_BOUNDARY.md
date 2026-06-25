# VedaPath Voice Boundary Seed

This is the v0.5.7 Voice Boundary preview for VedaPath AI.

## Product Question

Can VedaPath prepare pronunciation support without rushing into audio, chant coaching, ritual instruction, or unreviewed authority?

## What It Adds

- silent pronunciation-support preview
- source card before sound
- syllable hints marked as prototype
- reviewer gate
- licensing gate
- audio locked state
- copyable voice brief, reviewer handoff, and boundary

## Why It Matters

Voice can make the product feel alive, but it also raises trust risk quickly.

VedaPath should not ship sacred-text audio just because it is technically possible. It should first show:

- source family
- citation
- text status
- transliteration status
- syllable or meter status
- reviewer status
- license status
- performer consent
- attribution
- takedown path
- ritual and lineage boundary

## Prototype Seeds

### Bhagavad Gita 2.48

Use case:

- study pacing
- silent syllable preview
- steady-action reflection

Boundary:

- no chanting instruction
- no ritual prescription
- no spiritual status claim

### Katha Upanishad 1.3.14

Use case:

- careful tone design
- source-guided pause
- reviewer handoff

Boundary:

- no fear pressure
- no salvation promise
- no dramatic command voice

### Rigveda 3.62.10

Use case:

- mantra-source boundary
- meter and accent review
- audio lock design

Boundary:

- no ritual instruction
- no initiation guidance
- no eligibility judgment
- no unlicensed recitation

## Production Fields

Every future voice record should include:

- `voice_seed_id`
- `source_seed_id`
- `citation`
- `source_family`
- `text_status`
- `transliteration_status`
- `syllable_status`
- `meter_status`
- `accent_status`
- `review_status`
- `reviewer_id`
- `license_status`
- `performer_consent_status`
- `audio_asset_id`
- `allowed_surfaces`
- `restricted_surfaces`
- `attribution`
- `takedown_path`
- `boundary`

## No-Go Rules

Voice Boundary must not become:

- chant coaching
- ritual instruction
- guru voice
- initiation guidance
- eligibility judgment
- spiritual status verdict
- therapy
- diagnosis
- emergency support
- unlicensed audio reuse
- a replacement for teachers, priests, scholars, family, clinicians, or tradition

## v0.5.8 Direction

v0.5.8 adds the Scholar Review Seed: reviewer roles, decision states, evidence notes, source edition fields, and release approval rules for Lens and Voice records.

## v0.5.9 Launch Gate

v0.5.9 adds the Launch Gate Seed with public demo readiness, privacy copy, launch notes, scenario decisions, and no-go release gates.

## v0.6.0 Direction

v0.6.0 should add a Production Bridge Seed for durable storage, access boundaries, launch-gate records, and reviewer-owned release history.

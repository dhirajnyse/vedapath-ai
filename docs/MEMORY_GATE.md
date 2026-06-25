# Memory Gate

Memory Gate is the v0.4.9 enforcement preview for VedaPath AI.

Consent Gate asks whether a record may become memory. Memory Gate checks whether the record is actually ready to be saved, reviewed, blocked, or sent to the Trust Ledger.

## Why It Exists

VedaPath is now handling:

- private life-map signals
- shared calm-circle notes
- reviewer corrections
- source-dataset candidates
- trust-ledger decisions

These should not all be remembered in the same way.

Memory Gate gives the product a simple rule:

If consent proof, source trace, deletion path, review route, or audit event is missing, durable memory must be blocked or routed to review.

## Current Prototype

The v0.4.9 Memory Gate includes:

- four incoming record types:
  - Calm Circle
  - Life Map
  - Reviewer Correction
  - Source Dataset
- six required fields:
  - purpose named
  - consent proof
  - source trace
  - deletion path
  - review route
  - audit event
- a visible verdict:
  - local draft
  - human review
  - Trust Ledger
  - blocked
- source and boundary card
- readiness meter
- local saved route preview
- copyable memory brief
- production enforcement field preview

## Product Rule

Memory Gate should make storage restraint visible.

It should:

- keep personal or shared prototype data local unless the durable route is clear
- block records missing consent, source trace, or deletion path
- route sensitive or knowledge-changing records to human review
- send only fully governed records toward Trust Ledger
- keep every route copyable and auditable

## What It Is Not

Memory Gate is not:

- legal advice
- compliance certification
- therapy
- mediation
- production privacy infrastructure
- a reason to collect more data
- a hidden scoring system

## Future Production Schema

A durable implementation should enforce:

- memory route id
- source record id
- consent record id
- record owner id
- visibility state
- privacy class
- source trace
- deletion path
- export path
- review route
- reviewer identity
- audit event id
- route verdict
- route reason
- created at
- updated at
- revoked at

## Next Step

v0.5.0 adds Trust Model so Memory Gate, Consent Gate, Trust Ledger, Reviewer Queue, Source Seeds, and Calm Rhythm connect as a visible production data architecture.

v0.5.1 adds Calm Passport so each memory route can show may-remember fields, must-not-remember fields, export, deletion, withdrawal, and local grants before account-backed memory.

v0.5.2 adds that backend schema draft. v0.5.3 adds schema fixtures, route validation examples, deletion lifecycle notes, export payloads, and no-go tests. v0.5.4 adds the Evaluation Drill Room, combining answer checks, fixture checks, and no-go cases. v0.5.5 adds the Learning Loop Seed for repeated questions, reviewer decisions, source gaps, and blocked learning boundaries without hidden profiling. v0.5.6 adds the Sanskrit Lens Seed with Sanskrit text, transliteration, word meaning, meter status, translation notes, source URLs, and recitation boundaries. v0.5.7 adds the Voice Boundary Seed before any audio feature: silent pronunciation support, syllable hints, reviewer gate, license gate, and no ritual authority. v0.5.8 adds the Scholar Review Seed with reviewer roles, evidence notes, decision states, release gates, and copyable review handoffs. v0.5.9 adds the Launch Gate Seed with public demo readiness, privacy copy, launch notes, scenario decisions, and no-go release gates. v0.6.0 adds the Production Bridge Seed with record-family routes, storage lanes, consent needs, audit states, readiness scores, and copyable bridge handoffs. v0.6.1 adds the Source Record Storage Plan with canonical source tables, translation layers, review links, retrieval indexes, fixtures, and no-go checks. v0.6.2 should add a Reviewer Identity and Access Gate with reviewer roles, permission scopes, display policy, and approval boundaries.

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

v0.5.1 should convert that visual model into the first backend schema draft with durable ids, table relationships, migration notes, and account-memory consent flows.

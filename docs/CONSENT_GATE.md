# Consent Gate

Consent Gate is the v0.4.8 trust layer for VedaPath AI.

It turns shared or knowledge-changing product records into a visible agreement before they become durable memory.

## Why It Exists

VedaPath is now exploring personal calm, life moments, shared conversations, reviewer decisions, and source datasets.

That means the product needs a rule:

No shared record, private pattern, correction, or source-dataset entry should become durable product memory until its purpose, scope, consent, source trace, deletion path, and review route are visible.

## Current Prototype

The v0.4.8 Consent Gate includes:

- four gate types:
  - Calm Circle
  - Life Map
  - Reviewer Queue
  - Source Dataset
- a source candidate and source-family label for each gate
- six required checks:
  - purpose named
  - consent visible
  - scope limited
  - source attached
  - deletion path
  - review route
- editable allowed-use, blocked-use, retention, and participant notes
- a readiness meter
- browser-local saved gate previews
- copyable consent brief
- production schema preview

## Product Rule

Consent Gate should protect agency before VedaPath remembers anything sensitive.

It should:

- make purpose explicit
- separate allowed use from blocked use
- carry source trace with every record
- require deletion and export paths
- route sensitive or knowledge-changing records to human review
- avoid hidden profiling, pressure, or silent knowledge-base rewrites

## What It Is Not

Consent Gate is not:

- legal advice
- compliance certification
- therapy
- mediation
- relationship counseling
- permission pressure
- a replacement for human judgment
- a way to make private conflict searchable

## Future Production Schema

A durable implementation should store:

- record id
- record type
- source seed id
- passage dossier id
- source family
- citation
- pramana level
- purpose
- allowed use
- blocked use
- participant consent state
- withdrawal path
- export path
- deletion path
- retention policy
- reviewer route
- reviewer identity
- audit history
- evaluation fixture ids
- privacy classification

## Next Step

v0.4.9 adds Memory Gate so records can be blocked, kept local, routed to review, or sent toward Trust Ledger based on governance fields.

v0.5.0 adds Trust Model so Consent Gate, Memory Gate, Trust Ledger, Reviewer Queue, Source Seeds, and Calm Rhythm connect as a visible production data architecture.

v0.5.1 should convert that visual model into the first backend schema draft with durable ids, table relationships, migration notes, and account-memory consent flows.

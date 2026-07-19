# Source Rights and License Pack

Creates a source-rights packet for edition provenance, allowed use, citation display, missing permissions, and corpus-delivery boundaries.

## Goal

Protect sources, translators, reviewers, and users before expanding the corpus.

## Boundary

Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.

## Required Flow

1. Identify edition and source family.
2. Classify allowed use and citation display.
3. Flag missing permission before ingestion.
4. Block bulk corpus delivery.

## Decision Options

- Use source packets before adding more texts.
- Never hide uncertain rights behind polished UX.
- Keep reviewer notes separate from accepted source truth.

## Packet

- edition: named
- license: review-required
- allowed-use: citation-card
- corpus-delivery: blocked
- owner:rights

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, store production data, run live AI, publish telemetry, deliver a corpus, invite public participants, or authorize launch.

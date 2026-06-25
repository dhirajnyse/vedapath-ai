# Source Seeds

Source Seeds is the first source-data readiness room for VedaPath AI.

It turns prototype citations into structured seed records that can later become retrieval-ready source data after human review.

## Product Role

Source Seeds bridges the current clickable prototype and the real source-backed MVP.

It should help the team see:

- which source candidates already exist
- which product rooms each source can support
- what fields are ready for retrieval
- what fields are missing before production
- what a reviewer must check before a source can answer users
- how Retrieval Lab will rank, cite, and bound answer drafts

## Current Seed Shape

Each seed record includes:

- `id`
- `title`
- `citation`
- `family`
- `uses`
- `pramana`
- `status`
- `summary`
- `question`
- `boundary`
- `missingBeforeProduction`
- `route`

## Prototype Coverage

The first room includes 12 seed records across:

- Bhagavad Gita
- Rigveda
- Katha Upanishad
- Mundaka Upanishad
- Chandogya Upanishad
- Isha Upanishad
- Taittiriya Upanishad

These records support Ask, Claim Checker, Calm, Practice, Compass, Card, Bell, Reply, Samvada, Sankalpa, Seva, Morning, Evening, and Rhythm flows.

## Production Requirements

Before any seed becomes a production source record, it needs:

- verified Sanskrit where relevant
- translation policy and licensing
- source edition metadata
- reviewer notes
- accepted source-family classification
- boundary and overclaim warning
- retrieval id and passage text
- version history

## Link To Retrieval Lab

Retrieval Lab consumes the current seed shape and turns it into a transparent answer draft.

The handoff is not just citation lookup. It must include:

- primary source candidate
- supporting source candidates
- match reason
- source family
- confidence
- answer boundary
- missing review fields
- no-source refusal when a claim is unsupported

## Link To Passage Review Pack

Source Seeds defines candidate records. Passage Review Pack turns those records into review dossiers before answer authority.

Each dossier should make allowed use, restricted use, reviewer decision, missing production fields, and evaluation checks visible.

## Link To Memory Gate

Memory Gate checks whether a source-dataset record has enough governance to become durable product memory.

Before a seed can move beyond prototype status, the product should show:

- purpose
- consent proof when people or shared records are involved
- source trace
- deletion path
- human review route
- audit event
- final route: local draft, human review, Trust Ledger, or blocked

## Guardrail

Source Seeds must not pretend prototype citations are final authority.

The room should make the trust gap visible: "This is a candidate, here is why it may be useful, and here is what must be reviewed before it becomes a source of answers."

## Why It Matters

VedaPath should not win by sounding mystical or confident. It should win by being honest about sources, careful about categories, and willing to show its work before answering.

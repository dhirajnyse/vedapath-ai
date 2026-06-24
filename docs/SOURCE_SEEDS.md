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

## Guardrail

Source Seeds must not pretend prototype citations are final authority.

The room should make the trust gap visible: "This is a candidate, here is why it may be useful, and here is what must be reviewed before it becomes a source of answers."

## Why It Matters

VedaPath should not win by sounding mystical or confident. It should win by being honest about sources, careful about categories, and willing to show its work before answering.

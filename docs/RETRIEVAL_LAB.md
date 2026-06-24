# Retrieval Lab

Retrieval Lab is the first visible search-and-answer bridge for VedaPath AI.

It takes a user question, searches the current Source Seeds, ranks likely source candidates, and shows the match reason before presenting an answer draft.

## Product Role

Retrieval Lab proves that VedaPath can answer with transparent source handling instead of confident mystery.

It should show:

- the user question or claim
- the primary source candidate
- supporting source candidates
- source family and pramana level
- match reason
- confidence score
- answer boundary
- review needs before production use
- no-source or overclaim refusal when a claim is unsupported

## Current Behavior

The prototype uses a local in-page source set derived from Source Seeds.

It can:

- match common calm, reply, Gita, Gayatri, Atman, Brahman, and Oppenheimer questions
- show a source stack
- explain why a source was selected
- mark unsupported science-proof claims as source gaps
- copy a retrieval brief
- queue a review item
- keep a device-local retrieval history

## Trust Rule

The answer should never hide the retrieval step.

Every serious answer needs:

1. Primary source
2. Source family
3. Confidence or fit
4. Match reason
5. Boundary
6. Review status

## Production Requirements

Before Retrieval Lab becomes authoritative, VedaPath needs:

- reviewed passage text
- verified Sanskrit where relevant
- translation policy and licensing
- source edition metadata
- reviewer decisions
- accepted boundary notes
- retrieval ids
- evaluation checks for category confusion and overclaiming

## Link To Passage Review Pack

Retrieval Lab finds candidate sources. Passage Review Pack decides whether a candidate can safely support an answer.

The retrieval stack should not become authoritative until each source candidate has a visible review dossier with allowed use, answer boundary, missing production fields, and evaluation checks.

## Why It Matters

The calming effect of VedaPath should come from clarity, not certainty theater.

Retrieval Lab makes the product slow down before answering: find the source, show the reason, state the boundary, then speak.

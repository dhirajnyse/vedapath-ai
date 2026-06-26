# VedaPath Answer Intent Lab

This is the v2.3.5 VedaPath Answer Intent Lab release for VedaPath AI.

## Purpose

Answer Intent Lab starts the answer layer by making intent and boundaries explicit.

## Answer Focus

- Sample question: How can I act calmly when results are uncertain?
- Source lane: Bhagavad Gita 2.48
- Boundary: Answer intent prototype, not AI generation.

## Answer Signals

- Intent: Keep the user question and answer intent visible. Prevents generic advice.
- Source: Keep citation, family, and confidence near the answer. Protects trust.
- Boundary: Show what the answer must not become. Prevents overclaim.
- Feedback: Turn concerns into reviewable local tickets. Keeps learning alive.

## Founder Action

Separate question intent from answer prose.

## Data Sources

- data/vedapath-answer-patterns.json
- data/vedapath-retrieval-fixtures.json
- data/vedapath-source-library.json

## No-Go Boundary

This release should not imply production AI, guru voice, therapy, diagnosis, emergency support, ritual instruction, or spiritual authority.

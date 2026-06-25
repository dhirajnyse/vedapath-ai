# VedaPath Retrieval Scoring Harness

This is the v1.6.7 VedaPath Retrieval Scoring Harness release for VedaPath AI.

## Purpose

Retrieval Scoring Harness maps match strength, source eligibility, risk, and fallback behavior into an inspectable decision.

## Source Candidate

- Source: Rigveda 1.164.46
- Text family: Veda | Shruti
- Boundary: Scoring harness, not production semantic search.

## Implementation Signals

- Intent match: Question route is compared to allowed source intents. Avoids wrong answer lanes.
- Concept match: Topic tags, Sanskrit concepts, and plain-language terms are compared. Keeps retrieval useful.
- Trust weight: Review state and confidence basis adjust the result. Keeps quality above volume.
- Reject reason: No match, unsafe scope, rights hold, or reviewer-needed appears plainly. Keeps failure honest.

## Founder Action

Make retrieval scoring readable enough for both users and reviewers.

## No-Go Boundary

This release should not imply production storage, live AI generation, public launch approval, authentication, licensed source text, therapy, ritual instruction, emergency support, or spiritual authority.

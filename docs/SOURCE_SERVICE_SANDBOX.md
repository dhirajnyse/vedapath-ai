# VedaPath Source Service Sandbox

This is the v1.1.5 VedaPath Source Service Sandbox release for VedaPath AI.

## Purpose

Source Service Sandbox gives VedaPath a narrow first implementation lane: one query, one candidate set, one eligibility decision, and one safe fallback.

## Source Candidate

- Source: Mundaka Upanishad 1.1.4
- Text family: Upanishad | Shruti
- Boundary: Service sandbox, not a live API.

## Decision Signals

- Query contract: Question text, source family hint, depth, language, and safety context. Keeps input shape small.
- Eligibility state: Ready, hold, blocked, rights-needed, reviewer-needed, or no-source. Stops false confidence early.
- Response reason: Match reason, missing fields, and public-display allowance. Makes retrieval explainable.
- Fallback: No-source and analogy-only answers get careful boundaries. Protects the user's trust.

## Founder Action

Freeze the public source-service contract before writing production retrieval code.

## No-Go Boundary

This release should not imply production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.

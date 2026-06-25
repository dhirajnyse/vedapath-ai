# VedaPath Retrieval Service Blueprint

This is the v1.0.9 VedaPath Retrieval Service Blueprint release for VedaPath AI.

## Purpose

Retrieval Service Blueprint makes production answer generation depend on review state, source specificity, and visible match reasons.

## Source Candidate

- Source: Bhagavad Gita 4.34
- Text family: Bhagavad Gita | Smriti
- Boundary: Retrieval blueprint, not deployed retrieval.

## Decision Signals

- Match: Question intent, source family, topic, and claim type. Finds likely records.
- Eligibility filter: Ready records first; hold, blocked, and no-rights records excluded. Protects public output.
- Reason: Why this record matched and what it cannot answer. Keeps retrieval explainable.
- Fallback: No-source, analogy-only, or reviewer-needed response. Prevents hallucinated authority.

## Founder Action

Define retrieval ranking so answers prefer reviewed, eligible, source-specific records.

## No-Go Boundary

This release should not imply production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, emergency support, or spiritual authority.

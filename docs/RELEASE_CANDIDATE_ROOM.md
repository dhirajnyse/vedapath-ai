# VedaPath Release Candidate Room

This is the v1.4.4 VedaPath Release Candidate Room release for VedaPath AI.

## Purpose

Release Candidate Room completes the implementation-readiness sprint and turns VedaPath's next step into one shippable lane.

## Source Candidate

- Source: Bhagavad Gita 18.63
- Text family: Bhagavad Gita | Smriti
- Boundary: Release candidate decision, not production launch.

## Decision Signals

- Source lane: Source JSON, import checklist, QA, and renderer shell. Best for answer trust.
- User lane: Waitlist, consent toggles, help center, and metrics. Best for beta entry.
- Review lane: Reviewer mock, scholar packets, source score, and hold states. Best for human trust.
- Decision: Pick one lane, name blockers, and define done. Prevents scattered building.

## Founder Action

Choose the next real build lane: source JSON plus renderer, waitlist plus consent, or reviewer queue plus import checklist.

## No-Go Boundary

This release should not imply production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.

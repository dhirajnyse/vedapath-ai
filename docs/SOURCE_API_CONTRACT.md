# VedaPath Source API Contract

This is the v1.0.7 VedaPath Source API Contract release for VedaPath AI.

## Purpose

Source API Contract describes the service boundary that every trusted answer must call before claiming confidence.

## Source Candidate

- Source: Rigveda 1.164.46
- Text family: Veda | Shruti
- Boundary: API contract, not deployed service.

## Decision Signals

- Query: Question text, requested depth, language, and user-safe context. Finds candidate records.
- Source response: Citation, family, review state, rights state, and allowed use. Tells answers what can be shown.
- Eligibility: Ready, hold, blocked, reviewer-needed, or no-source. Prevents false confidence.
- Refusal: No source found or unsafe claim requires a careful boundary response. Protects trust.

## Founder Action

Define the source service response shape before building production retrieval.

## No-Go Boundary

This release should not imply production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, emergency support, or spiritual authority.

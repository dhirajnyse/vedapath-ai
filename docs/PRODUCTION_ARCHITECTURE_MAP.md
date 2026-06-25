# VedaPath Production Architecture Map

This is the v1.0.5 VedaPath Production Architecture Map release for VedaPath AI.

## Purpose

Production Architecture Map turns VedaPath's prototype rooms into a clear service map for source trust, privacy, review, and launch operations.

## Source Candidate

- Source: Mundaka Upanishad 1.1.4
- Text family: Upanishad | Shruti
- Boundary: Architecture map, not implemented backend.

## Decision Signals

- Source core: Source records, citations, translation rights, and review state. Powers answer confidence.
- User core: Account, consent, export, delete, and memory preferences. Protects personal data.
- Review core: Reviewer roles, scoped decisions, audit trail, and release gates. Makes trust inspectable.
- Launch core: Pilot posture, feedback triage, analytics boundaries, and rollback. Keeps launch controllable.

## Founder Action

Choose the production system boundaries before any real user data is stored.

## No-Go Boundary

This release should not imply production storage, verified answers, reviewer approval, authentication, analytics, therapy, ritual instruction, emergency support, or spiritual authority.

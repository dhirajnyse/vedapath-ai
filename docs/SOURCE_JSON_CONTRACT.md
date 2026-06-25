# VedaPath Source JSON Contract

This is the v1.3.5 VedaPath Source JSON Contract release for VedaPath AI.

## Purpose

Source JSON Contract gives VedaPath a stable source-record shape that future retrieval, review, and answer rendering can share.

## Source Candidate

- Source: Mundaka Upanishad 1.1.4
- Text family: Upanishad | Shruti
- Boundary: Data contract, not a live database.

## Decision Signals

- Identity: Source id, citation, family, text layer, and edition note. Stops category blur.
- Use rights: Display allowed, quote limit, translation status, and audio status. Prevents rights overreach.
- Review: Lane states for source, language, boundary, and product. Makes trust inspectable.
- Coverage: Questions it can answer and claims it must refuse. Keeps answers narrow.

## Founder Action

Freeze the first source-record shape before backend or retrieval work begins.

## No-Go Boundary

This release should not imply production storage, live retrieval, authentication, licensed audio, therapy, ritual instruction, emergency support, or spiritual authority.

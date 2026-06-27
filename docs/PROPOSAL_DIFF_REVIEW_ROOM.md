# VedaPath AI Proposal Diff Review Room

Release: v2.9.8

This release reviews draft source-update proposals before they reach a source owner.

## Files

- `data/vedapath-proposal-diff-review-room.json`
- `proposaldiffreview.html`
- `assets/vedapath-proposal-diff-review-room.css`
- `assets/vedapath-proposal-diff-review-room.js`

## What It Adds

The room:

- reads a source proposal packet
- shows editable diffs and blocked fields
- adds review states
- requires review notes, owner path, rollback note, and rejection or revision reasons where needed
- exports a review packet
- stores local review history only

## Boundary

This room does not approve production source changes. Canonical records stay unchanged until durable identity, immutable audit, source-owner approval, controlled storage, and rollback handling exist.

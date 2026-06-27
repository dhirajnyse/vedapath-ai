# VedaPath AI Source Update Proposal Bridge

Release: v2.9.7

This release creates a draft-only bridge from reviewed audit packets to source-record update proposals.

## Files

- `data/vedapath-source-update-proposal-bridge.json`
- `sourceupdateproposalbridge.html`
- `assets/vedapath-source-update-proposal-bridge.css`
- `assets/vedapath-source-update-proposal-bridge.js`

## What It Adds

The bridge:

- reads a reviewed audit packet
- compares proposed updates with an existing answer record
- shows editable-field diffs
- blocks canonical and rights-sensitive fields
- produces a copyable proposal packet
- stores draft proposals locally for preview only

## Boundary

This bridge does not mutate `data/vedapath-source-answer-foundation.json`. Production needs durable identity, immutable audit, source-owner approval, diff review, and rollback before any canonical record changes.

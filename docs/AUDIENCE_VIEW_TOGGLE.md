# Audience View Toggle

Version: v4.5.4

## Purpose

Adds audience view toggles so a single source packet can be reviewed for beginner, Sanskrit, and scholar-reading depths without changing the source.

## Product Role

This toggle keeps the same source packet while changing depth for beginner, Sanskrit learner, and scholar-review contexts.

## Files

- Page: `audienceviewtoggle.html`
- Data: `data/vedapath-audience-view-toggle.json`
- Renderer kind: `qa`

## Checks

`node --check assets/vedapath-retrieval-pilot.js`, `node --check assets/vedapath-command-shell.js`, `node --check scripts/apply-v451-v455-answer-draft-batch.mjs`, `node scripts/check-static-links.mjs`, HTTP smoke checks, and browser visual QA

## Known Risks

Static prototype only; answer draft review, revision, trace, audience views, and launch evidence do not provide live AI generation, production storage, licensed corpus coverage, scholar approval, public launch authority, or spiritual/medical/ritual authority.

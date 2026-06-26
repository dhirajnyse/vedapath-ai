# VedaPath AI Reviewer Queue Persistence

Release: v2.9.5

This release adds browser-local queue persistence for reviewer work.

## Files

- `data/vedapath-review-queue-persistence.json`
- `reviewqueuepersistence.html`
- `assets/vedapath-review-queue-persistence.css`
- `assets/vedapath-review-queue-persistence.js`

## Queue Behavior

The queue:

- hydrates records from generated review tickets
- stores status, owner, and reviewer notes locally
- records audit events for created, claimed, updated, accepted, imported, and cleared actions
- exports a queue snapshot as JSON
- imports a pasted snapshot back into local queue memory

## Boundary

This is browser-local persistence only. Production needs accounts, permissions, reviewer identity, durable storage, immutable audit logs, source-update approval, and operational governance.

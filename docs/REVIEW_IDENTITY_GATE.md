# VedaPath AI Reviewer Identity and Audit Gate

Release: v2.9.6

This release adds a governance layer beside the browser-local review queue.

## Files

- `data/vedapath-review-identity-gate.json`
- `reviewidentitygate.html`
- `assets/vedapath-review-identity-gate.css`
- `assets/vedapath-review-identity-gate.js`

## What It Adds

The identity gate defines:

- reviewer roles
- action authority
- required evidence fields
- second-review requirements
- production boundaries
- copyable audit packets

## Boundary

This is not authentication. It is a product contract for how review should behave before production accounts, permissions, durable storage, and immutable audit logs are added.

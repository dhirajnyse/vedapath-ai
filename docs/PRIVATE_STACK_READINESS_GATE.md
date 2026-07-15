# v5.1.2 Private Stack Readiness Gate

## Purpose

A twenty-four-hour readiness gate now requires pseudonymous identity, reviewed-source rights, review-event-only writes, local-first privacy, tested incident response, manual rollback, three named owners, and one-person, one-session limits.

## What Changed

Adds a pure private-stack readiness evaluator with six exact posture checks, named operations, privacy, and security owners, twenty-four-hour evidence expiry, one-person and one-session limits, a single review-event write route, and permanent no-credential, no-provider, no-deployment, no-invitation, no-session, and public-launch locks.

## Files Changed

- `privatestackreadiness.html`
- `data/vedapath-private-stack-readiness.json`
- `docs/PRIVATE_STACK_READINESS_GATE.md`
- `scripts/vedapath-private-stack-readiness.mjs`
- `scripts/apply-v512-v516-private-pilot-operations-batch.mjs`
- `scripts/check-v512-v516-private-pilot-operations.mjs`
- `assets/vedapath-command-shell.js`
- `scripts/check-static-links.mjs`
- `build-status.html`
- `README.md`
- `CHANGELOG.md`
- `historical compatibility checkers`

## Acceptance Checks

node --check scripts/vedapath-private-stack-readiness.mjs; complete, posture, owner, expiry, scope, route, credential, provider, deployment, invitation, session, and public-access assertions; batch checker through v5.1.2; static links.

## Known Risks

Private-pilot operations contract evidence only; candidate stack, invitation adapter, consent, observability, and founder review remain deterministic fixtures. No credentials, direct identity, token, account, email, delivery, provider connection, deployment activation, real invitation, participant, live session, exported telemetry, durable participant write, public launch, licensed corpus delivery, live AI generation, payments, or medical, legal, ritual, or spiritual authority.

## Founder Packet

VedaPath Private Stack Readiness Gate
Founder authorization: required
Candidate stack: required
Posture checks: 6 exact states
Named owners: 3
Maximum participants: 1
Maximum sessions: 1
Evidence expiry: 24 hours maximum
Credentials present: false
Provider connected: false
Deployment active: false
Invitation issued: false
Session started: false
Public launch: blocked

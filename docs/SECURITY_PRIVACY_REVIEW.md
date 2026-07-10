# v4.8.5 Security & Privacy Review

## Purpose

The active Ask path now has explicit origin, payload, storage, telemetry, framing, caching, rights, and authority controls with automated verification.

## What Changed

Hardens local API response headers and null-origin handling, adds a machine-readable threat model, and verifies the active Ask, observation, and intake surfaces for privacy regressions.

## Acceptance Checks

API security-header assertions; disallowed and null-origin tests; no-storage and no-telemetry scans; rights-field scan; batch checker through v4.8.5.

## Known Risks

Private-demo tooling only; no live AI generation, production corpus delivery, durable accounts, hidden telemetry, payments, public launch, or medical, legal, ritual, or spiritual authority.

## Founder Packet

Security & Privacy Review v4.8.5
Scope: active private Ask path.
Verified: origin, headers, payload, storage, telemetry, rights, and authority boundaries.
Residual: production identity, secrets, rate limiting, monitoring, retention, support, and incident response.

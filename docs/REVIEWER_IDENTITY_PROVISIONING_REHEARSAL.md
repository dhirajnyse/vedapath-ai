# v5.4.5 Reviewer Identity Provisioning Rehearsal

Adds a synthetic reviewer lifecycle with request, independent approval, least-privilege activation, immediate session revocation, and an ordered redacted audit history while real accounts and external identity remain absent.

## Goal

Prove reviewer account operations and separation of duties before provisioning any real identity.

## Flow

1. Request one synthetic reviewer identity.
2. Require approval from a different actor.
3. Activate one least-privilege reviewer session.
4. Revoke it and preserve the audit sequence.

## Contract checks

- **Self-approval:** Rejected
- **Privilege:** Reviewer only
- **Session:** Invalid after revoke
- **External IdP:** Still unbound

## Packet

- `identity:synthetic`
- `approval:maker-checker`
- `role:reviewer`
- `revocation:immediate`
- `external-idp:null`

## Boundary

Private-pilot deployment readiness only; provider and region activation, managed production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

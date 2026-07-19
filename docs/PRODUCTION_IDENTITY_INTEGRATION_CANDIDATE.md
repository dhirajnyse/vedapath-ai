# v5.4.0 Production Identity Integration Candidate

Replaces fixture session headers in the candidate path with signed, expiring issuer-and-audience-bound claims and strict reviewer/participant role enforcement.

## Goal

Prove the identity verification boundary before selecting an external identity provider or provisioning real accounts.

## Flow

1. Verify signature and token type.
2. Check issuer, audience, and expiry.
3. Resolve reviewer or participant role.
4. Reject tampering and role mismatch.

## Contract checks

- **Tamper:** Rejected
- **Expiry:** Rejected
- **Audience:** Exact match
- **External IdP:** Not selected

## Packet

- `claims:signed`
- `expiry:enforced`
- `issuer-audience:enforced`
- `roles:strict`
- `external-idp:null`

## Boundary

Private-pilot platform candidate only; provider and region binding, production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

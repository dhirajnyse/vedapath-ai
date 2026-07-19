# v5.4.3 Managed Secrets & Environment Contract

Introduces a private-pilot environment contract that accepts only named secret references, rejects inline values and secret-like public configuration, and returns non-exportable redacted fixture handles.

## Goal

Prove the configuration and secret boundary before any managed secret store or production credential is connected.

## Flow

1. Validate the private-pilot public configuration.
2. Require four named secret references.
3. Reject inline and secret-like public values.
4. Resolve only redacted non-exportable fixture handles.

## Contract checks

- **Origin:** HTTPS required
- **References:** Strict secret:// format
- **Diagnostics:** Values redacted
- **Managed store:** Still unbound

## Packet

- `profile:private-pilot`
- `secret-refs:4`
- `inline-values:false`
- `values-exposed:false`
- `managed-store:false`

## Boundary

Private-pilot deployment readiness only; provider and region activation, managed production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.

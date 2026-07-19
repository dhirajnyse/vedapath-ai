# v5.3.3 Environment & Secret Bootstrap

Adds a strict environment schema with HTTPS and CORS boundaries, binding-only secret references, redacted diagnostics, and explicit launch-closed defaults.

## Goal

Make candidate configuration testable without placing a credential or secret literal in source, output, or browser storage.

## Flow

1. Choose an explicit environment.
2. Require safe origins and CORS allowlists.
3. Reference secrets through bindings.
4. Redact every diagnostic summary.

## Contract checks

- **Origin:** HTTPS except local loopback
- **Bindings:** SESSION, REVIEW, CONSENT
- **Diagnostics:** Reference names redacted
- **Unknown keys:** Rejected

## Packet

- `environment:local-preview-candidate`
- `origin:explicit`
- `cors:allowlist`
- `secretRefs:binding-only`
- `diagnostics:redacted`

## Boundary

Hosted-pilot candidate only; vendor and region remain unbound, secrets are references only, persistence is ephemeral, telemetry and live AI are off, and public launch and production authorization remain closed.

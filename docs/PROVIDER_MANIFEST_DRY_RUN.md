# v5.4.8 Provider Manifest Dry Run

Compiles founder-authorized preparation into a provider-neutral, checksummed manifest dry run that validates four binding references, explicit routes, security headers, and rollback steps without applying anything.

## Goal

Prove the shape and safety of a hosted manifest before connecting a provider account or executing a deployment command.

## Flow

1. Validate provider-neutral binding references.
2. Review explicit private-pilot routes and methods.
3. Require no-store headers and a rollback sequence.
4. Emit one redacted receipt without applying the plan.

## Contract checks

- **Secrets:** No inline material
- **Routes:** No wildcards
- **Rollback:** Three steps
- **Provider:** Still unbound

## Packet

- `manifest:checksummed`
- `bindings:4`
- `routes:3`
- `applied:false`
- `provider-bound:false`

## Boundary

Hosted-pilot implementation evidence only; provider activation, managed production credentials, durable production data, real external identities, participant telemetry, live AI, deployment, and public launch remain closed.

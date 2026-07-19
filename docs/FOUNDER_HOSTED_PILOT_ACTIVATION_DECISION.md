# v5.4.7 Founder Hosted-Pilot Activation Decision

Turns the private-demo readiness packet into a checksummed maker-checker founder decision that may authorize implementation preparation while provider activation, deployment, and public launch stay false.

## Goal

Create one explicit founder decision between evidence-complete private demo work and any hosted implementation preparation.

## Flow

1. Read the complete deployment-readiness packet.
2. Assign scope, rollback, security, and budget owners.
3. Require founder and independent reviewer signatures.
4. Authorize preparation while activation remains denied.

## Contract checks

- **Readiness:** Private demo approved
- **Owners:** Four named roles
- **Decision:** Checksummed
- **Authority:** Preparation only

## Packet

- `evidence:5/5`
- `attestations:4/4`
- `implementation-preparation:true`
- `hosted-activation:false`
- `deployment:false`

## Boundary

Hosted-pilot implementation evidence only; provider activation, managed production credentials, durable production data, real external identities, participant telemetry, live AI, deployment, and public launch remain closed.

# Source Rights Approval Board

## Product Purpose

Adds a rights approval board that separates public-domain, cited-only, excerpt-only, review-needed, and blocked source use before pilot answers expand.

## User Promise

Approve source use before answers grow.

## Boundary

Rights review support only. It does not provide legal advice, licensing, permission grants, or production source approval.

## Data Contract

- Data file: `data/vedapath-source-rights-approval-board.json`
- Renderer: `launchRoom`
- Local memory key: `vedapathRightsBoard`
- Production writes: disabled

## Checks

- The page must load through the shared command shell.
- The launch room must expose lanes, checklist, local save, copy packet, and clear local controls.
- The boundary must stay visible in the side panel.

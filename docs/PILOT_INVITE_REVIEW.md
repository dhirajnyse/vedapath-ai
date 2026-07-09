# Pilot Invite Review

## Product Purpose

Adds a final invite review room so each private pilot invitation has purpose, boundary, consent posture, and hold reasons before a person is added.

## User Promise

Review one invitation before one more tester enters.

## Boundary

Invitation review only. No email sending, account creation, payment, analytics, or production access is enabled.

## Data Contract

- Data file: `data/vedapath-pilot-invite-review.json`
- Renderer: `launchRoom`
- Local memory key: `vedapathInviteReview`
- Production writes: disabled

## Checks

- The page must load through the shared command shell.
- The launch room must expose lanes, checklist, local save, copy packet, and clear local controls.
- The boundary must stay visible in the side panel.

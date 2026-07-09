# Pilot Session Export Packet

## Product Purpose

Adds a pilot session export packet so a completed session can become one copyable, reviewable artifact without hidden analytics.

## User Promise

Turn one session into one review packet.

## Boundary

Manual export only. No automatic tracking, identity storage, analytics, sync, or production session archive is enabled.

## Data Contract

- Data file: `data/vedapath-pilot-session-export-packet.json`
- Renderer: `launchRoom`
- Local memory key: `vedapathSessionExport`
- Production writes: disabled

## Checks

- The page must load through the shared command shell.
- The launch room must expose lanes, checklist, local save, copy packet, and clear local controls.
- The boundary must stay visible in the side panel.

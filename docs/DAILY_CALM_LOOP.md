# Daily Calm Loop

## Purpose

Daily Calm Loop is the first living-product preview for VedaPath AI. It moves beyond a static page by letting a user save one source-backed reflection for the day and see a seven-day pattern.

## What It Proves

- Users can return daily without needing a heavy dashboard.
- Personalization can come from explicit user entries, not hidden tracking.
- Calmness can stay source-backed and bounded.
- Device-local memory can prototype the learning loop before accounts exist.

## Current Data Model

The prototype stores entries in browser localStorage under `vedapath.dailyCalm.v1`.

Each entry includes:

- Date
- State
- Source candidate
- Source family
- User note

This data is not synced, reviewed, or production-grade.

## Future Production Requirements

- Explicit account and consent model
- Export and delete controls
- Reviewed source data
- Privacy-sensitive sharing
- Clear distinction between reflection, therapy, and ritual instruction

## Product Voice

The daily loop should feel steady, humble, and useful. It should not flatter, command, diagnose, or pretend the product knows the user's life.

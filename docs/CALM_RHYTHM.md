# Calm Rhythm

Calm Rhythm is a privacy-first pattern lens for VedaPath AI.

It reads deliberate, browser-local prototype traces from VedaPath rooms and turns them into one gentle next room suggestion.

## Product Role

Calm Rhythm is the bridge between individual calm tools and a living product loop.

It should help a user notice:

- which rooms they actually use
- whether the week has an opening, action, repair, or closing pattern
- what one next step would be useful
- where the source boundary should remain visible

## Prototype Storage

The current page reads localStorage keys only in the user's browser:

- `vedapath.morning.v1`
- `vedapath.evening.v1`
- `vedapath.seva.v1`
- `vedapath.sankalpa.v1`
- `vedapath.practice.v1`
- `vedapath.dailyCalm.v1`
- `vedapath.sourceBell.v1`
- `vedapath.beforeReply.v1`
- `vedapath.samvada.v1`
- `vedapath.calmCards.v1`
- `vedapath.calmCompass.v1`
- `vedapath.rhythm.v1`

Nothing is synced, uploaded, scored, or profiled by this static prototype.

## Interaction Shape

1. User chooses the current rhythm: opening, moving, repairing, or closing.
2. VedaPath shows a source candidate, text family, and boundary.
3. The page reads local room traces and identifies a simple pattern.
4. The user receives one next room suggestion.
5. A rhythm check-in can be saved locally or copied as a handoff.

## Source Candidates

- Opening: Bhagavad Gita 2.48
- Moving: Bhagavad Gita 3.19
- Repairing: Bhagavad Gita 6.26
- Closing: Bhagavad Gita 6.17

These are prototype candidates. Production requires reviewed text, translation policy, citation metadata, reviewer notes, and explicit consent for any account-based memory.

## Guardrail

Calm Rhythm must not become diagnosis, therapy, surveillance, scoring, productivity pressure, ritual direction, or spiritual authority.

The product should say: "Here is a pattern visible from entries you deliberately saved on this device." It should never say: "This is who you are."

## Why It Matters

This feature proves that VedaPath can grow with the user without copying the usual attention-economy pattern. It can remember gently, explain what it sees, and keep the next action small.

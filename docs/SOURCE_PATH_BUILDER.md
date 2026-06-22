# Source Path Builder

Source Path Builder turns VedaPath's prototype source cards into a small, cited learning route. It is the bridge between finding a source in the Library and practicing with one source at a time.

## Product Promise

Help a user answer: "What should I study or practice next?" without becoming a guru voice or hidden profiling system.

The path must:

- begin from explicit user intention
- show source family and citation on every step
- keep completion memory device-local in the prototype
- allow the next source to hand off into Source Practice
- preserve boundaries around therapy, ritual instruction, and overclaiming

## v0.2.5 Prototype Behavior

The page stores local path state under `vedapath.sourcePath.v1`.

It lets the user:

- choose an intention: calm steadiness, source literacy, claim clarity, or mantra respect
- choose a short path size of 3 or 5 source candidates
- mark steps complete on this device
- copy a plain-text path handoff
- send the current source into Source Practice through `vedapath.library.launch.v1`
- receive a calm-compass route-in when the user wants one source-backed next step

## Future Production Fields

Each source-path record should eventually include:

- source id
- citation
- text family
- path intention
- recommended order
- beginner question
- carry action
- overclaim boundary
- reviewer status
- translation and licensing notes

## Boundary

Source Path is a learning scaffold. It should guide source order and reflection, not prescribe life decisions, ritual practice, treatment, or spiritual authority.

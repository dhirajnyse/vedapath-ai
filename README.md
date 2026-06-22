# VedaPath AI

VedaPath AI is a source-first learning companion for exploring Vedic and Hindu philosophical texts with clarity, humility, and citations.

![VedaPath AI 3D logo concept](assets/vedapath-3d-logo-concept.png)

It is not a guru, oracle, priest, or ritual authority. It helps users ask better questions, trace ideas to sources, compare interpretations, and build a personal learning path.

## Product Principle

Let us look at the source first.

## Initial Scope

- Vedas and Vedic structure
- Principal Upanishads
- Bhagavad Gita with clear Smriti labeling
- Sanskrit terms, transliteration, and beginner explanations
- Claim checking for modern interpretations
- Guided learning paths for different user levels

## Foundation Docs

- [Product Blueprint](blueprint.html)
- [Raw Blueprint Markdown](docs/PRODUCT_BLUEPRINT.md)
- [UX Principles](docs/UX_PRINCIPLES.md)
- [Brand System](docs/BRAND_SYSTEM.md)
- [MVP Roadmap](docs/MVP_ROADMAP.md)
- [Sample Questions](docs/SAMPLE_QUESTIONS.md)
- [Prototype Notes](docs/PROTOTYPE_NOTES.md)
- [GitHub Repo Setup](docs/REPO_SETUP.md)
- [GitHub Pages Setup](docs/PAGES_SETUP.md)
- [Source Policy](docs/SOURCE_POLICY.md)
- [Preview Hub](index.html)
- [Brand Board](brand/brand-board.html)
- [Build Status Page](build-status.html)
- [Release Workflow](docs/RELEASE_WORKFLOW.md)

## North Star

Make sacred and philosophical knowledge easier to approach without flattening its depth, confusing categories, or pretending the AI is an authority.

## Current Release

`v0.2.0` is a clickable prototype with:

- Ask workspace
- Source Card
- Pramana Meter
- Claim Checker
- Learning Path
- Correction Loop placeholder

## Faster Release Commits

After Git is initialized, use:

```powershell
.\scripts\release.cmd -Message "Describe this release"
```

Add `-Push` after the GitHub remote is connected.

## Local Preview

Run:

```powershell
.\scripts\serve-local.cmd
```

Then open:

```text
http://127.0.0.1:8088/
```

# Release Workflow

This repo includes a small PowerShell helper for faster release commits.

## Commit A Release

From the `vedapath-ai` folder:

```powershell
.\scripts\release.cmd -Message "Describe this release"
```

## Commit And Push

After a GitHub remote is connected:

```powershell
.\scripts\release.cmd -Message "Describe this release" -Push
```

The `.cmd` wrapper uses PowerShell with a process-only execution policy bypass, so it does not change your system policy.

## Recommended Message Style

Use short release messages:

- `Initialize VedaPath AI foundation`
- `Add first clickable prototype`
- `Add claim checker screen`
- `Add source card layout`
- `Add learning path prototype`

## Safety Rule

Review the changed files in GitHub Desktop before pushing public releases. The helper is meant to save time, not hide what changed.

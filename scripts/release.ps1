param(
  [Parameter(Mandatory = $true)]
  [string]$Message,

  [switch]$Push
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$desktopGit = Join-Path $env:LOCALAPPDATA "GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe"

if (Test-Path $desktopGit) {
  $git = $desktopGit
} elseif (Get-Command "git" -ErrorAction SilentlyContinue) {
  $git = "git"
} else {
  throw "Git was not found on PATH and GitHub Desktop bundled Git was not found."
}

Set-Location $repoRoot

& $git status --short
& $git add -A

$status = & $git status --short
if (-not $status) {
  Write-Host "No changes to commit."
  if ($Push) {
    & $git push
  }
  exit 0
}

& $git commit -m $Message

if ($Push) {
  & $git push
}

Write-Host "Release commit complete."

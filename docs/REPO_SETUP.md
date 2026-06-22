# GitHub Repo Setup

Suggested repo name:

`vedapath-ai`

Suggested description:

Source-first AI learning companion for Vedic and Hindu philosophical texts.

## Option A: Create From GitHub Website

1. Go to GitHub.
2. Click the `+` icon in the top-right.
3. Select `New repository`.
4. Repository name: `vedapath-ai`.
5. Description: `Source-first AI learning companion for Vedic and Hindu philosophical texts.`
6. Choose `Private` while the idea is early.
7. Do not initialize with README if you plan to push this local folder directly.
8. Click `Create repository`.

## Option B: Push This Local Folder

From the `vedapath-ai` folder:

```powershell
git init
git add .
git commit -m "Initialize VedaPath AI foundation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vedapath-ai.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Fast Release Commit Helper

After the repo is initialized, future release commits can use:

```powershell
.\scripts\release.cmd -Message "Add first clickable prototype"
```

After the remote is connected, add `-Push`:

```powershell
.\scripts\release.cmd -Message "Add first clickable prototype" -Push
```

## Recommended First Branching Model

- `main`: stable foundation
- `prototype`: clickable UI experiments
- `research`: source ingestion and evaluation experiments

## Recommended Repo Settings

Enable:

- Issues
- Discussions later, not immediately
- Branch protection once code begins

Keep private until:

- brand direction is stable
- MVP prototype exists
- source licensing choices are clear
- public positioning is reviewed

## First GitHub Issues To Create

1. Define first 50 source-backed sample answers
2. Design Ask screen wireframe
3. Design answer source card
4. Prototype Claim Checker
5. Build first source schema
6. Research public-domain source licensing
7. Define safety and religious authority policy
8. Create correction pipeline model

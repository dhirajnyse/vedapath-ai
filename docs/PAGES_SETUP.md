# GitHub Pages Setup

The repo includes a static preview hub at `index.html` and a GitHub Actions workflow at:

`.github/workflows/pages.yml`

## Preferred Setup

1. Make the repository public.
2. Go to `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Save.
5. Go to the `Actions` tab.
6. Open `Deploy GitHub Pages`.
7. Run the workflow if it has not already started.

Live URL:

`https://dhirajnyse.github.io/vedapath-ai/`

## Branch Setup Alternative

If you prefer branch-based Pages:

1. Go to `Settings -> Pages`.
2. Set `Source` to `Deploy from a branch`.
3. Set branch to `main`.
4. Set folder to `/root`.
5. Save.

GitHub may take a few minutes before the live URL stops showing `404`.


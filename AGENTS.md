# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the single-page entry point that wires all assets and section anchors.
- `css/` holds compiled styles (`style.css`) and vendor CSS; keep custom tweaks in `style.css` only.
- `js/` contains vendor bundles plus authored logic in `scripts.js` and the WebGL view in `app.js`; place small helpers in `js/lib/`.
- Assets live under `images/`, `videos/`, `fonts/`, and `ico/`; reuse existing naming patterns (lowercase, hyphenated) when adding files.

## Build, Test, and Development Commands
- `python3 -m http.server 8000` (run from the repo root) serves the site locally for quick smoke-tests.
- `npx serve .` offers live reloading if you already have Node installed; keep the port defaulted to avoid CNAME conflicts.
- `open index.html` (macOS) or `xdg-open index.html` (Linux) is the fastest way to spot-check static edits without a server.

## Coding Style & Naming Conventions
- Follow the existing two-space indentation in `js/scripts.js`; prefer early returns and inline comments only when clarifying UI flows.
- Keep vanilla ES5-compatible syntax where possible—compatibility scripts still target older mobile browsers.
- Class and ID names should stay lowercase-hyphen (`.navigation-menu`), matching current HTML structure.
- Run `npx prettier --write index.html js/scripts.js css/style.css` before committing when touching layout or scripting.

## Testing Guidelines
- No automated suite exists; rely on manual QA in Chrome, Safari, and mobile-sized viewports, ensuring animations, Swiper slides, and audio toggles behave.
- When changing WebGL assets (`js/app.js` or `shaders/`), verify the depth effect on both retina and standard displays.
- Document any known regressions in the PR body and link to the tracked issue.

## Commit & Pull Request Guidelines
- Base commits on short, imperative messages (`Fix language toggle`, `Update hero shader`), mirroring the existing history.
- Each PR should summarize the user-facing change, list manual test steps, and include screenshots or screen recordings for visual updates.
- Reference related issues with `Fixes #id` when applicable, and request review before merging to maintain provenance.

## Asset & Content Updates
- Compress new media (images ≤ 500 KB, videos web-optimized) before committing.
- Keep `CNAME` untouched unless the deployment domain changes; coordinate with maintainers for DNS adjustments.

# Repository Guidelines

## Project Structure & Module Organization
- Single-page site built with React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui.
- `index.html` is the Vite entry: meta tags, icons, and Google Fonts (Instrument Serif, Inter, Noto Sans/Serif JP).
- `src/content.ts` holds every visible string as an EN/JP pair. Edit copy there, never inline in components.
- `src/components/` has one file per section (`Nav`, `Hero`, `Approach`, `HowWeWork`, `Projects`, `Contact`, `Footer`); `src/components/ui/` holds shadcn components (the `glass` button variant lives in `button.tsx`).
- `src/lib/` holds helpers: `i18n.tsx` (language toggle, stored in localStorage), `motion.tsx` (scroll reveal and scroll-progress hooks), `utils.ts`.
- `src/index.css` defines the theme tokens, the `.liquid-glass` surface, and the motion keyframes.
- Static assets live in `public/` and are served from the site root: `public/images/`, `public/videos/`, `public/ico/`, and `public/CNAME`.
- Section anchors (`#learn`, `#about`, `#works`, `#work-with-us`) are public links; keep them stable.

## Build, Test, and Development Commands
- `npm install` installs dependencies (commit `package-lock.json`).
- `npm run dev` starts the Vite dev server with hot reload.
- `npm run build` type-checks (`tsc -b`) and writes the production site to `dist/`.
- `npm run preview -- --port <free port>` serves `dist/` for a production-like smoke test. Check the port is free first.
- `npm run lint` runs oxlint.

## Deployment
- `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`.
- The repository's Pages source must be set to "GitHub Actions" (`build_type: workflow`). The custom domain is `www.apollostreetcompany.com`, with `public/CNAME` kept in sync.
- DNS is at GoDaddy: the apex has the four GitHub Pages A records (185.199.108-111.153) and AAAA records; `www` is a CNAME to `apollostreetcompany.github.io`. Keep "Enforce HTTPS" on.

## Coding Style & Naming Conventions
- Two-space indentation, single quotes, no semicolons, matching the existing TypeScript.
- Components are PascalCase files; CSS classes and asset files stay lowercase-hyphen.
- Every animation must have a `prefers-reduced-motion` fallback (see `src/index.css` and `prefersReducedMotion()`).
- Copy changes are reviewed by the owner before shipping. Do not reword existing copy without approval.

## Testing Guidelines
- No automated test suite; `npm run build` and `npm run lint` must pass.
- Manually check desktop and phone widths in EN and JP: the hero video loops, the reveals fire, the nav stays readable over the hero, and there is no horizontal scroll.
- When changing the hero video or its poster, check the loop point for a visible jump.

## Commit & Pull Request Guidelines
- Short, imperative commit messages (`Fix language toggle`, `Update hero video`).
- Each PR summarizes the user-facing change, lists manual test steps, and includes screenshots or recordings for visual changes.
- Reference related issues with `Fixes #id` when applicable.

## Asset & Content Updates
- Compress new media: images ≤ 500 KB, videos H.264 MP4 with `-movflags +faststart` and no audio track.
- Put project card images in `public/images/projects/` and register them in `src/content.ts` with a `fit` mode and frame `ground` colour.
- Keep `public/CNAME` untouched unless the deployment domain changes.

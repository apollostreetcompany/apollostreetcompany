## Goal (incl. success criteria)
Rebuild the Apollo Street Company landing page as a cinematic, motion-rich single page (React + Vite + TypeScript + Tailwind + shadcn/ui), keep the Japan-US studio positioning and existing copy, update the portfolio, and restore HTTPS on www.apollostreetcompany.com.

Success criteria:
- Hero plays a looping animation of the existing skyline artwork; glass nav; Instrument Serif type; fade-rise and scroll-reveal motion with reduced-motion fallbacks
- Portfolio shows Shogun Sauce, Gochamaze, Christ Lab, Chosen Portion, Japan Visa Guide (RaiseUp and Bitstick gone)
- Copy unchanged except owner-approved items (Lavish copy review); EN and JP parity
- Renders cleanly at desktop and phone widths in EN and JP, no horizontal scroll
- https://www.apollostreetcompany.com serves with a valid certificate and HTTPS enforced

## Constraints/Assumptions
- No automated test suite; `npm run build` + `npm run lint` + manual visual QA
- Do not change copy without owner approval (2026-09-25); all changes listed in `.lavish/copy-review.html`
- Browser work goes through the Aside browser, not Claude-in-Chrome (owner preference 2026-09-25)
- Hosting stays on GitHub Pages; DNS stays at GoDaddy

## Key Decisions
- Restored the missing structural CSS from `main` instead of trying to patch the broken reduced stylesheet
- Kept the cleaned HTML and current project/CTA copy from the working branch
- Added a light responsive polish pass for hero readability, works rhythm, and CTA balance
- Rebuilt the page around the generated hero imagery, a full-bleed slider, editorial section spacing, line-based operating model rows, and larger project showcases
- Simplified authored JavaScript to cover preloader, Swiper, menu state, smooth anchors, language switching, and work hover color
- 2026-09-25: Rebuild on React 19 + Vite 8 + TS + Tailwind v4 + shadcn/ui per owner's brief; deploy via GitHub Actions to Pages (`build_type: workflow`)
- 2026-09-25: Hero video = Midjourney HD animation of `images/slide01.png` (job 23c0380a, variant 1, picked by owner), loop seam cross-faded (0.5 s) and encoded to `public/videos/hero-loop.mp4` (3.1 MB)
- 2026-09-25: Portfolio = five projects (owner chose to keep Japan Visa Guide, drop RaiseUp); project cards use real product visuals, not Midjourney art
- 2026-09-25: Positioning stays Japan-US studio; hero keeps "Crossing Borders" until the owner decides the proposed "Two markets. One street." (copy review C-01)
- 2026-09-25: Hero adds a light navy veil + soft radial shade behind the type (departure from the brief's "no overlays") because the artwork's bright sun sits behind the headline
- 2026-09-25: DNS fix approved by owner: `www` CNAME -> `apollostreetcompany.github.io.`, delete TXT `v=spf1 include:secureserver.net -all`
- 2026-09-26: Copy review (Lavish) verdicts: C-02 to C-08 approved as built (remove second hero slide, loader text, RaiseUp; Shogun wording fix; Gochamaze, Christ Lab, Chosen Portion cards). C-01 hero headline: owner chose "use my wording" but sent no text; site keeps "Crossing Borders" until the wording arrives
- 2026-09-26: apollostreetcompany.com is not in the owner's main GoDaddy account (20 domains, none match); it lives in another GoDaddy account
- 2026-09-27: DNS changed at GoDaddy via Aside: `www` CNAME -> `apollostreetcompany.github.io.`; deleted TXT `v=spf1 include:secureserver.net -all` (GoDaddy DKIM `secureserver1/2._domainkey`, `email` CNAME and autodiscover SRV left in place). Pre-change record list kept in the session scratchpad
- 2026-09-27: Pages certificate approved for www + apex (Let's Encrypt, expires 2026-12-26, auto-renews); HTTPS enforced

## State
### Done
- [x] Bead 1: Restore landing page structure and responsive spacing after the UI regression
- [x] Bead 2: Rebuild the landing page with a polished modern design, local browser QA, branch push, and main merge
- [x] Outage diagnosis (2026-09-25): deploy healthy; HTTPS broken because GoDaddy `www` CNAME points at the apex, so Pages treats www as proxied and issues no certificate
- [x] Bead 3a: Midjourney hero animation generated, chosen, loop-smoothed, encoded
- [x] Bead 3b: React rebuild on branch `feat/bead-3-cinematic-rebuild`; build + lint pass; desktop/phone/JP visual QA in Aside
- [x] Bead 3c: Copy review page generated from a diff of live copy vs `src/content.ts` (8 items, coverage-checked); 7 of 8 approved

- [x] Bead 3d: Deployed via GitHub Actions (run 36248749581); live assets match local build
- [x] Bead 3e: DNS fixed, certificate issued, HTTPS enforced; live https QA in Aside (video plays, fonts load, no insecure references, apex/http redirect to https://www)

### Now
- Waiting on owner: C-01 hero headline wording (EN + JP)

### Next
- Apply C-01 headline wording when it arrives: edit `hero.titleLead`/`hero.titleEm`/`hero.lede` in `src/content.ts`, build, push to `main`

## Open Questions
- C-01 hero headline wording (EN + JP)

## Working Set
- `src/content.ts` (all copy), `src/components/*`, `src/index.css`
- `public/videos/hero-loop.mp4`, `public/images/projects/*`
- `.github/workflows/deploy.yml`
- `npm run build`, `npm run preview -- --port 4317 --host 127.0.0.1`
- Local status page: `.agent/status.html` (generated from `.agent/status.json`)

## Goal (incl. success criteria)
Rebuild the Apollo Street Company landing page into a more polished, modern static site while preserving the Japan-US operating theme, page outline, and existing brand assets.

Success criteria:
- Hero, intro, operating model, work showcase, and CTA render cleanly at mobile, tablet, and desktop widths
- No major blank sections, collapsed spacing, or off-screen text
- Site is pushed so deployment can pick up the redesign

## Constraints/Assumptions
- Static site with no automated test suite
- Keep the established blue/red/gold Apollo Street visual language
- Reuse existing local assets rather than adding dependencies or remote media
- Local browser/server verification succeeded in the current full-access session

## Key Decisions
- Restored the missing structural CSS from `main` instead of trying to patch the broken reduced stylesheet
- Kept the cleaned HTML and current project/CTA copy from the working branch
- Added a light responsive polish pass for hero readability, works rhythm, and CTA balance
- Rebuilt the page around the generated hero imagery, a full-bleed slider, editorial section spacing, line-based operating model rows, and larger project showcases
- Simplified authored JavaScript to cover preloader, Swiper, menu state, smooth anchors, language switching, and work hover color

## State
### Done
- [x] Bead 1: Restore landing page structure and responsive spacing after the UI regression
- [x] Bead 2: Rebuild the landing page with a polished modern design, local browser QA, and branch push

### Now
- Monitor the remote Bead 2 branch/deployment path

### Next
- Decide whether to merge/deploy from `main` or continue through a branch/PR flow

## Open Questions
- Whether GitHub Pages should deploy directly from `main` or via a branch/PR flow

## Working Set
- `index.html`
- `css/style.css`
- `js/scripts.js`
- `CONTINUITY.md`
- `python3 -m http.server 8000 --bind 127.0.0.1`
- `agent-browser --args "--no-sandbox"`

## Goal (incl. success criteria)
Restore the Apollo Street Company landing page so the original layout, spacing, and responsive behavior are stable again while keeping the improved messaging and project content.

Success criteria:
- Hero, intro, work showcase, and CTA render cleanly at mobile, tablet, and desktop widths
- No major blank sections, collapsed spacing, or off-screen text
- Site is pushed so deployment can pick up the fix

## Constraints/Assumptions
- Static site with no automated test suite
- Keep the established visual language instead of redesigning the page
- Preserve the recent copy/content improvements where they do not break layout

## Key Decisions
- Restored the missing structural CSS from `main` instead of trying to patch the broken reduced stylesheet
- Kept the cleaned HTML and current project/CTA copy from the working branch
- Added a light responsive polish pass for hero readability, works rhythm, and CTA balance

## State
### Done
- [x] Bead 1: Restore landing page structure and responsive spacing after the UI regression

### Now
- Final verification, commit, and push of the landing page recovery bead

### Next
- Monitor deployed site and only iterate further if a concrete visual regression remains

## Open Questions
- None at the moment

## Working Set
- `index.html`
- `css/style.css`
- `js/scripts.js`
- `python3 -m http.server 8000`
- `agent-browser`

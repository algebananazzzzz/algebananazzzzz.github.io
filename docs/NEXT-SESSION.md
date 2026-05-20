# Hand-off to the next session

Last session executed a 31-task plan to build the "Constellation Explorer" portfolio. The build hits Lighthouse 100/100/100/100 desktop and 90+ mobile, but the **visual fidelity is well below the original prototype**. The user — rightly — called this out.

This doc is the briefing for the next session. Read it once, then begin.

## Current state

- **37 commits** on `main` (no remote yet)
- **Astro 5 + Tailwind v4 + React 18** stack, fully static
- **Production build** at `/Users/bytedance/algebananazzzzz2.0/dist/` (5 routes)
- **Spec**: `docs/superpowers/specs/2026-05-19-portfolio-v3-design.md`
- **Plan**: `docs/superpowers/plans/2026-05-19-portfolio-v3.md`
- **Audit**: `docs/audit-2026-05-19.md`
- **Original prototype**: `design-handoff/algebananazzzzz-2-0/project/` (read-only reference)
  - Primary file: `Portfolio v3.html`
  - 2257-line `v3/v3-styles.css` carries most of the cosmic styling — **not yet ported**

## The honest gap

I shipped clean architecture and great Lighthouse scores but **dropped most of the visual richness** that made the prototype distinctive. Concretely:

- Hero is plain text without the **mascot illustrations**, **cluster chips** ("currently orbiting"), or the elaborate **"Enter the Milky Way" CTA pill** (animated nebula gradient + starfield + shimmer)
- Splash technically has scroll parallax + warp, but the **horizon glow, deep nebula bloom, and intermediate transition fidelity** are missing
- Projects rendered as plain cards — prototype has **stellar magnitude labels + spectral class** per project ("mag 4.2 · B7 IV")
- Career timeline has a simple gradient spine — prototype has **per-row gradient segments fading between adjacent star colors/brightnesses**
- **No Skills section** at all (prototype's `v3-skills-hr.jsx` is the HR-diagram skills view, was skipped)
- **No page mascots** (saturn / moon / rocket on different routes)
- Cosmos canvas is much simpler than the prototype's **4-layer nebula (far/mid/near + MW streak)** with `--bloom` ramped by scroll
- AccentOrb is two simple blobs — prototype has a more elaborate **section-aware ambient tint over the cosmos**
- Constellation lines don't **draw themselves on load** (stroke-dasharray animation) — they appear instantly
- No **constellation breathing pulse**
- Milky Way page galaxy is decent but lacks the **luminous tilted ellipses + dust + warm core bulge** richness
- Orrery is bare — prototype has more elaborate orbital styling
- No **floating quote / motto** rotating at top-right
- Typography spacing and gradient seams are off in many places

## Plan for the new session

### Step 1 — Confirm tools are loaded

```
Verify these are available:
- mcp__playwright__browser_navigate (or similar; from @playwright/mcp)
- frontend-design:frontend-design skill (already in available-skills)
```

If the playwright MCP tools aren't in the deferred tool list, run `claude mcp list` to confirm it's registered (already added to `~/.claude.json`).

### Step 2 — Read this doc + the spec + the prototype's v3-styles.css

Don't re-do brainstorming. The user already approved:

- Tech stack (Astro 5 / Tailwind v4 / React 18)
- Architecture (static .astro + selective React islands)
- Content model (YAML in `src/content/`)
- **Full visual fidelity** as the goal (verbatim from session 1: "the design is the most important aspect")
- Deploy to GitHub Pages

What needs revisiting is the **visual implementation only**.

### Step 3 — Side-by-side render

1. Serve the prototype: `cd design-handoff/algebananazzzzz-2-0/project && npx http-server -p 5000 --silent &`
2. Build + serve mine: `npm run build && npx http-server dist -p 4321 --silent &`
3. Use Playwright MCP to navigate to both at desktop 1440×900 (and mobile 390×844)
4. Take full-page screenshots of each route on both
5. Visually compare. Don't just enumerate text; describe what looks different.

Suggested screenshot pairs (proto vs mine):

- `http://localhost:5000/Portfolio%20v3.html` ↔ `http://localhost:4321/`
- `…#/about` ↔ `…/about`
- `…#/projects` ↔ `…/projects`
- `…#/experience` ↔ `…/experience`
- `…#/milky-way` ↔ `…/milky-way`

### Step 4 — Invoke frontend-design skill for the polish pass

The new `frontend-design:frontend-design` skill is purpose-built for production-grade visual work and explicitly avoids generic AI aesthetics. Use it for each section that needs upgrading.

### Step 5 — Port v3-styles.css faithfully

The 2257-line CSS in `design-handoff/algebananazzzzz-2-0/project/v3/v3-styles.css` is the source of most visual detail. Don't transcribe it into Tailwind utilities — copy the relevant blocks into `src/styles/v3.css` and reference the classnames directly in components. Tailwind utilities are great for layout; v3.css carries the cosmic specifics.

Also worth pulling in:

- `design-handoff/.../project/styles.css` (866 lines — site-level)
- `design-handoff/.../project/page-styles.css` (235 lines — page-level)
- `design-handoff/.../project/mw-styles.css` (497 lines — Milky Way page)

### Step 6 — Specific component upgrades (priority order)

1. **Cosmos** — port the 4-layer nebula + bloom-on-scroll variable (see `v3-styles.css` `.v3-cosmos`)
2. **Splash** — port the horizon glow, eyebrow letter-spacing animation, sub-text scatter on scroll
3. **Hero** — add mascot illustration (use `public/assets/illustrations/planet-saturn.svg`), cluster chips ("currently orbiting" with cluster dot colors), the elaborate Milky Way CTA pill
4. **ProjectsConst** — replace static `ProjectCard` with a constellation-card view that has stellar magnitude + spectral class labels per project
5. **CareerList** — replace static `ExperienceRow` with per-row gradient spine that fades between adjacent star colors
6. **Skills HR** — implement the missing HR-diagram skills section from `v3-skills-hr.jsx`
7. **Constellation drawing animation** — stroke-dasharray reveal on first paint
8. **Milky Way page** — port the luminous streak ellipses + warm core bulge from `v3-styles.css` `.v3-mw-*`
9. **Per-page mascots** — surface route-specific illustration in a corner (saturn home, moon about, etc.)
10. **Floating quote** — top-right rotating motto card linking to source note

### Step 7 — Verify each section visually

Use playwright MCP between each commit:

1. Screenshot both versions of the route you just changed
2. Compare — does it match?
3. If yes, commit. If no, iterate.

Don't ship Lighthouse-validated-but-visually-wrong code again.

## What to preserve from this session

- The architecture (Astro + Tailwind v4 + React islands) — sound
- The content YAMLs in `src/content/` — content correct, schema correct
- The lib/ utilities (stardate, magnitude, routes, useReducedComplexity) — tested, working
- The Lighthouse targets — keep 100s desktop / 90+ mobile as a backstop, but don't compromise design fidelity to chase them

## What can change

- Any component file under `src/components/`
- `src/styles/v3.css` (currently a stub — fill it in)
- `src/styles/global.css` (Tailwind theme + utilities)
- `src/pages/*.astro` (page composition)

Don't touch `src/content/*.yaml` (content is fine).

## User's mental model

The user is Daniel (NUS CS undergrad, daniel.zhouqx@gmail.com). The placeholder content is plausibly real, so do NOT swap it. They iterated on the prototype over six chats with high-effort visual feedback — they will notice every gap.

Their phrase from this session: "_holy disappointment. it is so far from the original design..._" — take that seriously. The fix is not "Lighthouse 100s and ship"; the fix is "looks like the prototype."

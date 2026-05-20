# Astro structure audit — design

**Date:** 2026-05-20
**Scope:** Vet the whole Astro site for best-practice alignment, eliminate inefficiencies and style overrides, raise maintainability, generate `CLAUDE.md` + `README.md`.
**Constraint:** Visual parity is non-negotiable. The live UI of `/`, `/about`, `/projects`, `/experience`, `/milky-way` must look the same after the refactor.

---

## Inputs that shaped this design

- User picked **B** on visual risk: visual parity required, but architectural cleanup is allowed.
- User picked **B** on repo hygiene: delete loose PNGs + `design.bin` from disk, plus `.gitignore` additions.
- User picked **B** on docs: dense LLM-ops `CLAUDE.md` + full public `README.md`.
- User picked **A** on TS: full strictness pass — YAML shim + content-collection schemas + kill `any` in islands.
- User picked **A** on tooling: Prettier + `prettier-plugin-astro` + `.editorconfig`; no ESLint this pass.
- User picked **1** on PR shape: one big PR — but routed it into "everything on `main` first, then the CI work on `feat/introduce-ci-pipelines`."

---

## Branch + commit plan

All commits land on `main` unless noted.

1. `chore: prettier + editorconfig + gitignore` — add `prettier`, `prettier-plugin-astro` to devDeps; `.prettierrc`, `.prettierignore`, `.editorconfig`; extend `.gitignore` with `.playwright-mcp/` and root-level `*.png` (negated under `public/` and `src/`).
2. `chore: prune loose artifacts` — `rm` the 19 root PNGs, `design.bin`, and the `.playwright-mcp/` directory. (`design.bin` is already gitignored — this just removes it from disk.)
3. `style: prettier --write .` — pure formatting commit, isolated so later commits have clean semantic diffs.
4. `refactor: astro structure` — see §1.
5. `refactor: css layering` — see §2.
6. `refactor: ts strictness` — see §3.
7. `docs: claude.md + readme` — see §4.

Then branch `feat/introduce-ci-pipelines` off `main`:

8. `ci: split deploy + add feature-branch CI` — rename existing `deploy.yml` → `2-preprod-deploy.yml`; add `1-feature-branch-ci.yml` running `format:check`, `astro check`, `vitest run`, `astro build` on PRs and non-main pushes.

Ship as a single PR for that branch.

---

## §1 — Astro structure refactor

### 1.1 Fix nested `<main>` (blocking a11y bug)

Current `Base.astro:58` renders `<main id="main-content" class="page">` and every page emits its own `<main class="page" data-accent="...">` inside the slot. Rendered DOM has `<main><main>...</main></main>` — invalid HTML, breaks the `#main-content` skip-link target.

**Fix:** `Base.astro` keeps the canonical `<main id="main-content">`. Drop `class="page"` off it. Pages stop wrapping their content in `<main>` — they emit `<div class="page" data-accent="...">` (or `<div class="mw-page">`). The `.page` and `.mw-page` selectors stay class-only.

Files touched: `src/layouts/Base.astro`, `src/pages/about.astro`, `src/pages/projects.astro`, `src/pages/experience.astro`, `src/pages/milky-way.astro`.

### 1.2 Landmark the chrome

Add `<header>` around `<TopNav />` in `Base.astro`. The site currently has no header landmark.

### 1.3 Hydration audit

Confirm and adjust:
- `Splash` — `client:load` (correct; first paint).
- `Cosmos`, `AccentOrb`, `Meteor` — `client:idle` (correct; chrome).
- `MilkyWayStreak` — `client:only="react"` (correct; randomized dust → SSR mismatch otherwise; per memory).
- `Orrery`, `ProjectsConst`, `CareerList`, `MilkyWay`, `ProjectsList` — currently `client:idle`. Promote below-fold islands on home (`CareerList`, `MilkyWay` preview) to `client:visible` so initial idle-time isn't spent hydrating things the user may never scroll to. Keep `Orrery` and `ProjectsConst` on `client:idle` (closer to fold).
- `NotePanel` — verify any consumer; remove if unused.

### 1.4 Dead-component prune

`git status` already shows seven static components deleted (`ClusterChip`, `ExperienceRow`, `Eyebrow`, `NoteCard`, `ProjectCard`, `SectionHead`, `StatusPill`). Grep the tree for stragglers — any remaining import of a deleted file is a bug to fix. Also verify `NotePanel.tsx` and any `SkillsHR.tsx` residue: if no consumer, delete the file in this same commit.

### 1.5 Single source of truth for accent

`<Base accent="sunset">` already sets `<html data-accent="sunset">`. Pages currently also stamp `data-accent="sunset"` onto the wrapper. CSS that keys on `.page[data-accent]` becomes `html[data-accent] .page` (or scoped equivalents). The accent attribute on the page wrapper is removed. One source of truth: the `<html>` attribute.

`mwPage={true}` stays on `Base.astro` — that's how `/milky-way` opts out of `<Cosmos>` and `<AccentOrb>`, and it's documented as load-bearing in memory.

### 1.6 Acceptance

- `npm run build` produces 5 pages clean.
- DOM has exactly one `<main>` per page.
- Skip-link target works.
- Every page still passes the visual-parity eye check.

---

## §2 — CSS layering refactor

### 2.1 Token consolidation

`tokens.css` defines `--star: #FFC700` etc. as plain custom properties. `global.css` `@theme` block defines `--color-star: #FFC700` for Tailwind. Same values, declared twice.

**Fix:** `tokens.css` stays the source of truth. `@theme` block references the tokens (`--color-star: var(--star)`). Single source means a palette change touches one file.

Same for `--font-sans` / `--font-mono`. The note already in `tokens.css` about font-family ordering remains valid.

### 2.2 Split `portfolio.css` (3755 lines)

Cut by selector group into `src/styles/portfolio/`:

- `cosmos.css` — `.cosmos`, layers, `@property` declarations, `nebulaDrift*`/`nebulaPulse*`/`washPulse` keyframes, the `--layer-hue` / `--layer-sat-mul` / `--layer-dim` var contract documented at file top.
- `splash.css` — splash screen + transition.
- `hero.css` — `.hero`, `.hero-greeting`, `.hero-motto`, `.hero-ctas`, `.cta-milky`, `.cta-star`, `.cta-arrow`.
- `sections.css` — `.section`, `.section-head`, `.section-title`, `.eyebrow`, `.orbiting`.
- `orrery.css` — orrery-specific rules.
- `career.css` — `.career-list`, `.career-row`, `.stellar-*`.
- `constellation.css` — constellation graph rules, `cons-pulse` keyframe.
- `mw.css` — `.mw-shell`, `.mw-side`, milky-way sidebar styles.
- `meteor.css` — meteor trail.
- `topnav.css` — `.v3-topnav`, `.v3-nav-links`, `.v3-milky-pill`, `.v3-topnav-tools`, `.v3-meteor-counter`.
- `footer.css` — `.v3-footer` and its three columns.
- `legacy-resets.css` — the `body .page-root > .starfield {display:none}` block, isolated and labeled as deletable once v2 markup is gone for good.

Re-export via `src/styles/portfolio.css` (now a barrel `@import` list) so `global.css` doesn't change.

### 2.3 Dead-rule sweep

For every selector across the split files, grep the codebase for usage. Any selector with zero matches gets deleted in the same commit. Deletions listed explicitly in the commit message — no silent drops.

### 2.4 Load-bearing override map (preservation, not change)

Three places the layered CSS is *intentionally* layered. Document at the top of their owning files; do NOT touch the rules:

- `cosmos.css` — never re-add `.v3-cosmos { opacity: ... }` on sub-pages; the per-layer var contract is how sub-page dim happens without killing stars.
- `page-bg.css` — wash opacity tuned to `0.55` (handoff says `0.85` but the new pulse/AccentOrb stack pushes effective peak too high; verified against Playwright captures).
- `cosmos.css` and `page-bg.css` jointly — per-layer `filter` composes with `var(--layer-sat-mul)` / `var(--layer-hue)`; never overwrite with a raw value.

### 2.5 Acceptance

- `global.css` import order unchanged from outside.
- `npm run build` produces a CSS bundle no larger than current (the split + sweep should be neutral-or-smaller; if it grew, something was duplicated; if much smaller, spot-check that nothing live got cut).
- Visual-parity eye check across all five pages.

---

## §3 — TypeScript strictness pass

### 3.1 YAML module shim

`src/types/yaml.d.ts`:
```ts
declare module '*.yaml' {
  const data: any;
  export default data;
}
```
Acceptable `any` because content collections (next step) provide real types at every consumer site.

### 3.2 Content collection schemas

Read `src/content/config.ts` to see which collections are currently defined. Add Zod schemas for every collection found there (likely `projects`, `experience`, `notes`, `clusters`; check the file for the actual list). Standalone YAML files imported directly (`site.yaml`, `mottos.yaml`, `about.yaml`, `now.yaml`) stay under the `*.yaml` shim — promote any to a collection only if it makes consumer code cleaner.

Schemas derived by inspecting actual YAML files; sometimes-missing fields use `.optional()` per real data, not relaxed globally.

Export inferred types: `export type Project = z.infer<typeof projectSchema>`, etc.

### 3.3 Kill `any` in islands

Every island consuming collection data takes a real prop type imported from `content/config.ts`:

- `Constellation.tsx`, `MilkyWay.tsx` — `notes: Note[]`, `clusters: Cluster[]`.
- `ProjectsConst.tsx`, `ProjectsList.tsx` — `projects: Project[]`.
- `CareerList.tsx` — `entries: CareerEntry[]` (the pages already shape this; promote the inline shape to a named type).
- `Orrery.tsx` — `building`, `writing`, `obsessed` typed from `now` schema.
- `NotePanel.tsx` — `note: Note`.

### 3.4 Page-side `.map((x: any) =>`

These become unnecessary once collections are typed. Remove the `: any` annotations.

### 3.5 Acceptance

- `npm run check` exits 0.
- `npm test` still passes.

---

## §4 — Docs

### 4.1 `CLAUDE.md` (root)

Operational guide for future Claude sessions. Sections:

- **Stack + key paths** — Astro 5, React 18 islands, Tailwind v4, content collections; where each lives.
- **Hard rules** —
  - One `<main>` per page; pages emit `<div class="page">`, not `<main class="page">`.
  - Cosmos var contract (`--layer-hue`/`--layer-sat-mul`/`--layer-dim`) is load-bearing. Never re-add `.v3-cosmos { opacity: ... }` on sub-pages.
  - Sub-page wash opacity is `0.55` by design (not handoff's `0.85`). Increase orb gradient alphas first if a page feels under-accented.
  - `prefers-reduced-motion` handled globally in `global.css`.
  - `Meteor.tsx` double-rAF + forced reflow stays — single-rAF collapses the animation.
  - Home cosmos drifts continuously; never tie it to per-section accent changes.
  - SSR-mismatch fix in `ProjectsConst.tsx` (round4 quantization) stays.
  - `MilkyWayStreak` is `client:only="react"` (randomized dust → SSR mismatch).
- **Component map** — which island owns what; which CSS file owns what selectors.
- **Content collections** — schema location, how to add a project/note/exp/cluster.
- **Workflows** — `npm run dev/build/check/test`; `npm run format`; CI gates.
- **Where the design handoff lives** — `design-handoff/` (gitignored).

### 4.2 `README.md` (root)

Public-facing. Sections: hero (project pitch + live URL), tech stack, local dev (clone → `npm install` → `npm run dev`), scripts table, deployment (auto via `2-preprod-deploy.yml` to GitHub Pages), project structure (one level deep), credits.

No marketing-deck copy in CLAUDE.md; no internal gotchas in README.

---

## §5 — CI pipelines (on `feat/introduce-ci-pipelines`)

### 5.1 Rename existing workflow

`deploy.yml` → `2-preprod-deploy.yml`. Content unchanged.

### 5.2 New `1-feature-branch-ci.yml`

Triggers: `pull_request` against any branch + `push` to any non-`main` branch.

Steps: checkout → setup-node from `.nvmrc` → `npm ci` → `npm run format:check` → `npm run check` → `npm test` → `npm run build`.

Single job. No deploy.

`format:check` is added to `package.json` scripts in the prettier commit on `main`:
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

---

## §6 — Verification

Before opening the docs commit:

- `npm run check` — clean.
- `npm test` — passes.
- `npm run build` — 5 pages clean.
- `npm run dev` + Playwright visual diff vs baseline captures taken at the **start** of this work (saved to a tmp dir outside the repo, not the root — root PNGs are getting deleted in commit 2).

Acceptance bar: no nested `<main>`, no orphan CSS classes detected by sweep, build size within 5%, eye-check parity on all five pages.

---

## Out of scope

- ESLint (deferred per user choice A).
- Reworking the cosmos/wash/pulse system (visual parity constraint).
- Content edits.
- Adding new features.
- Touching `design-handoff/`.

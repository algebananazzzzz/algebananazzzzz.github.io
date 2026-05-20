# Astro Structure Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit and tighten the Astro site for best-practice compliance, eliminate style overrides and dead rules, raise TS strictness, and generate `CLAUDE.md` + `README.md`. Plus a separate CI branch.

**Architecture:** Refactor in commit-sized slices on `main`. Each commit is independently revertable. CSS file-split is mechanical (cut-and-paste by selector group with a barrel re-export so callers don't change). TS strictness flows from a Zod schema upgrade in `src/content/config.ts`. Visual parity is the success bar — Playwright captures before/after for eye-check. CI pipelines land on a separate branch (`feat/introduce-ci-pipelines`) as a single reviewable PR.

**Tech Stack:** Astro 5, React 18 islands, Tailwind v4, TypeScript 5.7, Vitest, Playwright (verification only), GitHub Actions.

**Spec reference:** `docs/superpowers/specs/2026-05-20-astro-structure-audit-design.md`

---

## Task 0: Baseline + safety net

**Files:**
- None (read-only setup)

- [ ] **Step 1: Verify branch is `main` and confirm uncommitted state**

Run: `git status --short && git rev-parse --abbrev-ref HEAD`
Expected: branch is `main`. There will be many pre-existing uncommitted changes — that's fine, they stay. We only commit what we touch.

- [ ] **Step 2: Take visual baseline captures**

Run:
```bash
mkdir -p /tmp/audit-baseline
npm run dev &
sleep 8
npx playwright screenshot --full-page http://localhost:4321/ /tmp/audit-baseline/home.png
npx playwright screenshot --full-page http://localhost:4321/about /tmp/audit-baseline/about.png
npx playwright screenshot --full-page http://localhost:4321/projects /tmp/audit-baseline/projects.png
npx playwright screenshot --full-page http://localhost:4321/experience /tmp/audit-baseline/experience.png
npx playwright screenshot --full-page http://localhost:4321/milky-way /tmp/audit-baseline/milky-way.png
kill %1 2>/dev/null || true
ls -la /tmp/audit-baseline/
```
Expected: 5 PNG files. These are the eye-check reference at the end.

If Astro dev server is on a different port (check `astro.config.mjs` — `output: 'static'` defaults to `:4321`), adjust accordingly.

- [ ] **Step 3: Confirm clean build + tests work before we start**

Run: `npm run build && npm test`
Expected: build emits 5 pages; tests pass. If either fails, STOP and report before making changes.

---

## Task 1: Add Prettier + EditorConfig + extend gitignore

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `.editorconfig`
- Modify: `.gitignore`
- Modify: `package.json` (devDeps + scripts)

- [ ] **Step 1: Install Prettier + Astro plugin**

Run: `npm install --save-dev --save-exact prettier@3.3.3 prettier-plugin-astro@0.14.1`
Expected: installed; `package.json` `devDependencies` now includes both.

- [ ] **Step 2: Add format scripts to package.json**

Edit `package.json` `scripts` block to add:
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

Verify with: `cat package.json | grep -A1 '"format"'`

- [ ] **Step 3: Write `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

- [ ] **Step 4: Write `.prettierignore`**

```
node_modules/
dist/
.astro/
design-handoff/
design.bin
*.lock
package-lock.json
public/
docs/superpowers/
```

(`docs/superpowers/` is ignored because spec/plan markdown is hand-curated and Prettier would reflow our prose.)

- [ ] **Step 5: Write `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 6: Extend `.gitignore`**

Replace `.gitignore` with:
```
node_modules/
.DS_Store
dist/
.astro/
.env
.env.*
!.env.example
design.bin
design-handoff/
*.log
.vscode/
.idea/
.playwright-mcp/

# Root-level debug screenshots
/*.png
!/public/**/*.png
```

The `/*.png` glob anchors to repo root; `public/` and `src/` PNGs stay tracked.

- [ ] **Step 7: Commit**

```bash
git add .prettierrc .prettierignore .editorconfig .gitignore package.json package-lock.json
git commit -m "chore: prettier, editorconfig, and gitignore additions"
```

---

## Task 2: Prune loose artifacts

**Files:**
- Delete: `/Users/bytedance/algebananazzzzz2.0/*.png` (root only)
- Delete: `/Users/bytedance/algebananazzzzz2.0/design.bin`
- Delete: `/Users/bytedance/algebananazzzzz2.0/.playwright-mcp/`

- [ ] **Step 1: List what will be deleted (sanity)**

Run:
```bash
ls *.png design.bin .playwright-mcp 2>/dev/null
```
Expected: ~19 PNG files, `design.bin`, `.playwright-mcp/` directory. Confirm none are needed.

- [ ] **Step 2: Delete**

Run:
```bash
rm -f *.png design.bin
rm -rf .playwright-mcp
```

- [ ] **Step 3: Verify `git status` shows the deletions are no longer listed (because gitignore now hides them)**

Run: `git status --short | head -40`
Expected: the deleted artifacts no longer appear. `design.bin` was already gitignored so it never showed; the PNGs and `.playwright-mcp` now hidden by the new rules.

- [ ] **Step 4: Commit (no files to add — this is a no-op commit if nothing was tracked)**

This task may not produce a commit. The deletions are filesystem-only. Verify with:
```bash
git diff --cached --stat
```
If empty, skip the commit step and move on. The previous gitignore commit already covered the rule changes.

---

## Task 3: Run Prettier across the codebase

**Files:**
- Modify: most `.astro`, `.tsx`, `.ts`, `.css`, `.json` files

- [ ] **Step 1: Run Prettier**

Run: `npm run format`
Expected: many files reformatted. Read the output — note any parse errors and fix them before continuing.

- [ ] **Step 2: Verify nothing broke**

Run: `npm run build && npm test`
Expected: build clean, tests pass. If anything fails, the format itself caused it — revert with `git checkout .` and investigate.

- [ ] **Step 3: Commit**

```bash
git add -u  # only modified files, no untracked
git status --short  # eyeball: should be only modifications
git commit -m "style: prettier --write . (formatting-only)"
```

If `git add -u` would pull in unrelated uncommitted changes from other sessions, instead use explicit globs:
```bash
git add '*.astro' '*.tsx' '*.ts' '*.css' '*.json' '*.md'
```

---

## Task 4: Fix nested `<main>` in layout and pages

**Files:**
- Modify: `src/layouts/Base.astro` (around line 58)
- Modify: `src/pages/about.astro:6`
- Modify: `src/pages/projects.astro:9`
- Modify: `src/pages/experience.astro:19`
- Modify: `src/pages/milky-way.astro:41`
- Modify: `src/pages/index.astro` (verify — home does NOT wrap in `<main>` currently, but confirm)

- [ ] **Step 1: Update `Base.astro` to be the only `<main>` source**

Edit `src/layouts/Base.astro` line 58:

OLD:
```astro
<main id="main-content" class="page">
  <slot />
</main>
```

NEW:
```astro
<header><TopNav /></header>
<main id="main-content">
  <slot />
</main>
```

Move the existing `<TopNav />` line from above `<main>` into the new `<header>`. Drop the `class="page"` off `<main>` — `.page` is now a page-level wrapper class only.

- [ ] **Step 2: Update `src/pages/about.astro`**

OLD:
```astro
<Base title="about" description="who Daniel is and how he works." accent="aurora">
  <main class="page" data-accent="aurora">
```

NEW:
```astro
<Base title="about" description="who Daniel is and how he works." accent="aurora">
  <div class="page">
```

Update the closing `</main>` at the end of the page to `</div>`. Remove `data-accent="aurora"` on the wrapper — it's already on `<html>` from `Base.astro`.

- [ ] **Step 3: Update `src/pages/projects.astro`**

Same pattern: `<main class="page" data-accent="sunset">` → `<div class="page">`. Close with `</div>`.

- [ ] **Step 4: Update `src/pages/experience.astro`**

Same pattern: `<main class="page" data-accent="nebula">` → `<div class="page">`. Close with `</div>`.

- [ ] **Step 5: Update `src/pages/milky-way.astro`**

OLD:
```astro
<main class="mw-page" data-accent="cosmic">
```

NEW:
```astro
<div class="mw-page">
```

Close with `</div>`.

- [ ] **Step 6: Verify `src/pages/index.astro` has no `<main>` wrapper**

Run: `grep -n '<main' src/pages/index.astro`
Expected: no matches. (Home page already uses `<section>`s directly under the slot.)

- [ ] **Step 7: Build and visually check**

Run: `npm run build` — should be clean.

Run: `npm run dev` in a separate terminal, then in a browser visit each page and run in DevTools:
```js
document.querySelectorAll('main').length
```
Expected: `1` on every page.

- [ ] **Step 8: Commit**

```bash
git add src/layouts/Base.astro src/pages/about.astro src/pages/projects.astro src/pages/experience.astro src/pages/milky-way.astro
git commit -m "refactor(astro): eliminate nested main elements; add header landmark"
```

---

## Task 5: Hydration directive audit

**Files:**
- Modify: `src/pages/index.astro:111` (CareerList) and `src/pages/index.astro:123` (MilkyWay preview)

- [ ] **Step 1: Promote home-page below-fold islands to `client:visible`**

Edit `src/pages/index.astro`:
- Line 111: `<CareerList client:idle entries={careerEntries} />` → `<CareerList client:visible entries={careerEntries} />`
- Line 123: `<MilkyWay client:idle notes={allNotes} clusters={clusters} />` → `<MilkyWay client:visible notes={allNotes} clusters={clusters} />`

Leave `Orrery` and `ProjectsConst` on `client:idle` — they're close enough to the fold that pre-hydration is worth it.

- [ ] **Step 2: Verify other pages**

Run: `grep -rn 'client:' src/pages src/layouts`

Expected: directives are appropriate per spec §1.3:
- `Splash` — `client:load`
- `Cosmos`, `AccentOrb`, `Meteor` — `client:idle`
- `MilkyWayStreak` — `client:only="react"`
- `CareerList` (experience.astro), `ProjectsList` (projects.astro), `MilkyWay` (milky-way.astro) — these are above-fold on their own pages, so `client:idle` is correct.

No changes needed on the standalone pages.

- [ ] **Step 3: Build + smoke test**

Run: `npm run build`
Expected: clean. Visit `/` and watch the network tab — `CareerList`/`MilkyWay` hydration JS should not load until you scroll near them.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "refactor(astro): defer below-fold home islands to client:visible"
```

---

## Task 6: Dead-component prune

**Files:**
- Possibly delete: `src/components/island/NotePanel.tsx`
- Possibly delete: any `SkillsHR.tsx` if still present
- Modify: any straggler imports

- [ ] **Step 1: Find stragglers from already-deleted static components**

Run:
```bash
grep -rn 'ClusterChip\|ExperienceRow\|NoteCard\|ProjectCard\|SectionHead\|StatusPill\|Eyebrow' src/
```
Expected: zero hits. If any hits exist, they are imports referencing deleted files — fix by removing the import line.

Note: the `Eyebrow` string may match `.eyebrow` class names or `section-eyebrow` — only count component imports (lines like `import Eyebrow from`).

- [ ] **Step 2: Check for `SkillsHR` residue**

Run:
```bash
ls src/components/island/SkillsHR* 2>/dev/null
grep -rn 'SkillsHR' src/
```
Expected: file does not exist; no consumers. If the file exists with no consumers, delete it: `rm src/components/island/SkillsHR.tsx`.

- [ ] **Step 3: Check `NotePanel`**

Run: `grep -rn 'NotePanel' src/`
Expected: shows definition + any consumers. If the only hit is the definition file itself with no `import NotePanel`, delete:
```bash
rm src/components/island/NotePanel.tsx
```

If consumers exist, leave it.

- [ ] **Step 4: Build to confirm**

Run: `npm run build`
Expected: clean.

- [ ] **Step 5: Commit (only if changes were made)**

```bash
git add -u src/components/island/
git status --short
git commit -m "chore: remove unused island components"
```

If no changes, skip this commit.

---

## Task 7: Single source of truth for `data-accent`

**Files:**
- Modify: `src/styles/page-bg.css`
- Modify: `src/styles/pages.css`

Already in Task 4 we removed `data-accent` from the page wrappers. Now CSS selectors that key on `.page[data-accent]` or `.mw-page[data-accent]` need to be rewritten to scope from `html[data-accent]`.

- [ ] **Step 1: Find all `[data-accent]` selectors in the styles**

Run: `grep -rn '\[data-accent' src/styles/`

Expected list (the spec sections most likely to need rewrite):
- `src/styles/page-bg.css` — `.page[data-accent]`, `.page[data-accent]::before`, `.page[data-accent="sunset"]::before`, etc., `.page[data-accent] > *`, and the existing `html[data-accent="aurora"] .cosmos` rules (these already use html, leave them).

Save the full grep output for reference.

- [ ] **Step 2: Rewrite the `.page[data-accent]` selectors**

In `src/styles/page-bg.css`, replace each occurrence:
- `.page[data-accent] {` → `html[data-accent] .page {`
- `.page[data-accent]::before {` → `html[data-accent] .page::before {`
- `.page[data-accent]::after {` → `html[data-accent] .page::after {`
- `.page[data-accent="sunset"]::before` → `html[data-accent="sunset"] .page::before`
- `.page[data-accent="aurora"]::before` → `html[data-accent="aurora"] .page::before`
- `.page[data-accent="nebula"]::before` → `html[data-accent="nebula"] .page::before`
- `.page[data-accent="cosmic"]::before` → `html[data-accent="cosmic"] .page::before`
- `.page[data-accent] > *` → `html[data-accent] .page > *`

- [ ] **Step 3: Repeat for `.mw-page[data-accent]` if any**

Run: `grep -n 'mw-page\[data-accent\]' src/styles/`

For each, prepend `html[data-accent]` and drop the attribute. Most likely none exist (the mw-page never carried it), but verify.

- [ ] **Step 4: Build + visual diff**

Run: `npm run build && npm run dev &` then check `/about`, `/projects`, `/experience` in browser — accent washes should look identical to baseline.

Capture comparison shots:
```bash
sleep 6
npx playwright screenshot --full-page http://localhost:4321/about /tmp/audit-baseline/after-task7-about.png
npx playwright screenshot --full-page http://localhost:4321/projects /tmp/audit-baseline/after-task7-projects.png
npx playwright screenshot --full-page http://localhost:4321/experience /tmp/audit-baseline/after-task7-experience.png
kill %1 2>/dev/null || true
```
Eye-compare `after-task7-*.png` vs the baselines. They should be indistinguishable.

- [ ] **Step 5: Commit**

```bash
git add src/styles/page-bg.css src/styles/pages.css
git commit -m "refactor(css): scope accent selectors from html, drop redundant data-accent on .page"
```

---

## Task 8: Consolidate color and font tokens

**Files:**
- Modify: `src/styles/global.css` (`@theme` block, lines 10-33)
- Modify: `src/styles/tokens.css` (no value changes; just confirm the `--star`, etc. names are present)

- [ ] **Step 1: Confirm tokens.css already defines the needed vars**

Run: `grep -E '^\s*--(star|cyan|signal|sunset|purple|rose|fuchsia|night|font-sans|font-mono)' src/styles/tokens.css`

Expected: matches for each. They already exist (see `tokens.css:30-60` and `:96-101`).

- [ ] **Step 2: Replace `@theme` block in global.css**

Edit `src/styles/global.css` lines 10-33:

OLD:
```css
@theme {
  --color-signal: #6C0000;
  --color-signal-deep: #6B0204;
  --color-star: #FFC700;
  --color-star-bright: #FFEC43;
  --color-star-soft: #fef9c3;
  --color-cyan: #00DFD5;
  --color-cyan-bright: #22D3EE;
  --color-cyan-soft: #99F6E4;
  --color-ice: #BED5E9;
  --color-sunset: #F97316;
  --color-purple: #7E22CE;
  --color-purple-bright: #B02EED;
  --color-rose: #E11D48;
  --color-fuchsia: #D946EF;
  --color-night: #0f172a;
  --color-night-deep: #020617;
  --color-night-soft: #1e293b;

  --font-sans: "Space Grotesk Variable", ui-sans-serif, system-ui, -apple-system,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Space Mono", ui-monospace, SFMono-Regular, "SF Mono",
               Menlo, Consolas, monospace;
}
```

NEW:
```css
/* Tailwind @theme bridge — every color/font here references tokens.css.
   tokens.css is the single source of truth for the palette and type stack;
   this block exists only to expose those tokens as Tailwind color/font
   utilities (bg-star, text-cyan, font-sans, etc.). */
@theme {
  --color-signal: var(--signal);
  --color-signal-deep: var(--signal-deep);
  --color-star: var(--star);
  --color-star-bright: var(--star-bright);
  --color-star-soft: var(--star-soft);
  --color-cyan: var(--cyan);
  --color-cyan-bright: var(--cyan-bright);
  --color-cyan-soft: var(--cyan-soft);
  --color-ice: var(--ice);
  --color-sunset: var(--sunset);
  --color-purple: var(--purple);
  --color-purple-bright: var(--purple-bright);
  --color-rose: var(--rose);
  --color-fuchsia: var(--fuchsia);
  --color-night: var(--night);
  --color-night-deep: var(--night-deep);
  --color-night-soft: var(--night-soft);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

Tailwind v4 `@theme` blocks evaluate vars at parse time, so a `var(--star)` here resolves against `:root` from `tokens.css` (imported earlier in `global.css`).

- [ ] **Step 3: Build + smoke test**

Run: `npm run build`
Expected: clean. Inspect `dist/` output CSS — `bg-star` utility should still resolve to `#FFC700`.

Visit `/` in browser, eye-check any Tailwind-utility usage (the skip-link `focus:bg-star focus:text-night` is a good visible test — tab into the page to focus it).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "refactor(css): tokens.css is the single source of palette/type; @theme references it"
```

---

## Task 9: Split `portfolio.css` into themed files

**Files:**
- Create: `src/styles/portfolio/cosmos.css`
- Create: `src/styles/portfolio/splash.css`
- Create: `src/styles/portfolio/hero.css`
- Create: `src/styles/portfolio/sections.css`
- Create: `src/styles/portfolio/orrery.css`
- Create: `src/styles/portfolio/career.css`
- Create: `src/styles/portfolio/constellation.css`
- Create: `src/styles/portfolio/mw.css`
- Create: `src/styles/portfolio/meteor.css`
- Create: `src/styles/portfolio/topnav.css`
- Create: `src/styles/portfolio/footer.css`
- Create: `src/styles/portfolio/legacy-resets.css`
- Replace: `src/styles/portfolio.css` (becomes a barrel `@import`)

This is mechanical cut-and-paste. The goal is **zero behavioural change** — every byte ends up in exactly one of the new files.

- [ ] **Step 1: Make a working copy of the original file**

Run:
```bash
cp src/styles/portfolio.css /tmp/portfolio.css.backup
```
This is the rollback target if anything goes wrong.

- [ ] **Step 2: Create the directory**

Run: `mkdir -p src/styles/portfolio`

- [ ] **Step 3: Identify selector groups**

Read through `portfolio.css` and tag each selector group by its target file. Suggested mapping (verify against the actual file):

| Selector pattern | Target file |
|---|---|
| `.cosmos`, `.cosmos *`, `@property --neb-pulse`, `@property --wash-pulse`, `@keyframes nebulaDrift*`, `@keyframes nebulaPulse*`, `@keyframes washPulse` | `cosmos.css` |
| `.splash`, `.splash-*` | `splash.css` |
| `.hero`, `.hero-*`, `.cta-milky`, `.cta-star`, `.cta-arrow`, `.cta-label`, `.hero-motto`, `.hero-greeting`, `.hero-sub`, `.hero-ctas`, `.hero-content` | `hero.css` |
| `.section`, `.section-head`, `.section-title`, `.section-link`, `.eyebrow`, `.orbiting`, `.orbiting-chip`, `.orbiting .label`, `.orbiting .dot` | `sections.css` |
| `.orrery`, `.orrery-*`, anything orrery-scoped | `orrery.css` |
| `.career-*`, stellar class rules | `career.css` |
| `.constellation`, `.cons-*`, `#brightGlow`, `cons-pulse` keyframe | `constellation.css` |
| `.mw-shell`, `.mw-side`, `.v3-mw-*`, mw-sidebar specific | `mw.css` |
| `.meteor`, meteor trail | `meteor.css` |
| `.v3-topnav`, `.v3-nav-links`, `.v3-milky-pill`, `.v3-topnav-tools`, `.v3-meteor-counter`, `.v3-search-trigger` | `topnav.css` |
| `.v3-footer`, `.v3-footer *` | `footer.css` |
| `body .page-root > .starfield {display:none}` block + similar v2 suppression | `legacy-resets.css` |

- [ ] **Step 4: For each target file, cut the matching rules from `portfolio.css` and paste**

Work through one selector group at a time. For each new file, add a header comment at the top:

```css
/* ============================================================
   <Name> — <one-line purpose>
   Extracted from portfolio.css 2026-05-20.
   ============================================================ */
```

For `cosmos.css` specifically, prepend this load-bearing-contract comment:

```css
/* ============================================================
   Cosmos layer system — LOAD-BEARING CONTRACT
   ------------------------------------------------------------
   The cosmos uses three CSS custom properties to handle per-page
   accent tinting WITHOUT killing star brightness:

     --layer-hue       hue-rotate applied to colored nebula layers
     --layer-sat-mul   saturation multiplier for colored layers
     --layer-dim       opacity multiplier for colored layers ONLY
                       (NOT the wrap — wrap stays at opacity 1 so
                       the star canvas inside it stays bright)

   Sub-pages set these via `html[data-accent="..."] .cosmos` rules
   in page-bg.css. The star canvas is not a layer, so it bypasses
   --layer-dim. NEVER reintroduce `.cosmos { opacity: ... }` on
   sub-pages — stars vanish.

   Per-layer `filter` composes the three vars together. NEVER
   overwrite a layer's `filter` with a raw value — the per-page
   tint will stop working.

   The pulse value comes from `--neb-pulse` (a registered <number>
   so it interpolates smoothly). Each layer has its own
   drift+pulse keyframe pair at non-aligned periods so the cosmos
   never settles into a synchronized loop.
   ============================================================ */
```

For `page-bg.css` (not split — but the wash-opacity tuning is load-bearing): no change in this task; we'll touch it again in Task 11 if needed.

- [ ] **Step 5: Replace `portfolio.css` with the barrel**

After moving all content out, replace `src/styles/portfolio.css` with:

```css
/* ============================================================
   Portfolio styles — barrel re-export.
   The cosmic styling lives in src/styles/portfolio/*.css; this
   file imports them in load order. Don't add new rules here —
   put them in the right themed file or create a new one.
   ============================================================ */
@import "./portfolio/legacy-resets.css";
@import "./portfolio/cosmos.css";
@import "./portfolio/splash.css";
@import "./portfolio/topnav.css";
@import "./portfolio/hero.css";
@import "./portfolio/sections.css";
@import "./portfolio/orrery.css";
@import "./portfolio/career.css";
@import "./portfolio/constellation.css";
@import "./portfolio/mw.css";
@import "./portfolio/meteor.css";
@import "./portfolio/footer.css";
```

Order matters: `legacy-resets.css` first (suppresses old markup, must lose to later rules); `cosmos.css` before everything else that may reference its custom properties.

- [ ] **Step 6: Verify total line count is preserved**

Run:
```bash
wc -l src/styles/portfolio/*.css src/styles/portfolio.css
diff <(sort /tmp/portfolio.css.backup) <(cat src/styles/portfolio/*.css | sort)
```

Expected: the sorted-line diff should be near-empty except for the new comment headers in each split file. Any "real" content present in the backup but missing from the splits is a paste error — fix before continuing.

- [ ] **Step 7: Build + visual diff against baseline**

Run:
```bash
npm run build
npm run dev &
sleep 8
npx playwright screenshot --full-page http://localhost:4321/ /tmp/audit-baseline/after-task9-home.png
npx playwright screenshot --full-page http://localhost:4321/about /tmp/audit-baseline/after-task9-about.png
npx playwright screenshot --full-page http://localhost:4321/projects /tmp/audit-baseline/after-task9-projects.png
npx playwright screenshot --full-page http://localhost:4321/experience /tmp/audit-baseline/after-task9-experience.png
npx playwright screenshot --full-page http://localhost:4321/milky-way /tmp/audit-baseline/after-task9-milky-way.png
kill %1 2>/dev/null || true
```

Eye-compare with baselines (Task 0 captures). They should be indistinguishable.

- [ ] **Step 8: Commit**

```bash
git add src/styles/portfolio.css src/styles/portfolio/
git commit -m "refactor(css): split portfolio.css into themed files via barrel re-export"
```

---

## Task 10: Dead-rule sweep

**Files:**
- Modify: any `src/styles/portfolio/*.css` file with dead selectors

- [ ] **Step 1: Generate a list of all selectors used in CSS**

Run:
```bash
grep -rhE '^\s*\.[a-zA-Z][a-zA-Z0-9_-]*' src/styles/portfolio/ src/styles/pages.css src/styles/page-bg.css \
  | grep -oE '\.[a-zA-Z][a-zA-Z0-9_-]+' \
  | sort -u > /tmp/css-selectors.txt
wc -l /tmp/css-selectors.txt
```

This is a coarse list of class selectors. Will catch most cases.

- [ ] **Step 2: For each class selector, grep the source for usage**

Run:
```bash
> /tmp/dead-selectors.txt
while read -r sel; do
  name="${sel#.}"
  count=$(grep -rE "class[=:].*\\b${name}\\b" src/ --include='*.astro' --include='*.tsx' --include='*.ts' 2>/dev/null | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "$sel  (zero references)" >> /tmp/dead-selectors.txt
  fi
done < /tmp/css-selectors.txt
cat /tmp/dead-selectors.txt
```

This produces a list of class names referenced nowhere in markup. Review carefully — false positives include:
- Selectors built up dynamically in JS (`className={\`prefix-${variant}\`}` patterns) — grep for the literal prefix to confirm.
- Selectors used by content under `dist/` only (regenerated each build).
- Pseudo / state-only selectors (`:hover` chains attached to a class that IS used).

- [ ] **Step 3: Delete confirmed dead selectors**

For each entry in `/tmp/dead-selectors.txt` that you've verified is truly unused, remove the rule block from its file. Keep a running list in the commit message body.

If unsure about a selector, leave it — false positives cost more than they save.

- [ ] **Step 4: Build + visual diff**

Run `npm run build` and repeat the Playwright capture vs baseline from Task 9. Anything visually different = a selector wasn't actually dead. Restore it.

- [ ] **Step 5: Commit**

```bash
git add -u src/styles/
git commit -m "$(cat <<'EOF'
refactor(css): remove dead selectors

Removed selectors with zero references in markup:
- .selector-1
- .selector-2
[... list each]
EOF
)"
```

If no selectors were dead, skip this commit.

---

## Task 11: TypeScript — YAML module shim

**Files:**
- Create: `src/types/yaml.d.ts`

- [ ] **Step 1: Write the shim**

Create `src/types/yaml.d.ts`:

```ts
declare module '*.yaml' {
  const data: unknown;
  export default data;
}
```

Note: `unknown` over `any` so consumers must narrow. Most YAML imports are about to be replaced by typed content collections in Task 12; this shim just covers the standalone ones (`site.yaml`, `mottos.yaml`, `about.yaml`, `now.yaml`).

- [ ] **Step 2: Make sure tsconfig picks it up**

Read `tsconfig.json`. If it extends `astro/tsconfigs/strict` (or similar) the `include` should already grab `src/**/*.d.ts`. If not, add `"include": ["src/**/*.d.ts", "src/**/*"]`.

- [ ] **Step 3: Run check — expect some new errors from `unknown` narrowing**

Run: `npm run check 2>&1 | head -60`

Expected: any consumers of `siteData`, `mottosData`, etc. that did `siteData.name` or `(mottosData as any[]).find(...)` now fail. We'll fix them in the next steps within this task (since they're simple casts).

- [ ] **Step 4: Add narrow casts at the import sites**

For each standalone YAML consumer, cast at the point of import. Examples:

In `src/layouts/Base.astro` line 3, change:
```ts
import siteData from '@/content/site.yaml';
```
to:
```ts
import siteRaw from '@/content/site.yaml';
type SiteData = {
  name: string;
  title: string;
  description: string;
  socials: Record<string, string>;
};
const siteData = siteRaw as SiteData;
```

In `src/pages/index.astro`:
```ts
import mottosData from '@/content/mottos.yaml';
```
becomes:
```ts
import mottosRaw from '@/content/mottos.yaml';
type Motto = { id: string; text: string };
const mottosData = mottosRaw as Motto[];
```

Same pattern for `nowData` (now.yaml) — type derived from inspecting `src/content/now.yaml`.

Same for `about.yaml` in `src/pages/about.astro` — define a `type AboutData = { intro: string; what: string; values: { label: string; note: string }[]; factoids: { k: string; v: string }[] };` and cast.

Same for `clustersData` in `src/pages/index.astro`.

- [ ] **Step 5: Re-run check**

Run: `npm run check`
Expected: no errors from `*.yaml` imports.

- [ ] **Step 6: Commit**

```bash
git add src/types/yaml.d.ts src/layouts/Base.astro src/pages/index.astro src/pages/about.astro tsconfig.json
git commit -m "refactor(ts): shim *.yaml modules and narrow standalone YAML consumers"
```

---

## Task 12: TypeScript — Content collection schemas

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Read current `config.ts` to see what collections exist**

Run: `cat src/content/config.ts`

Note which collections are declared (likely `projects`, `experience`, `notes`, `clusters`). The structure of each YAML can be derived from `src/content/<collection>.yaml`.

- [ ] **Step 2: Read sample YAML data to derive schemas**

Run:
```bash
head -30 src/content/projects.yaml
head -30 src/content/experience.yaml
head -30 src/content/notes.yaml
head -30 src/content/clusters.yaml
```

Note the field names and types. Pay attention to optional/missing fields.

- [ ] **Step 3: Write proper schemas**

Edit `src/content/config.ts`. Example shape (adjust field names to match real data):

```ts
import { defineCollection, z } from 'astro:content';

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  cluster: z.string(),
  tagline: z.string().optional(),
  summary: z.string().optional(),
  role: z.string().optional(),
  impact: z.string().optional(),
  tech: z.array(z.string()).optional(),
  bullets: z.array(z.string()).optional(),
  source: z.string().url().optional(),
  // ... add every field you see in the YAML
});

const experienceSchema = z.object({
  id: z.string(),
  span: z.string(),
  role: z.string(),
  org: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).optional(),
  star: z.object({ type: z.string() }).optional(),
});

const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  cluster: z.string(),
  date: z.string(),
  links: z.number().optional(),
  arm: z.number().optional(),
  t: z.number().optional(),
  related: z.array(z.string()).optional(),
});

const clusterSchema = z.object({
  id: z.string(),
  label: z.string(),
  dotColor: z.string(),
});

export const collections = {
  projects: defineCollection({ type: 'data', schema: projectSchema }),
  experience: defineCollection({ type: 'data', schema: experienceSchema }),
  notes: defineCollection({ type: 'data', schema: noteSchema }),
  clusters: defineCollection({ type: 'data', schema: clusterSchema }),
};

export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Cluster = z.infer<typeof clusterSchema>;
```

If the existing `config.ts` already has these patterns, replace them carefully — don't add a second `collections` export.

- [ ] **Step 4: Run check — see what errors the schemas surface**

Run: `npm run check 2>&1 | tee /tmp/check-task12.log`

You may see schema mismatches (a real YAML field is missing from the schema, or the schema requires a field that's actually absent in some entries). For each error, decide: relax the schema (`.optional()`) or fix the data. The default answer is `.optional()` since data shape changes are out of scope.

- [ ] **Step 5: Iterate until check passes**

Repeat: read error → adjust schema → re-run `npm run check` → repeat. Stop when only "implicit any" remains from the next task's territory.

- [ ] **Step 6: Build to confirm collection types load**

Run: `npm run build`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add src/content/config.ts
git commit -m "refactor(ts): zod schemas for all content collections; export inferred types"
```

---

## Task 13: TypeScript — Kill `any` in islands and pages

**Files:**
- Modify: `src/components/island/Constellation.tsx`
- Modify: `src/components/island/MilkyWay.tsx`
- Modify: `src/components/island/ProjectsConst.tsx`
- Modify: `src/components/island/ProjectsList.tsx`
- Modify: `src/components/island/CareerList.tsx`
- Modify: `src/components/island/Orrery.tsx`
- Modify: `src/components/island/NotePanel.tsx` (if it survived Task 6)
- Modify: `src/pages/index.astro`
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/experience.astro`
- Modify: `src/pages/milky-way.astro`

- [ ] **Step 1: Find every `: any` in islands**

Run: `grep -rn ': any' src/components/island/ src/pages/`
Expected: many hits.

- [ ] **Step 2: Type island props from collection types**

For each island, import the relevant type from `astro:content` (or directly from `src/content/config.ts` if needed) and replace `any`.

Example for `src/components/island/MilkyWay.tsx` — change:
```tsx
interface Props {
  notes: any[];
  clusters: any[];
}
```
to:
```tsx
import type { Note, Cluster } from '@/content/config';
interface Props {
  notes: Note[];
  clusters: Cluster[];
}
```

Apply the analogous change to `Constellation.tsx` (notes + clusters), `ProjectsConst.tsx` (projects), `ProjectsList.tsx` (projects), `Orrery.tsx` (now data — typed inline since `now` is not a collection).

For `CareerList.tsx`, define a local `CareerEntry` type matching what the pages pass:
```tsx
export interface CareerEntry {
  id: string;
  span: string;
  role: string;
  org: string;
  summary: string;
  tags: string[];
  starType: string;
}
interface Props { entries: CareerEntry[] }
```

- [ ] **Step 3: Strip `(x: any) =>` in pages**

In `src/pages/index.astro`, `projects.astro`, `experience.astro`, `milky-way.astro`, every `.map((e: any) => ...)` / `.filter((c: any) => ...)` becomes the unannotated form. The collection types should now flow through automatically:

Example in `src/pages/index.astro`:
```ts
const exps = (await getCollection('experience')).map(e => e.data).slice(0, 3);
const careerEntries = exps.map((e: any) => ({  // <-- remove `: any`
```

If TS complains because the surrounding type isn't flowing, import the type explicitly:
```ts
import type { Experience } from '@/content/config';
const careerEntries = exps.map((e: Experience) => ({ ... }));
```

- [ ] **Step 4: Run check until clean**

Run: `npm run check`

Iterate. Expected end state: zero errors.

- [ ] **Step 5: Run tests + build**

Run: `npm test && npm run build`
Expected: both clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/island/ src/pages/
git commit -m "refactor(ts): type island props and page consumers from collection schemas"
```

---

## Task 14: Write `CLAUDE.md`

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write the file**

Create `CLAUDE.md` at the repo root:

```markdown
# CLAUDE.md

Operational guide for Claude sessions working on this repo. Read this before touching code.

## Stack

- **Astro 5** static site generator, `output: 'static'`, 5 pages.
- **React 18** islands for interactive components, hydrated via Astro `client:*` directives.
- **Tailwind v4** via `@tailwindcss/vite`. Color/font tokens live in `src/styles/tokens.css`; `@theme` in `global.css` is a thin bridge.
- **TypeScript 5.7**, strict via `astro/tsconfigs/strict`. Content collections typed with Zod schemas in `src/content/config.ts`.
- **Vitest** for unit tests.
- **Prettier** with `prettier-plugin-astro`. Run `npm run format`. CI gates on `npm run format:check`.

## Key paths

- `src/layouts/Base.astro` — single source of layout chrome (Cosmos, AccentOrb, Meteor, TopNav, Footer). Owns the `<html>` `data-accent` attribute.
- `src/pages/*.astro` — five route entries: `/`, `/about`, `/projects`, `/experience`, `/milky-way`.
- `src/components/island/*.tsx` — interactive React components. Always require a hydration directive in the page that uses them.
- `src/components/static/*.astro` — server-only components (TopNav, Footer).
- `src/styles/tokens.css` — palette + type + spacing tokens. **Source of truth.**
- `src/styles/portfolio/*.css` — themed CSS modules (cosmos, splash, hero, sections, orrery, career, constellation, mw, meteor, topnav, footer, legacy-resets). Re-exported via `src/styles/portfolio.css`.
- `src/styles/pages.css` — sub-page (`/about`, `/projects`, `/experience`) wrapper rules.
- `src/styles/page-bg.css` — per-route accent washes.
- `src/styles/global.css` — Tailwind import + `@theme` bridge + base resets.
- `src/content/config.ts` — Zod schemas + inferred types for content collections.
- `design-handoff/` — original prototype (gitignored).

## Hard rules — DO NOT VIOLATE

1. **One `<main>` per page.** `Base.astro` owns `<main id="main-content">`. Pages emit `<div class="page">`, never `<main class="page">`. Earlier versions had nested `<main>` — fix is permanent.

2. **`<html data-accent="...">` is the single source of truth for accent.** Set by `<Base accent="...">`. Selectors must key from `html[data-accent]`, not from the page wrapper. Do not put `data-accent` on the page wrapper.

3. **Cosmos var contract is load-bearing.** `cosmos.css` exposes three custom properties:
   - `--layer-hue` — `hue-rotate` for colored nebula layers.
   - `--layer-sat-mul` — saturation multiplier for colored layers.
   - `--layer-dim` — opacity multiplier for colored layers ONLY (not the wrap, so the star canvas inside stays bright).

   `page-bg.css` sets these per route via `html[data-accent="..."] .cosmos`. **Never reintroduce `.cosmos { opacity: ... }` on sub-pages — stars vanish.** Never overwrite a layer's `filter` with a raw value — the per-page tint stops working. Compose into the existing `filter` expression.

4. **Sub-page wash opacity is `0.55` by design.** The handoff says `0.85`, but the pulse + AccentOrb stack pushes effective peak too high and text reads "off in color". If a page feels under-accented, increase the orb gradient alphas in `AccentOrb.tsx`, not the wash opacity.

5. **`Meteor.tsx` double-rAF + forced reflow stays.** Under React+Vite the single-rAF pattern collapses the initial+target style flush and the animation never plays. Don't simplify.

6. **`MilkyWayStreak` is `client:only="react"`.** The component renders ~480 random dust circles; SSR/CSR mismatch otherwise.

7. **`ProjectsConst.tsx` `round4()` quantization is load-bearing.** Without it, server (Node) and client (V8) produce last-digit float drift and React warns.

8. **`prefers-reduced-motion` is handled globally** in `global.css`. Don't re-add per-component opt-outs.

9. **Home cosmos drifts continuously**, NOT per-section. Daniel explicitly rejected per-section accent changes on the home — if you want section differentiation, do it via content/spacing, not backdrop palette.

10. **Cosmos.tsx scroll-parallax uses individual `translate`/`scale`/`rotate` properties**, not `transform`. Don't merge them — keyframe `transform` would clobber the scroll value.

## Component → CSS file map

| Component | Styles in |
|---|---|
| `Cosmos.tsx` | `portfolio/cosmos.css` |
| `Splash.tsx` | `portfolio/splash.css` |
| `Meteor.tsx` | `portfolio/meteor.css` |
| `Orrery.tsx` | `portfolio/orrery.css` |
| `Constellation.tsx` | `portfolio/constellation.css` |
| `MilkyWay.tsx`, `MilkyWayStreak.tsx` | `portfolio/mw.css`, `page-bg.css` |
| `CareerList.tsx` | `portfolio/career.css` |
| `ProjectsConst.tsx`, `ProjectsList.tsx` | `pages.css` (project rows), inline SVG for the gravity grid |
| `AccentOrb.tsx` | `portfolio/cosmos.css` (selector: `.v3-accent-orb`) |
| `TopNav.astro` | `portfolio/topnav.css` |
| `Footer.astro` | `portfolio/footer.css` |
| Hero on `/` | `portfolio/hero.css` |
| `.section`, `.section-head` | `portfolio/sections.css` |
| `/about`, `/projects`, `/experience` page wrappers | `pages.css` |
| Per-route accent wash | `page-bg.css` |

## Content collections — how to add data

Collections defined in `src/content/config.ts`. Each is type `'data'` (YAML, not Markdown).

To add a new project: append an entry to `src/content/projects.yaml` matching `projectSchema`. To add a field: update the schema in `config.ts`, then add the field to existing entries (or mark `.optional()`).

Inferred types are exported: `import type { Project, Note, Experience, Cluster } from '@/content/config'`.

Standalone YAMLs (`site.yaml`, `mottos.yaml`, `about.yaml`, `now.yaml`) use the `*.yaml` shim in `src/types/yaml.d.ts` and require a local `as <Type>` cast at the import site.

## Workflows

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server on `:4321`. |
| `npm run build` | Static build to `dist/`. |
| `npm run preview` | Serve the built `dist/`. |
| `npm run check` | `astro check` — TypeScript + Astro diagnostics. **Must exit 0.** |
| `npm test` | Vitest single-run. |
| `npm run test:watch` | Vitest watch mode. |
| `npm run format` | Prettier write. |
| `npm run format:check` | Prettier check (CI gate). |

## CI

Two workflows in `.github/workflows/`:

- `1-feature-branch-ci.yml` — runs on PRs and non-`main` pushes. Gates: `format:check`, `astro check`, `vitest run`, `astro build`.
- `2-preprod-deploy.yml` — runs on push to `main`. Builds and deploys to GitHub Pages.

## Where the design handoff lives

`design-handoff/algebananazzzzz-2-0/project/` — original prototype HTML/CSS/JSX from Claude Design. **Gitignored.** Serve via local static server when doing visual-parity comparisons. Key files:
- `Portfolio v3.html` — the home page reference.
- `v3/*.jsx` — component sources.
- `assets/ds-tokens.css` — original tokens (already ported to `src/styles/tokens.css`).

For any new visual work, render both prototype and dev build side-by-side via Playwright. Visual parity is the success criterion, not Lighthouse scores.

## Anti-patterns observed in past sessions

- Claiming "polish complete" without page-by-page Playwright comparison.
- Adding `.cosmos { opacity: ... }` rules on sub-pages (kills stars).
- Reintroducing `<main class="page">` wrappers on pages (nested `<main>`).
- Mock-fixing TS errors with `as any` instead of fixing schemas.
- Putting new CSS rules into `portfolio.css` (the barrel) instead of the themed file.
- Restating the accent on the page wrapper (`<div class="page" data-accent="...">`) — it's already on `<html>`.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md operational guide"
```

---

## Task 15: Write `README.md`

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write the file**

Create `README.md` at the repo root:

```markdown
# algebananazzzzz — Constellation Explorer

A personal portfolio + digital garden built as an interactive cartoon cosmos. Five pages laid out like a star map: a splash hero, an orrery of what I'm doing now, a gravity-warped project board, a stellar trajectory of my work history, and a milky-way constellation of notes.

**Live:** https://algebananazzzzz.github.io

## Tech stack

- [Astro 5](https://astro.build) — static site generator
- [React 18](https://react.dev) — interactive islands
- [Tailwind v4](https://tailwindcss.com) — utility CSS
- [TypeScript 5.7](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev) — unit tests
- [Prettier](https://prettier.io) with `prettier-plugin-astro`
- [GitHub Pages](https://pages.github.com) — hosting, deployed via GitHub Actions

## Local development

```bash
# clone
git clone https://github.com/algebananazzzzz/algebananazzzzz2.0.git
cd algebananazzzzz2.0

# node version (uses .nvmrc)
nvm use

# install
npm install

# dev server on http://localhost:4321
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Astro dev server with HMR. |
| `npm run build` | Static build to `dist/`. |
| `npm run preview` | Serve the built `dist/`. |
| `npm run check` | TypeScript + Astro diagnostics. |
| `npm test` | Vitest single-run. |
| `npm run test:watch` | Vitest watch mode. |
| `npm run format` | Prettier write across all files. |
| `npm run format:check` | Prettier check (CI gate). |

## Project structure

```
src/
├── components/
│   ├── island/        React components, hydrated on the client
│   └── static/        Astro components, server-only (TopNav, Footer)
├── content/           YAML data + Zod schemas (projects, experience, notes, clusters)
├── layouts/           Base.astro — chrome layout
├── lib/               Pure utilities + tests (magnitude, stardate, routes)
├── pages/             Route entries
└── styles/
    ├── tokens.css     Color, type, spacing tokens (source of truth)
    ├── global.css     Tailwind + @theme bridge + resets
    ├── portfolio.css  Barrel re-export
    ├── portfolio/     Themed CSS modules (cosmos, splash, hero, ...)
    ├── pages.css      Sub-page wrappers
    └── page-bg.css    Per-route accent washes
```

## Deployment

Pushes to `main` build and deploy automatically via `.github/workflows/2-preprod-deploy.yml`.

Pull requests and non-`main` branches run CI via `.github/workflows/1-feature-branch-ci.yml` — format check, type check, tests, build.

## Credits

Design system + visual language hand-rolled with Claude Design assistance. Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (variable) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via `@fontsource`. Icons: inline SVG.

## License

Source code: MIT. Content (notes, copy, project descriptions) is not licensed for reuse.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add public README"
```

---

## Task 16: Final verification on `main`

**Files:**
- None — verification only.

- [ ] **Step 1: Full pipeline check**

Run:
```bash
npm run format:check
npm run check
npm test
npm run build
```
Expected: all four exit 0.

- [ ] **Step 2: Visual parity capture**

Run:
```bash
npm run dev &
sleep 8
npx playwright screenshot --full-page http://localhost:4321/ /tmp/audit-baseline/final-home.png
npx playwright screenshot --full-page http://localhost:4321/about /tmp/audit-baseline/final-about.png
npx playwright screenshot --full-page http://localhost:4321/projects /tmp/audit-baseline/final-projects.png
npx playwright screenshot --full-page http://localhost:4321/experience /tmp/audit-baseline/final-experience.png
npx playwright screenshot --full-page http://localhost:4321/milky-way /tmp/audit-baseline/final-milky-way.png
kill %1 2>/dev/null || true
```

Eye-compare each `final-*.png` with the corresponding baseline from Task 0. They should be indistinguishable.

If any difference is detected:
- Identify which task introduced it (binary search via `git log --oneline`).
- Revert that commit, redo the task with a tighter scope.

- [ ] **Step 3: Confirm DOM hygiene**

For each route, in the browser DevTools console:
```js
console.log({
  mains: document.querySelectorAll('main').length,
  headers: document.querySelectorAll('header').length,
  htmlAccent: document.documentElement.dataset.accent,
  pageAccent: document.querySelector('.page, .mw-page')?.dataset.accent,
});
```
Expected per page: `mains: 1`, `headers: 1`, `htmlAccent` is the route's accent, `pageAccent` is `undefined`.

---

## Task 17: Branch + rename existing deploy workflow

**Files:**
- Rename: `.github/workflows/deploy.yml` → `.github/workflows/2-preprod-deploy.yml`

- [ ] **Step 1: Create the feature branch**

Run:
```bash
git checkout -b feat/introduce-ci-pipelines
```

- [ ] **Step 2: Rename the workflow**

Run:
```bash
git mv .github/workflows/deploy.yml .github/workflows/2-preprod-deploy.yml
```

- [ ] **Step 3: Verify content unchanged**

Run: `cat .github/workflows/2-preprod-deploy.yml`
Expected: identical to the original `deploy.yml`.

- [ ] **Step 4: Commit**

```bash
git commit -m "ci: rename deploy workflow to 2-preprod-deploy"
```

---

## Task 18: Add feature-branch CI workflow

**Files:**
- Create: `.github/workflows/1-feature-branch-ci.yml`

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/1-feature-branch-ci.yml`:

```yaml
name: Feature branch CI

on:
  pull_request:
  push:
    branches-ignore: [main]

permissions:
  contents: read

concurrency:
  group: feature-ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - name: Prettier check
        run: npm run format:check
      - name: Astro check (typecheck)
        run: npm run check
      - name: Vitest
        run: npm test
      - name: Build
        run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/1-feature-branch-ci.yml
git commit -m "ci: add feature-branch CI workflow"
```

- [ ] **Step 3: Push the branch and open a PR**

```bash
git push -u origin feat/introduce-ci-pipelines
gh pr create --title "ci: introduce numbered CI pipelines" --body "$(cat <<'EOF'
## Summary
- Rename existing GitHub Pages deploy workflow to `2-preprod-deploy.yml`.
- Add `1-feature-branch-ci.yml` running format-check, type-check, tests, and build on PRs and non-main pushes.

## Test plan
- [ ] Confirm the workflow runs on this PR.
- [ ] Confirm `format:check`, `check`, `test`, and `build` all exit 0.
- [ ] Confirm `2-preprod-deploy.yml` does NOT trigger on this PR (it only triggers on push to main).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Return the PR URL to the user.

---

## Self-review checklist (run after writing this plan)

- [x] Spec coverage — every section of the spec has a task:
  - Spec §1 → Tasks 4, 5, 6, 7
  - Spec §2 → Tasks 8, 9, 10
  - Spec §3 → Tasks 11, 12, 13
  - Spec §4 → Tasks 14, 15
  - Spec §5 → Tasks 17, 18
  - Spec §6 → Task 16
- [x] No placeholders — all code blocks contain real code; commands are runnable.
- [x] Type consistency — `Project`, `Note`, `Experience`, `Cluster`, `CareerEntry` used consistently between Tasks 12 and 13.
- [x] Visual baseline strategy — Task 0 captures, Task 16 compares, intermediate checks at Task 7 and Task 9 catch regressions early.
- [x] Commit isolation — Prettier format pass (Task 3) is its own commit so semantic diffs after it are clean.

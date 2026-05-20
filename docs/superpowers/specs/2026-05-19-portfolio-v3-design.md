# Portfolio v3 — Constellation Explorer — Design Spec

**Date:** 2026-05-19
**Owner:** Daniel (daniel.zhouqx@gmail.com)
**Source:** Anthropic Design handoff `6VanBwrfT2jIJ2up8TSLjA`, primary file `Portfolio v3.html`
**Status:** Approved — proceed to implementation plan

---

## 1. Goal

Recreate the "Constellation Explorer" portfolio prototype as a production-quality static site that:

- Passes Lighthouse **100/100/100/100** on desktop (Perf / A11y / Best Practices / SEO)
- Holds **95+ Accessibility, 90+ Performance on mobile** (`(max-width: 720px)`)
- Is **fully static** — no SSR, no server runtime, no platform-specific functions
- Uses **TailwindCSS** as the design system layer
- Is **responsive** across phone / tablet / desktop
- Stays **faithful** to the prototype's visual identity (cosmic / astronomy / dark mode by default)
- Exposes **YAML-driven content** so the owner can edit copy/projects/notes without touching components

Out of scope for v1: a working digital garden (`Quartz` instance will be deployed separately later).

## 2. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Static site generator | **Astro 5** | Zero JS by default; Islands Architecture; demonstrably hits Lighthouse 100s (Astro's own docs do); first-class Tailwind + MDX; framework-agnostic islands |
| Styling | **Tailwind CSS v4** | `@theme` CSS-native config maps cleanly to existing design tokens; Tailwind v4 reads tokens from CSS directly |
| Interactive components | **React 18** islands via `@astrojs/react` | The prototype is React/JSX; reusing it minimizes translation work and risk |
| Content | **Astro Content Collections** with Zod schemas (YAML + a tiny amount of MDX if needed) | Type-safe content, build-time validation, hot reload |
| Hosting | **GitHub Pages** (Cloudflare Pages migration possible later) | Free, custom domain, build-on-push via GitHub Actions; pure static output is portable |

**Explicitly rejected:**
- Babel-in-browser (the prototype's runtime JSX compile) — pre-compile at build
- Google Fonts CDN — self-host variable woff2 instead
- ISR / Deferred Static Generation (Gatsby DSG, Next ISR) — they require a server, violating "fully static"
- Hugo — Go templating fights JSX-style component reuse
- Multiple font themes / Tweaks panel from prototype — designer iteration aids, not portfolio features. Ship Space Grotesk + Space Mono only

## 3. Architecture

### 3.1 Component categorization

Every prototype file maps into one of three buckets:

| Bucket | Hydration | Examples |
| --- | --- | --- |
| **Static** | No JS shipped | Hero text, project cards, experience rows, footer, eyebrows, section heads, factoid lists |
| **Island (deferred)** | `client:visible` or `client:idle` | Cosmos canvas, AccentOrb, Constellation, MilkyWay page, Orrery, ProjectsConst, CareerList animations, Meteor |
| **Island (eager)** | `client:load` | Splash (needed for LCP) |

### 3.2 Hydration discipline (the Lighthouse trick)

| Component | Directive | Reason |
| --- | --- | --- |
| `<V3Splash>` | `client:load` | Contains LCP element; scroll handler must register before user scrolls |
| `<V3Cosmos>` | `client:idle` | Background canvas — defer until browser idle |
| `<V3AccentOrb>` | `client:idle` | Decorative gradient orbs |
| `<V3Meteor>` | `client:idle` | Non-essential ambient |
| `<V3Constellation>` | `client:visible` | Below fold on home |
| `<V3MilkyWay>` | `client:visible` | Below fold on `/milky-way` |
| `<V3Orrery>` | `client:visible` | Below fold |
| `<V3ProjectsConst>` | `client:visible` | Below fold |
| `<V3CareerList>` | `client:visible` | Below fold |
| All `.astro` content | None | Pure HTML |

**Target: first paint < 50 KB of JS on every route.**

### 3.3 Mobile complexity gate

A `useReducedComplexity()` hook returns `true` if:
- `prefers-reduced-motion: reduce` is set, OR
- `window.matchMedia('(max-width: 720px)').matches` is true

Islands consult it to:
- Disable continuous canvas animations (cosmos drift, starfield twinkle, meteor trails)
- Skip `requestAnimationFrame` scroll-driven parallax
- Fall back to static CSS-gradient backgrounds in place of canvas

`prefers-reduced-motion` does NOT disable:
- Scroll-driven splash fade (static transform, not continuous)
- Interactive note panel slide-in (user-triggered)
- Cluster filtering / hover states

## 4. File structure

```
algebananazzzzz2.0/
├── astro.config.mjs              # Astro + Tailwind v4 + React + MDX integrations
├── package.json                  # (no tailwind.config — v4 reads tokens from CSS via @theme)
├── tsconfig.json
├── .github/workflows/deploy.yml  # build & deploy to gh-pages
├── README.md
│
├── public/
│   ├── assets/                   # banana.png, illustrations/, icons/ (copied from handoff)
│   └── fonts/                    # self-hosted Space Grotesk + Space Mono woff2
│
├── src/
│   ├── styles/
│   │   ├── tokens.css            # ds-tokens.css ported (CSS custom props)
│   │   ├── global.css            # Tailwind @import + @theme + base layer
│   │   └── v3.css                # animation keyframes + scoped styles Tailwind can't express
│   │
│   ├── content/                  # ← USER EDITS THESE
│   │   ├── config.ts             # Zod schemas, type-safe
│   │   ├── site.yaml             # title, description, location, socials, gardenUrl
│   │   ├── about.yaml            # intro, what, values, factoids
│   │   ├── projects.yaml         # array of project objects
│   │   ├── experience.yaml       # array of role objects with stellar metrics
│   │   ├── now.yaml              # orrery "right now" snapshot
│   │   ├── notes.yaml            # array of note metadata (no bodies in v1)
│   │   ├── clusters.yaml         # cluster id/label/color definitions
│   │   └── mottos.yaml           # rotating quote pool
│   │
│   ├── components/
│   │   ├── static/               # .astro — zero-JS server components
│   │   │   ├── Eyebrow.astro
│   │   │   ├── SectionHead.astro
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ExperienceRow.astro
│   │   │   ├── NoteCard.astro
│   │   │   ├── ClusterChip.astro
│   │   │   ├── StatusPill.astro
│   │   │   ├── TopNav.astro      # brand + nav links (static, no search)
│   │   │   ├── Footer.astro
│   │   │   └── SkipLink.astro
│   │   │
│   │   └── island/               # .tsx — React, hydrated selectively
│   │       ├── Splash.tsx        # Hello, I'm Daniel + warp + stardate
│   │       ├── Cosmos.tsx        # full-bleed twinkling starfield canvas
│   │       ├── AccentOrb.tsx     # per-section gradient cross-fade
│   │       ├── Meteor.tsx        # meteor of the day, catchable
│   │       ├── Constellation.tsx # SVG note graph (home preview)
│   │       ├── MilkyWay.tsx      # full /milky-way page (galaxy + sidebar)
│   │       ├── Orrery.tsx        # "right now" planetary widget
│   │       ├── ProjectsConst.tsx # projects laid out as constellation cards
│   │       ├── CareerList.tsx    # timeline with per-row gradient spine
│   │       └── NotePanel.tsx     # slide-in note metadata panel
│   │
│   ├── lib/
│   │   ├── stardate.ts           # TNG stardate computation (epoch 1946-01-01)
│   │   ├── magnitude.ts          # astronomical magnitude calc from links + recency
│   │   ├── routes.ts             # route → accent gradient map
│   │   └── useReducedComplexity.ts
│   │
│   ├── layouts/
│   │   └── Base.astro            # <html>, <head>, fonts, meta, skip link, nav slot
│   │
│   └── pages/
│       ├── index.astro           # home (splash + all preview sections)
│       ├── about.astro
│       ├── projects.astro
│       ├── experience.astro
│       └── milky-way.astro
```

## 5. Content model (YAML schemas)

All schemas validated by Zod in `src/content/config.ts`. Build fails on schema violations.

### site.yaml

```yaml
name: "algebananazzzzz"
title: "algebananazzzzz · portfolio v3 — constellation explorer"
description: "Daniel's portfolio + digital garden. Constellation explorer edition."
location: "Singapore · 1.3°N"
gardenUrl: ""                  # set when Quartz is deployed; empty hides the CTA
socials:
  github: "https://github.com/algebananazzzzz"
  gitlab: "https://gitlab.com/algebananazzzzz"
  linkedin: "https://linkedin.com/in/danielzhouqx"
  email: "daniel.zhouqx@gmail.com"
```

### about.yaml

```yaml
intro: "I'm Daniel — a Computer Sciences undergrad at NUS…"
what: "Right now I'm mostly interested in the seam between cloud platforms and language-model agents…"
values:
  - { label: "Build like nobody's watching", note: "Most of my best work runs on hardware in a closet…" }
factoids:
  - { k: "Based in", v: "Singapore" }
```

### projects.yaml

```yaml
- id: sheares-app
  title: "Sheares App v3"
  tagline: "A real-time community app for 500+ hall residents."
  tech: [aws, react, tailwindcss]   # → resolves to /assets/icons/*.svg at build
  summary: |
    A hall-wide noticeboard, room-booking, and event app …
  bullets:
    - "WebSocket fan-out via API Gateway + Lambda + DynamoDB streams."
  role: "Solo build · 2024 → ongoing"
  impact: "500+ daily actives · 14 blocks"
  cluster: cloud
  accent: cosmic                    # → maps to gradient token
  href: "https://github.com/algebananazzzzz"
```

### experience.yaml

```yaml
- span: "2025-06 — 2025-08"
  role: "Cloud Engineer Intern"
  org: "Stripe (Singapore)"
  summary: "On the internal platform team…"
  tags: [aws, terraform, kubernetes]
  star: { type: neutron, brightness: 2 }   # per-row stellar metric (replaces "cloud")
```

### now.yaml

```yaml
building:  { title: "Sheares App, v3", note: "…", status: "in flight", tag: cloud }
writing:   { title: "Evals before vibes", progress: 0.62, words: 1340, status: budding, tag: llm }
obsessed:  { title: "Belgian saisons", batch: 3, tag: brewery }
listening: { title: "Tigran Hamasyan — StandArt", tag: general }
learning:  { title: "Certified Kubernetes Administrator", progress: 0.4, tag: cloud }
reading:   { title: "How Buildings Learn", author: "Stewart Brand", progress: 0.34, tag: reading }
```

### notes.yaml

```yaml
- id: yeast
  title: "Field notes: yeast pitching rates for small batches"
  excerpt: "Three home-brews into a saison series. Textbook numbers lie at 5L."
  cluster: brewery
  status: evergreen           # seedling | budding | evergreen
  links: 7                    # backlink count for magnitude calc
  date: 2026-05-09
  readTime: "6 min"
  words: 1480
  arm: 0                      # spiral arm index: 0|1|2 (or -1 for core)
  t: 0.35                     # 0..1 position along arm
  backlinks: [saison, hopping, garden]
  related: [saison, metaprompt]
```

### clusters.yaml

```yaml
- { id: brewery, label: "craft brewery",        dotColor: "#F97316" }
- { id: llm,     label: "llm meta-prompting",   dotColor: "#22D3EE" }
- { id: cloud,   label: "cloud architecture",   dotColor: "#B02EED" }
- { id: reading, label: "reading & reflection", dotColor: "#FFC700" }
- { id: general, label: "field notes",          dotColor: "#9ca3af" }
```

### mottos.yaml

```yaml
- { text: "Patience is the second yeast.",   cluster: brewery, noteId: yeast }
- { text: "Wonder is a renewable resource.", cluster: general, noteId: garden }
```

## 6. Design system → Tailwind theme

The prototype's `ds-tokens.css` is the source of truth. We port it verbatim to `src/styles/tokens.css` and surface the tokens to Tailwind through `@theme`.

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "./tokens.css";

@theme {
  /* Brand palette → Tailwind utilities */
  --color-signal:       var(--signal);          /* #6C0000 wine-red outline */
  --color-star:         var(--star);            /* #FFC700 star yellow */
  --color-star-bright:  var(--star-bright);     /* #FFEC43 */
  --color-cyan:         var(--cyan);            /* #00DFD5 cosmic cyan */
  --color-ice:          var(--ice);
  --color-sunset:       var(--sunset);
  --color-purple:       var(--purple);
  --color-rose:         var(--rose);
  --color-fuchsia:      var(--fuchsia);
  --color-night:        var(--night);
  --color-night-deep:   var(--night-deep);
  --color-night-soft:   var(--night-soft);

  /* Type — self-hosted variable fonts */
  --font-sans: "Space Grotesk Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Space Mono", ui-monospace, "SF Mono", monospace;
}

/* Gradient utilities */
@utility bg-grad-sunset { background-image: var(--grad-sunset); }
@utility bg-grad-aurora { background-image: var(--grad-aurora); }
@utility bg-grad-cosmic { background-image: var(--grad-cosmic); }
@utility bg-grad-nebula { background-image: var(--grad-nebula); }
```

Dark mode is the **default** — the `<html>` element starts with `class="dark" data-theme="dark"` (matching the prototype). No light-mode toggle in v1.

The four signature gradients route to sections via `data-accent="cosmic|sunset|aurora|nebula"` attributes and resolve via CSS attribute selectors — no JS state needed for accent switching.

## 7. Performance & accessibility budget

| Lighthouse pillar | Target | How we get there |
| --- | --- | --- |
| Performance (desktop) | 100 | Static HTML, ~30KB JS first paint, deferred islands, preloaded LCP font, no third-party scripts |
| Performance (mobile) | 90+ | Canvas effects gated by `prefers-reduced-motion` and `(max-width: 720px)` — static gradient fallback |
| Accessibility | 100 | Skip-to-content link, full keyboard nav, visible focus rings (yellow `--star` ring, 2px), `aria-hidden` on decorative SVGs, `aria-label` on icon-only controls, AA contrast verified |
| Best Practices | 100 | HTTPS-only assets, no console errors, no deprecated APIs |
| SEO | 100 | Server-rendered HTML, per-page `<title>` + `<meta description>`, `og:` tags, `sitemap.xml`, JSON-LD `Person` |

### A11y measures we keep from the prototype

- Carried-over fixes from accessibility-audit chat (chat 6): `--fg-3` dark = slate-400, milky-way count badges near-white on slate pill
- `prefers-reduced-motion: reduce` disables continuous animations (twinkle, drift, meteor trails, splash warp, breathing pulse, route fades)
- All clickable surfaces are `<button>` or `<a>` (never `<div onClick>`)
- Focus ring: `outline: 2px solid var(--star); outline-offset: 2px`
- `aria-current="page"` on active nav link
- Color is never the only signal (cluster chips have label + dot, status pills have emoji + word)
- `<h1>` reserved for splash headline, never replaced with image text

### Performance safeguards

- Babel-in-browser eliminated (Astro pre-compiles JSX)
- Google Fonts replaced with self-hosted variable woff2 (≈28KB total)
- Cosmos starfield canvas swapped for static CSS gradient on mobile
- LCP element (splash `<h1>`) is server-rendered HTML, paints before any JS
- All images served via `<Image />` from `astro:assets` — auto-sized, lazy, modern formats
- Asset hashing for long cache TTLs

## 8. Responsive strategy

| Breakpoint | Behavior |
| --- | --- |
| `< 720px` (phone) | Nav: brand + Milky-Way pill only; hero stacks (mascot above text); grids → 1 column; cosmos canvas → static gradient; meteor disabled; tighter constellation viewBox |
| `720–1024px` (tablet) | 2-column grids; cosmos canvas at half density; full nav |
| `≥ 1024px` (desktop) | Full visual fidelity |

Implementation: Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) for layout + `useReducedComplexity()` hook for runtime gating of canvas animations.

## 9. Implementation phases

Each phase is independently buildable and Lighthouse-verifiable.

### Phase 1 — Skeleton (foundation)

Scope: project scaffolding, dependencies, design tokens, layout shell, deploy pipeline.

Deliverables:
- `astro.config.mjs` with React + Tailwind + MDX + sitemap integrations
- `package.json`, `tsconfig.json`
- `src/styles/tokens.css` ported from handoff
- `src/styles/global.css` with Tailwind `@theme`
- `src/layouts/Base.astro` (head, font preload, skip link, nav slot, footer slot)
- `src/content/config.ts` with all Zod schemas
- Seed `src/content/*.yaml` files copied from prototype data
- `public/assets/` copied from handoff
- `public/fonts/` self-hosted woff2 files
- `.github/workflows/deploy.yml` building & deploying to `gh-pages` branch

Acceptance: empty themed shell builds, deploys, scores 100/100/100/100 on desktop Lighthouse.

### Phase 2 — Static pages

Scope: all non-canvas content rendered as `.astro` server components.

Deliverables:
- `src/pages/index.astro` (skeleton sections only — placeholders where islands will go)
- `src/pages/about.astro`
- `src/pages/projects.astro`
- `src/pages/experience.astro`
- `src/pages/milky-way.astro` (skeleton)
- Static components: `Eyebrow`, `SectionHead`, `ProjectCard`, `ExperienceRow`, `NoteCard`, `ClusterChip`, `StatusPill`, `TopNav`, `Footer`, `SkipLink`

Acceptance: all routes render content; Lighthouse 100/100/100/100 desktop maintained.

### Phase 3 — Cosmic islands

Scope: the ambient + decorative layer + scroll-driven hero behavior.

Deliverables:
- `Cosmos.tsx` (full-bleed starfield canvas)
- `AccentOrb.tsx` (cross-fading gradient orbs)
- `Splash.tsx` (Hello + warp + stardate)
- `Meteor.tsx` (catchable meteor)
- `lib/stardate.ts`, `lib/useReducedComplexity.ts`

Acceptance: home route shows all cosmic effects; Lighthouse Perf ≥ 95 desktop, ≥ 90 mobile.

### Phase 4 — Milky Way + polish

Scope: the digital-garden showcase + interactive constellation + final a11y pass.

Deliverables:
- `Constellation.tsx` (home-preview SVG graph)
- `MilkyWay.tsx` (full `/milky-way` page — spiral galaxy, side panel)
- `Orrery.tsx`, `ProjectsConst.tsx`, `CareerList.tsx`
- `NotePanel.tsx`
- `lib/magnitude.ts`, `lib/routes.ts`
- Wikilink functionality deferred to Quartz phase
- Final Lighthouse audit + contrast verification

Acceptance: full design implemented; Lighthouse 100/100/100/100 desktop, 90+/95+/100/100 mobile.

## 10. Open items / future work

- **Quartz digital garden** — to be deployed separately. When ready, set `site.yaml:gardenUrl` and the Milky Way page's "full garden" CTA appears.
- **Search** — out of scope for v1 (per owner). No ⌘K overlay, no Pagefind. Quartz brings its own search later.
- **Light mode** — out of scope for v1; dark mode only.
- **i18n** — out of scope.
- **Analytics** — out of scope (no tracking scripts means easier 100 on Best Practices).

## 11. Decision log

| Decision | Reason |
| --- | --- |
| Astro over Next.js / Hugo / Eleventy | Best Lighthouse ceiling; Islands match the prototype's structure; first-class Tailwind + MDX |
| React over Preact for islands | Prototype is React; refs-on-children and `useLayoutEffect` patterns translate without rewriting |
| Drop Tweaks panel + 6 font themes | Designer iteration aid, not a portfolio feature; cuts ~150KB of fonts + ~30KB JS |
| Drop runtime Babel | Astro pre-compiles JSX at build |
| Self-host Space Grotesk + Space Mono variable woff2 | Faster + better privacy than Google Fonts |
| YAML-driven content with Zod validation | Owner-editable without component edits; build-time errors on typos |
| Quartz deferred to separate site | User preference — ship portfolio shell first, garden later |
| GitHub Pages for v1 (Cloudflare migration possible later) | Free, integrated with GitHub Actions, no platform lock-in since output is pure static |
| Dark mode only | Matches prototype; light mode adds work without clear user value here |

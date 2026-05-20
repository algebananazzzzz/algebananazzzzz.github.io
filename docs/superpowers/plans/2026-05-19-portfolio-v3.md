# Portfolio v3 — Constellation Explorer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the "Constellation Explorer" portfolio at `algebananazzzzz2.0/` as an Astro 5 + Tailwind v4 static site that hits Lighthouse 100/100/100/100 on desktop, 90+/95+/100/100 on mobile, with YAML-driven content and full visual fidelity to the prototype.

**Architecture:** Astro pages render static HTML shells. React islands are pulled in only where interactivity / canvas work demands them, with `client:idle` and `client:visible` directives keeping first-paint JS under 50KB. Design tokens live in `src/styles/tokens.css` and are surfaced to Tailwind via `@theme`. Content lives as YAML in `src/content/` with Zod schemas for build-time validation.

**Tech Stack:** Astro 5, Tailwind CSS v4, React 18, Astro Content Collections, `@fontsource-variable/space-grotesk` + `@fontsource/space-mono`, `vitest` for unit tests, GitHub Pages + GitHub Actions for deployment.

**Working directory:** `/Users/bytedance/algebananazzzzz2.0`
**Prototype reference:** `design-handoff/algebananazzzzz-2-0/project/` (use `Read`/`Grep` to consult during porting tasks)
**Spec reference:** `docs/superpowers/specs/2026-05-19-portfolio-v3-design.md`

---

## Phase 1 — Skeleton (foundation)

### Task 1.1: Initialize Astro project + dependencies

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.nvmrc`

- [ ] **Step 1: Confirm node version**

Run: `node --version`
Expected: `v20.x` or higher. If lower, install via `nvm install 20` and `nvm use 20`.

- [ ] **Step 2: Initialize git repo**

Run: `cd /Users/bytedance/algebananazzzzz2.0 && git init -b main`
Expected: `Initialized empty Git repository`.

- [ ] **Step 3: Write `.gitignore`**

```gitignore
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
```

- [ ] **Step 4: Write `.nvmrc`**

```
20
```

- [ ] **Step 5: Write `package.json`**

```json
{
  "name": "algebananazzzzz-portfolio",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview --host",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/mdx": "^4.0.3",
    "@astrojs/react": "^4.1.2",
    "@astrojs/sitemap": "^3.2.1",
    "@fontsource-variable/space-grotesk": "^5.1.0",
    "@fontsource/space-mono": "^5.1.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "astro": "^5.1.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2"
  },
  "devDependencies": {
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 6: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://algebananazzzzz.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react(), mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
```

- [ ] **Step 7: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@content/*": ["src/content/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src/**/*", "astro.config.mjs"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: completes with 0 vulnerabilities; `node_modules/` created.

- [ ] **Step 9: Commit**

```bash
git add .gitignore .nvmrc package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "chore: initialize Astro 5 + Tailwind v4 + React project"
```

---

### Task 1.2: Port design tokens

**Files:**
- Create: `src/styles/tokens.css`
- Reference: `design-handoff/algebananazzzzz-2-0/project/assets/ds-tokens.css`

- [ ] **Step 1: Copy ds-tokens.css contents**

Run: `cp design-handoff/algebananazzzzz-2-0/project/assets/ds-tokens.css src/styles/tokens.css`

- [ ] **Step 2: Verify the file is in place**

Run: `head -20 src/styles/tokens.css`
Expected: starts with `/* === ... Algebananazzzzz Design System ...`

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "chore: port design system tokens from handoff"
```

---

### Task 1.3: Configure Tailwind v4 + global styles

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/v3.css`

- [ ] **Step 1: Write `src/styles/global.css`**

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./v3.css";

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

@utility bg-grad-sunset { background-image: var(--grad-sunset); }
@utility bg-grad-aurora { background-image: var(--grad-aurora); }
@utility bg-grad-cosmic { background-image: var(--grad-cosmic); }
@utility bg-grad-nebula { background-image: var(--grad-nebula); }

@utility text-grad-sunset {
  background-image: var(--grad-sunset);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
@utility text-grad-aurora {
  background-image: var(--grad-aurora);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
@utility text-grad-cosmic {
  background-image: var(--grad-cosmic);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
@utility text-grad-nebula {
  background-image: var(--grad-nebula);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

html, body { background: var(--night); color: var(--fg-1); }
html { font-family: var(--font-sans); }

/* Focus ring — global, yellow star, AA-passing on night-sky bg */
:focus-visible {
  outline: 2px solid var(--star);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

/* Reduced motion — universal opt-out for our continuous canvas/animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Create empty `src/styles/v3.css` placeholder**

```css
/* v3.css — scoped cosmic/astro animations + component styles
   that aren't worth expressing as Tailwind utilities. Filled
   in Phase 3 (Cosmos, Splash) and Phase 4 (Constellation). */
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css src/styles/v3.css
git commit -m "feat: configure Tailwind v4 theme + DS token bindings"
```

---

### Task 1.4: Self-host variable fonts

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add font imports at top of `src/styles/global.css`**

Insert these as the first lines (above `@import "tailwindcss";`):

```css
@import "@fontsource-variable/space-grotesk";
@import "@fontsource/space-mono/400.css";
@import "@fontsource/space-mono/700.css";
```

- [ ] **Step 2: Verify fonts resolve**

Run: `ls node_modules/@fontsource-variable/space-grotesk/files/`
Expected: lists `space-grotesk-latin-wght-normal.woff2` and similar files.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: self-host Space Grotesk + Space Mono variable fonts"
```

---

### Task 1.5: Define content schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const ClusterId = z.enum(['brewery', 'llm', 'cloud', 'reading', 'general']);
const Accent = z.enum(['cosmic', 'sunset', 'aurora', 'nebula']);
const Status = z.enum(['seedling', 'budding', 'evergreen']);
const StarType = z.enum(['neutron', 'giant', 'subgiant', 'mainseq', 'protostar', 'whitedwarf']);

const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    tagline: z.string(),
    tech: z.array(z.string()),
    summary: z.string(),
    bullets: z.array(z.string()),
    role: z.string(),
    impact: z.string(),
    cluster: ClusterId,
    accent: Accent,
    href: z.string().url(),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    span: z.string(),
    role: z.string(),
    org: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    star: z.object({ type: StarType, brightness: z.number() }),
  }),
});

const notes = defineCollection({
  loader: file('src/content/notes.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    excerpt: z.string(),
    cluster: ClusterId,
    status: Status,
    links: z.number().int().nonnegative(),
    date: z.string(),
    readTime: z.string(),
    words: z.number().int().nonnegative(),
    arm: z.number().int(),
    t: z.number().min(0).max(1),
    backlinks: z.array(z.string()),
    related: z.array(z.string()),
  }),
});

const clusters = defineCollection({
  loader: file('src/content/clusters.yaml'),
  schema: z.object({ id: ClusterId, label: z.string(), dotColor: z.string() }),
});

const mottos = defineCollection({
  loader: file('src/content/mottos.yaml'),
  schema: z.object({ text: z.string(), cluster: ClusterId, noteId: z.string() }),
});

export const collections = { projects, experience, notes, clusters, mottos };
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define Zod schemas for projects/experience/notes/clusters/mottos"
```

---

### Task 1.6: Seed content YAML files

**Files:**
- Create: `src/content/site.yaml`
- Create: `src/content/about.yaml`
- Create: `src/content/now.yaml`
- Create: `src/content/projects.yaml`
- Create: `src/content/experience.yaml`
- Create: `src/content/notes.yaml`
- Create: `src/content/clusters.yaml`
- Create: `src/content/mottos.yaml`

- [ ] **Step 1: Read prototype data for reference**

Run: `Read design-handoff/algebananazzzzz-2-0/project/data.jsx` — already reviewed earlier; values transcribed below.

- [ ] **Step 2: Write `src/content/site.yaml`**

```yaml
name: "algebananazzzzz"
title: "algebananazzzzz · portfolio v3 — constellation explorer"
description: "Daniel's portfolio + digital garden. Constellation explorer edition."
location: "Singapore · 1.3°N"
gardenUrl: ""
socials:
  github: "https://github.com/algebananazzzzz"
  gitlab: "https://gitlab.com/algebananazzzzz"
  linkedin: "https://linkedin.com/in/danielzhouqx"
  email: "daniel.zhouqx@gmail.com"
```

- [ ] **Step 3: Write `src/content/about.yaml`**

```yaml
intro: "I'm Daniel — a Computer Sciences undergrad at NUS, a hall-tech-club president, and a serial side-projector. I build mostly on AWS, write mostly in TypeScript and Java, and I've been quietly running brew batches out of a closet since 2024."
what: "Right now I'm mostly interested in the seam between cloud platforms and language-model agents — what does developer infrastructure look like when half your users are LLMs? Adjacent obsessions: small-batch fermentation, fountain pens, and Tigran Hamasyan."
values:
  - label: "Build like nobody's watching"
    note: "Most of my best work runs on hardware in a closet for an audience of eight."
  - label: "Write to think"
    note: "Most of my arguments with myself only resolve in a markdown file."
  - label: "Leave the codebase warmer"
    note: "If a teammate is faster after my PR, the PR was good. If only the linter is happier, it wasn't."
factoids:
  - { k: "Based in", v: "Singapore" }
  - { k: "Currently at", v: "NUS Computer Sciences" }
  - { k: "Currently brewing", v: "Saison batch 03" }
  - { k: "Currently reading", v: "How Buildings Learn — S. Brand" }
  - { k: "Last cert", v: "AWS Solutions Architect Associate" }
  - { k: "Next cert", v: "CKA, July 2026" }
```

- [ ] **Step 4: Write `src/content/now.yaml`**

```yaml
building:
  title: "Sheares App, v3"
  note: "Rolling out the real-time noticeboard to all 14 blocks. ~500 daily actives across iOS, Android, web."
  since: "2024-11"
  status: "in flight"
  tag: cloud
writing:
  title: "Evals before vibes"
  note: "An assertion you can run beats a feeling you can argue. About halfway through the draft."
  progress: 0.62
  words: 1340
  status: budding
  tag: llm
obsessed:
  title: "Belgian saisons"
  note: "Pitching batch 3 this weekend — Wyeast 3711 at slightly cooler temps. Notes pending."
  batch: 3
  tag: brewery
listening:
  title: "Tigran Hamasyan — StandArt"
  note: "Stuck on track 2. Polyrhythms while debugging is somehow exactly right."
  tag: general
learning:
  title: "Certified Kubernetes Administrator"
  note: "Practice exams every other evening. Aim: cert by July."
  progress: 0.4
  tag: cloud
reading:
  title: "How Buildings Learn"
  author: "Stewart Brand"
  progress: 0.34
  tag: reading
```

- [ ] **Step 5: Write `src/content/projects.yaml`**

```yaml
- id: sheares-app
  title: "Sheares App v3"
  tagline: "A real-time community app for 500+ hall residents."
  tech: [aws, react, tailwindcss]
  summary: |
    A hall-wide noticeboard, room-booking, and event app I've maintained since freshman year. v3 swapped the old polling backend for a serverless WebSocket fan-out on AWS and cut p95 notification latency from 9s to 280ms.
  bullets:
    - "WebSocket fan-out via API Gateway + Lambda + DynamoDB streams."
    - "Replaced WhatsApp announcements; spam down ~70%, notice retention up ~3×."
    - "Deploys in one terraform apply; CI/CD via GitHub Actions + OIDC."
  role: "Solo build · 2024 → ongoing"
  impact: "500+ daily actives · 14 blocks"
  cluster: cloud
  accent: cosmic
  href: "https://github.com/algebananazzzzz"

- id: brewlog
  title: "Brewlog"
  tagline: "A home-brewing journal that nags me at the right times."
  tech: [react, docker]
  summary: |
    What started as a Notion replacement became a self-hosted brewing log with gravity readings, pitching-rate math, and tasting flights. 12 batches tracked across saisons, IPAs, stouts.
  bullets:
    - "Astro frontend, SQLite backend, runs on a Raspberry Pi in my closet."
    - "Custom pitching-rate calculator that finally agrees with my fermenter."
    - "Tasting flights with rotating peer reviewers (my hall-mates)."
  role: "Side project · 2025"
  impact: "12 batches · 0 infections"
  cluster: brewery
  accent: sunset
  href: "https://github.com/algebananazzzzz"

- id: prompt-atlas
  title: "Prompt-Atlas"
  tagline: "A library of meta-prompt skeletons, each with eval cases attached."
  tech: [react, terraform]
  summary: |
    An open-source catalogue of meta-prompt skeletons. Every template ships with eval cases — assertions you can actually run, not vibes you can argue with. 47 templates and counting.
  bullets:
    - "47 templates across planning, debate, summarisation, evaluation patterns."
    - "Each template carries 8–20 eval cases. Templates that regress get red-flagged in CI."
    - "Used by ~6 small teams I know of; PRs from 14 contributors."
  role: "Open source · 2025 → ongoing"
  impact: "47 templates · 14 contributors"
  cluster: llm
  accent: aurora
  href: "https://github.com/algebananazzzzz"

- id: constellate
  title: "Constellate"
  tagline: "This site. A digital garden that looks like the sky it lives under."
  tech: [react, gatsby]
  summary: |
    A custom Quartz-style digital garden built on Astro + MDX. Notes are stars; wiki-links are constellations; bigger stars mean more backlinks. Self-referential by design.
  bullets:
    - "Hand-rolled D3 force layout for the global graph view."
    - "Bidirectional [[wiki-links]] resolved at build time; backlinks generated automatically."
    - "Every page typeset in the same design system you're looking at."
  role: "Solo · 2026"
  impact: "47 notes · 113 links"
  cluster: general
  accent: nebula
  href: "https://github.com/algebananazzzzz"

- id: pourover
  title: "Pour-over Timer"
  tagline: "A tiny iOS app for pour-over coffee."
  tech: [react, docker]
  summary: |
    Multi-stage pour profiles with haptic-tap pacing. Built in a weekend after burning my fifth Ethiopian Yirgacheffe. Now lives quietly on my home-screen with ~40 friends using it.
  bullets:
    - "Profiles for 4-6, V60 02, Kalita Wave, with custom bloom/pour ratios."
    - "Haptic pacing so you don't need to stare at a phone mid-pour."
    - "Distributed via TestFlight; ~40 active testers."
  role: "Side project · 2025"
  impact: "40 active testers"
  cluster: general
  accent: sunset
  href: "https://github.com/algebananazzzzz"

- id: nocturnal
  title: "NocturnalProject"
  tagline: "The Gatsby + Tailwind portfolio template this site forks from."
  tech: [gatsby, tailwindcss]
  summary: |
    A free, opinionated portfolio template I open-sourced after building mine. 200+ forks; opinionated about content separation, theme tokens, and a wine-red illustration palette.
  bullets:
    - "YAML-driven content. Add a project by editing a file, not a component."
    - "Light / dark theme baked into the design tokens, not bolted on."
    - "200+ forks, 30+ stars; PRs from 6 contributors."
  role: "Open source · 2024"
  impact: "200+ forks"
  cluster: general
  accent: aurora
  href: "https://github.com/algebananazzzzz/NocturnalProject"
```

- [ ] **Step 6: Write `src/content/experience.yaml`**

```yaml
- span: "2025-06 — 2025-08"
  role: "Cloud Engineer Intern"
  org: "Stripe (Singapore)"
  summary: "On the internal platform team. Built a Terraform module library other product teams now pull from — halved time-to-deploy for one 14-service mesh. Wrote the IAM hardening guide that's now part of new-hire onboarding."
  tags: [aws, terraform, kubernetes]
  star: { type: neutron, brightness: 2 }

- span: "2024-06 — 2024-08"
  role: "Software Engineer Intern"
  org: "Grab"
  summary: "Shipped two production features on the merchant analytics surface end-to-end, and quietly rewrote the integration-test harness — went from 18 minutes to 4. Got the harness into the team's default CI template before I left."
  tags: [typescript, "next.js", postgres]
  star: { type: giant, brightness: 3 }

- span: "2024-01 — present"
  role: "Teaching Assistant · CS2030"
  org: "National University of Singapore"
  summary: "TA-ing Programming Methodology II — 60 students per semester. Wrote a side-pack of practice problems that's become unofficial-canon among the next cohorts of TAs."
  tags: [teaching, java, fp]
  star: { type: subgiant, brightness: 4 }

- span: "2023 — present"
  role: "Computer Sciences Undergrad"
  org: "National University of Singapore"
  summary: "Specialising in distributed systems and programming languages. GPA 4.6/5.0. President of the Sheares Hall tech club; we ship one thing every semester whether anyone asks for it or not."
  tags: [systems, PL, distributed]
  star: { type: mainseq, brightness: 5 }

- span: "2021 — 2023"
  role: "Cyber Specialist (NS)"
  org: "Singapore Armed Forces · Digital and Intelligence Service"
  summary: "Two years on a small Linux-and-Python team. Wrote the on-call runbook the unit still uses, learned more about packet captures than any 19-year-old needs to."
  tags: [linux, python, security]
  star: { type: protostar, brightness: 6 }
```

- [ ] **Step 7: Write `src/content/notes.yaml`**

```yaml
- id: yeast
  title: "Field notes: yeast pitching rates for small batches"
  excerpt: "Three home-brews into a saison series. Textbook numbers lie at 5L. Here's what worked."
  cluster: brewery
  status: evergreen
  links: 7
  date: "2026-05-09"
  readTime: "6 min"
  words: 1480
  arm: 0
  t: 0.35
  backlinks: [saison, hopping, garden]
  related: [saison, metaprompt]

- id: saison
  title: "Saison fermentation curve"
  excerpt: "Two weeks of fermentation logs and what the slope actually tells you."
  cluster: brewery
  status: budding
  links: 4
  date: "2026-04-22"
  readTime: "4 min"
  words: 950
  arm: 0
  t: 0.55
  backlinks: [yeast]
  related: [yeast]

- id: hopping
  title: "Late hopping vs whirlpool: a small-batch comparison"
  excerpt: "Two identical wort batches, two hop schedules, one weekend of taste tests."
  cluster: brewery
  status: seedling
  links: 3
  date: "2026-04-08"
  readTime: "3 min"
  words: 720
  arm: 0
  t: 0.75
  backlinks: [yeast]
  related: [yeast, saison]

- id: metaprompt
  title: "Meta-prompt skeletons that actually transfer"
  excerpt: "Four templates I keep reaching for — the planner, the debater, the historian, the proof-reader."
  cluster: llm
  status: evergreen
  links: 9
  date: "2026-05-14"
  readTime: "9 min"
  words: 2140
  arm: 1
  t: 0.30
  backlinks: [tool-design, ctx-window, eval, garden]
  related: [tool-design, eval]

- id: tool-design
  title: "Designing tools for agents (and yourself)"
  excerpt: "Tool surfaces are prompts in disguise. Naming, error messages, docstrings — all of it."
  cluster: llm
  status: budding
  links: 6
  date: "2026-05-01"
  readTime: "7 min"
  words: 1620
  arm: 1
  t: 0.50
  backlinks: [metaprompt, ctx-window]
  related: [metaprompt, iam]

- id: ctx-window
  title: "Working with small context budgets"
  excerpt: "When you have 8k tokens and want 80k. Compression strategies, summarisation policies."
  cluster: llm
  status: budding
  links: 4
  date: "2026-04-19"
  readTime: "5 min"
  words: 1140
  arm: 1
  t: 0.68
  backlinks: [metaprompt, tool-design]
  related: [metaprompt, eval]

- id: eval
  title: "Evals before vibes"
  excerpt: "An assertion you can run beats a feeling you can argue. Cheap evals you can ship today."
  cluster: llm
  status: seedling
  links: 2
  date: "2026-04-10"
  readTime: "4 min"
  words: 820
  arm: 1
  t: 0.84
  backlinks: [metaprompt, ctx-window]
  related: [metaprompt]

- id: iam
  title: "IAM patterns I keep forgetting"
  excerpt: "Trust policies, service-linked roles, and the one detail that bites you every six months."
  cluster: cloud
  status: budding
  links: 5
  date: "2026-03-28"
  readTime: "6 min"
  words: 1310
  arm: 2
  t: 0.32
  backlinks: [edge-cache, tool-design]
  related: [edge-cache]

- id: edge-cache
  title: "Edge cache invalidation: a story in three CDNs"
  excerpt: "Why CloudFront, Cloudflare, and Fastly disagree on what 'cached' means."
  cluster: cloud
  status: seedling
  links: 3
  date: "2026-03-12"
  readTime: "5 min"
  words: 1080
  arm: 2
  t: 0.55
  backlinks: [iam]
  related: [iam]

- id: reading-21
  title: "Reading: How Buildings Learn"
  excerpt: "Stewart Brand's notes on how things age well. Notes for a house that isn't a house."
  cluster: reading
  status: seedling
  links: 2
  date: "2026-04-30"
  readTime: "3 min"
  words: 640
  arm: 2
  t: 0.78
  backlinks: [garden]
  related: [garden]

- id: garden
  title: "Why I keep a garden, not a blog"
  excerpt: "A blog is for finished thoughts. A garden is for thoughts you'd be embarrassed to publish but can't stop tending."
  cluster: general
  status: evergreen
  links: 8
  date: "2026-05-02"
  readTime: "4 min"
  words: 980
  arm: -1
  t: 0.5
  backlinks: [yeast, metaprompt, reading-21]
  related: [metaprompt, reading-21]
```

- [ ] **Step 8: Write `src/content/clusters.yaml`**

```yaml
- { id: brewery, label: "craft brewery",        dotColor: "#F97316" }
- { id: llm,     label: "llm meta-prompting",   dotColor: "#22D3EE" }
- { id: cloud,   label: "cloud architecture",   dotColor: "#B02EED" }
- { id: reading, label: "reading & reflection", dotColor: "#FFC700" }
- { id: general, label: "field notes",          dotColor: "#9ca3af" }
```

- [ ] **Step 9: Write `src/content/mottos.yaml`**

```yaml
- { text: "Patience is the second yeast.",                     cluster: brewery, noteId: yeast }
- { text: "Every batch is a confession.",                      cluster: brewery, noteId: saison }
- { text: "Taste before you trust the gravity.",               cluster: brewery, noteId: hopping }
- { text: "Prompt like you mean it.",                          cluster: llm,     noteId: metaprompt }
- { text: "The map is not the model.",                         cluster: llm,     noteId: tool-design }
- { text: "Evals before vibes.",                               cluster: llm,     noteId: eval }
- { text: "If you can't deploy it twice, you don't own it.",   cluster: cloud,   noteId: iam }
- { text: "Cache is a promise you keep tomorrow.",             cluster: cloud,   noteId: edge-cache }
- { text: "Read like a magpie, link like a librarian.",        cluster: reading, noteId: reading-21 }
- { text: "I keep a garden, not a blog.",                      cluster: general, noteId: garden }
- { text: "Wonder is a renewable resource.",                   cluster: general, noteId: garden }
- { text: "Learning is always free.",                          cluster: general, noteId: garden }
```

- [ ] **Step 10: Commit**

```bash
git add src/content/
git commit -m "feat: seed YAML content (site, about, now, projects, experience, notes, clusters, mottos)"
```

---

### Task 1.7: Copy public assets

**Files:**
- Create: `public/assets/banana.png`
- Create: `public/assets/illustrations/*.svg`
- Create: `public/assets/icons/*.svg`

- [ ] **Step 1: Copy assets from handoff**

Run:
```bash
mkdir -p public/assets/illustrations public/assets/icons
cp design-handoff/algebananazzzzz-2-0/project/assets/banana.png public/assets/banana.png
cp design-handoff/algebananazzzzz-2-0/project/assets/illustrations/*.svg public/assets/illustrations/
cp design-handoff/algebananazzzzz-2-0/project/assets/icons/*.svg public/assets/icons/
```

- [ ] **Step 2: Verify**

Run: `ls public/assets/ public/assets/illustrations/ public/assets/icons/`
Expected: `banana.png`, 7 illustration SVGs, 11 icon SVGs.

- [ ] **Step 3: Commit**

```bash
git add public/assets/
git commit -m "chore: copy illustrations, icons, and banana favicon from handoff"
```

---

### Task 1.8: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
import '@/styles/global.css';
import siteData from '@/content/site.yaml';

export interface Props {
  title?: string;
  description?: string;
  accent?: 'cosmic' | 'sunset' | 'aurora' | 'nebula';
}

const { title, description, accent = 'cosmic' } = Astro.props;
const fullTitle = title ? `${title} · ${siteData.name}` : siteData.title;
const desc = description ?? siteData.description;
const ogUrl = new URL(Astro.url.pathname, Astro.site).toString();
---
<!DOCTYPE html>
<html lang="en" class="dark" data-theme="dark" data-accent={accent}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{fullTitle}</title>
  <meta name="description" content={desc} />
  <link rel="icon" href="/assets/banana.png" />
  <link rel="canonical" href={ogUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={desc} />
  <meta property="og:url" content={ogUrl} />
  <meta property="og:image" content="/assets/banana.png" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={desc} />

  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Daniel",
    "url": Astro.site?.toString(),
    "sameAs": Object.values(siteData.socials).filter((u: string) => u.startsWith('http')),
  })} />
</head>
<body class="bg-night text-gray-200 font-sans min-h-screen">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-star focus:px-3 focus:py-2 focus:text-night focus:font-medium">
    Skip to content
  </a>
  <slot name="topnav" />
  <slot name="background" />
  <main id="main-content" class="relative z-10">
    <slot />
  </main>
  <slot name="footer" />
</body>
</html>
```

- [ ] **Step 2: Add YAML import support to `astro.config.mjs`**

Edit `astro.config.mjs` — Astro 5 needs Vite to resolve `.yaml` imports. Add to the `vite` block:

```js
  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ['**/*.yaml'],
  },
```

Then install `@rollup/plugin-yaml`:

```bash
npm install --save-dev @rollup/plugin-yaml
```

And update `vite` block to use it:

```js
import yaml from '@rollup/plugin-yaml';
// ...
  vite: {
    plugins: [yaml(), tailwindcss()],
  },
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro astro.config.mjs package.json package-lock.json
git commit -m "feat: Base layout with skip-link, meta tags, JSON-LD"
```

---

### Task 1.9: Empty homepage + build verification

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write minimal `src/pages/index.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import siteData from '@/content/site.yaml';
---
<Base>
  <section class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center">
      <p class="font-mono text-sm tracking-widest text-gray-500 uppercase mb-4">
        scaffolding · v0
      </p>
      <h1 class="text-5xl md:text-6xl font-medium text-grad-cosmic">
        {siteData.name}
      </h1>
      <p class="mt-4 text-gray-400">phase 1 skeleton — content + tokens wired.</p>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Start dev server**

Run: `npm run dev &` then `sleep 3 && curl -s http://localhost:4321/ | head -50`
Expected: HTML returned, includes `<h1>` with `algebananazzzzz` and Space Grotesk font reference.

- [ ] **Step 3: Stop dev server, run production build**

Run: `kill %1; npm run build`
Expected: builds to `dist/` with no errors.

- [ ] **Step 4: Verify build output**

Run: `ls dist/ && cat dist/index.html | head -30`
Expected: `index.html` exists, contains expected meta tags + the heading.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: minimal home page — phase 1 skeleton verified"
```

---

### Task 1.10: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Pages deploy workflow"
```

**Phase 1 complete.** Run `npm run build && npx http-server dist -p 8000` and verify the placeholder page renders correctly in a browser. Lighthouse should report 100/100/100/100 desktop on this stub.

---

## Phase 2 — Static pages

### Task 2.1: TopNav.astro

**Files:**
- Create: `src/components/static/TopNav.astro`

- [ ] **Step 1: Read prototype `v3-topnav.jsx`**

Run: `Read design-handoff/algebananazzzzz-2-0/project/v3/v3-topnav.jsx` (~100 lines). Note: links to home / about / projects / experience / milky-way; milky-way is the highlighted "pill" CTA.

- [ ] **Step 2: Write `src/components/static/TopNav.astro`**

```astro
---
const { pathname } = Astro.url;
const isActive = (href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

const links = [
  { href: '/',           label: 'home' },
  { href: '/about',      label: 'about' },
  { href: '/projects',   label: 'projects' },
  { href: '/experience', label: 'experience' },
];
---
<nav aria-label="Primary" class="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-night/60 border-b border-slate-800/50">
  <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
    <a href="/" class="flex items-center gap-2 font-mono text-sm text-star hover:text-star-bright transition-colors">
      <img src="/assets/banana.png" alt="" width="22" height="22" class="rounded-sm" aria-hidden="true" />
      <span>algebananazzzzz</span>
    </a>
    <ul class="hidden md:flex items-center gap-1 ml-4">
      {links.map(({ href, label }) => (
        <li>
          <a
            href={href}
            aria-current={isActive(href) ? 'page' : undefined}
            class:list={[
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              isActive(href)
                ? 'text-star'
                : 'text-gray-400 hover:text-gray-200',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
    <div class="flex-1"></div>
    <a
      href="/milky-way"
      class="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-grad-cosmic text-white hover:scale-105 transition-transform"
      aria-current={isActive('/milky-way') ? 'page' : undefined}
    >
      <span class="w-1.5 h-1.5 rounded-full bg-star"></span>
      milky way
    </a>
  </div>
</nav>
```

- [ ] **Step 3: Slot TopNav into Base layout**

Edit `src/layouts/Base.astro` — replace `<slot name="topnav" />` with:

```astro
import TopNav from '@/components/static/TopNav.astro';
```

Move the import to the frontmatter, then in the body:

```astro
<TopNav />
```

(Remove the `<slot name="topnav" />` slot.)

- [ ] **Step 4: Test build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/static/TopNav.astro src/layouts/Base.astro
git commit -m "feat: TopNav with active state + milky-way pill CTA"
```

---

### Task 2.2: Footer.astro

**Files:**
- Create: `src/components/static/Footer.astro`

- [ ] **Step 1: Write `src/components/static/Footer.astro`**

```astro
---
import siteData from '@/content/site.yaml';
const { socials } = siteData;
const iconMap = {
  github: '/assets/icons/github-dark.svg',
  gitlab: '/assets/icons/gitlab-dark.svg',
  linkedin: '/assets/icons/linkedin-dark.svg',
  email: '/assets/icons/email-dark.svg',
};
---
<footer class="relative z-10 border-t border-slate-800/50 mt-24 px-6 py-12" data-accent="nebula">
  <div class="max-w-7xl mx-auto grid gap-8 md:grid-cols-3 items-start">
    <div>
      <p class="italic text-gray-300 text-lg">"Learning is always free."</p>
      <p class="mt-2 text-sm text-gray-500 font-mono">Daniel · Singapore · since 2021</p>
    </div>
    <div class="flex items-center justify-center gap-3">
      {Object.entries(socials).map(([key, url]) => (
        url && iconMap[key as keyof typeof iconMap] && (
          <a
            href={key === 'email' ? `mailto:${url}` : url}
            class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-slate-800/40 hover:bg-slate-700/60 transition-colors"
            aria-label={key}
            target={key === 'email' ? undefined : '_blank'}
            rel={key === 'email' ? undefined : 'noopener noreferrer'}
          >
            <img src={iconMap[key as keyof typeof iconMap]} alt="" width="18" height="18" aria-hidden="true" />
          </a>
        )
      ))}
    </div>
    <div class="text-right text-sm font-mono text-gray-500 space-y-1">
      <div>theme · constellation explorer</div>
      <div>source · {socials.github.replace('https://', '')}</div>
      <div class="text-gray-400 mt-2">built with bananas <span aria-hidden="true">🍌</span></div>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Slot into Base.astro**

Edit `src/layouts/Base.astro`: add `import Footer from '@/components/static/Footer.astro';` to frontmatter, replace `<slot name="footer" />` with `<Footer />` (or render conditionally with a `hideFooter` prop if a future page wants it).

- [ ] **Step 3: Commit**

```bash
git add src/components/static/Footer.astro src/layouts/Base.astro
git commit -m "feat: Footer with quote, socials, branding"
```

---

### Task 2.3: Eyebrow + SectionHead

**Files:**
- Create: `src/components/static/Eyebrow.astro`
- Create: `src/components/static/SectionHead.astro`

- [ ] **Step 1: Write `Eyebrow.astro`**

```astro
---
export interface Props { children?: string; }
---
<div class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-2">
  <slot />
</div>
```

- [ ] **Step 2: Write `SectionHead.astro`**

```astro
---
export interface Props {
  eyebrow: string;
  title: string;
  emTitle?: string;
  linkHref?: string;
  linkLabel?: string;
}
const { eyebrow, title, emTitle, linkHref, linkLabel } = Astro.props;
---
<header class="flex items-end justify-between gap-6 mb-6 md:mb-8">
  <div>
    <div class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-2">{eyebrow}</div>
    <h2 class="text-3xl md:text-4xl font-medium text-gray-200 leading-tight">
      {title}{emTitle && <> <em class="not-italic text-grad-cosmic inline-block pe-[0.06em]">{emTitle}</em></>}.
    </h2>
  </div>
  {linkHref && linkLabel && (
    <a href={linkHref} class="text-sm font-medium text-star hover:text-star-bright shrink-0">
      {linkLabel} →
    </a>
  )}
</header>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/static/Eyebrow.astro src/components/static/SectionHead.astro
git commit -m "feat: Eyebrow + SectionHead static components"
```

---

### Task 2.4: ClusterChip + StatusPill

**Files:**
- Create: `src/components/static/ClusterChip.astro`
- Create: `src/components/static/StatusPill.astro`

- [ ] **Step 1: Write `ClusterChip.astro`**

```astro
---
import { getCollection } from 'astro:content';
const clusters = await getCollection('clusters');
const byId = Object.fromEntries(clusters.map(c => [c.data.id, c.data]));

export interface Props { cluster: string; }
const { cluster } = Astro.props;
const c = byId[cluster] ?? { label: cluster, dotColor: '#9ca3af' };
---
<span class="inline-flex items-center gap-1.5 font-mono text-xs text-gray-400">
  <span class="w-1.5 h-1.5 rounded-full" style={`background:${c.dotColor}`} aria-hidden="true"></span>
  {c.label}
</span>
```

- [ ] **Step 2: Write `StatusPill.astro`**

```astro
---
export interface Props { status: 'seedling' | 'budding' | 'evergreen'; }
const { status } = Astro.props;
const emoji = { seedling: '🌱', budding: '🌿', evergreen: '🌳' }[status];
const tone = {
  seedling: 'border-green-400/40 text-green-300',
  budding: 'border-emerald-400/40 text-emerald-300',
  evergreen: 'border-teal-400/40 text-teal-300',
}[status];
---
<span class:list={['inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono', tone]}>
  <span aria-hidden="true">{emoji}</span>
  {status}
</span>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/static/ClusterChip.astro src/components/static/StatusPill.astro
git commit -m "feat: ClusterChip + StatusPill components"
```

---

### Task 2.5: ProjectCard.astro

**Files:**
- Create: `src/components/static/ProjectCard.astro`

- [ ] **Step 1: Write `ProjectCard.astro`**

```astro
---
import ClusterChip from './ClusterChip.astro';

export interface Props {
  project: {
    id: string;
    title: string;
    tagline: string;
    tech: string[];
    summary: string;
    bullets: string[];
    role: string;
    impact: string;
    cluster: string;
    accent: 'cosmic' | 'sunset' | 'aurora' | 'nebula';
    href: string;
  };
}
const { project } = Astro.props;
const accentClass = {
  cosmic: 'before:bg-grad-cosmic',
  sunset: 'before:bg-grad-sunset',
  aurora: 'before:bg-grad-aurora',
  nebula: 'before:bg-grad-nebula',
}[project.accent];

const techIcon = (t: string) => `/assets/icons/${t}.svg`;
---
<article
  class:list={[
    'relative overflow-hidden rounded-lg border border-slate-800/70 bg-slate-900/40 p-6 transition-colors hover:bg-slate-900/60',
    'before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:opacity-60',
    accentClass,
  ]}
  data-accent={project.accent}
>
  <div class="flex items-start justify-between gap-4 mb-3">
    <div>
      <h3 class="text-lg font-medium text-gray-100">{project.title}</h3>
      <p class="text-sm text-gray-400 mt-1">{project.tagline}</p>
    </div>
    <ClusterChip cluster={project.cluster} />
  </div>

  <p class="text-sm leading-relaxed text-gray-300/90 mb-4">{project.summary}</p>

  <ul class="space-y-1.5 text-sm text-gray-400 mb-4">
    {project.bullets.map(b => (
      <li class="flex gap-2">
        <span aria-hidden="true" class="text-star mt-1">·</span>
        <span>{b}</span>
      </li>
    ))}
  </ul>

  <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/50">
    <div class="flex items-center gap-2">
      {project.tech.map(t => (
        <img src={techIcon(t)} alt={t} title={t} width="18" height="18" loading="lazy" />
      ))}
    </div>
    <div class="text-xs font-mono text-gray-500">{project.role}</div>
  </div>

  <a
    href={project.href}
    target="_blank"
    rel="noopener noreferrer"
    class="absolute inset-0"
    aria-label={`Open ${project.title} on GitHub`}
  ></a>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/static/ProjectCard.astro
git commit -m "feat: ProjectCard with accent-bar, tech icons, impact line"
```

---

### Task 2.6: ExperienceRow.astro

**Files:**
- Create: `src/components/static/ExperienceRow.astro`

- [ ] **Step 1: Write `ExperienceRow.astro`**

```astro
---
export interface Props {
  exp: {
    span: string;
    role: string;
    org: string;
    summary: string;
    tags: string[];
    star: { type: string; brightness: number };
  };
  starColor: string;
  isLast?: boolean;
}
const { exp, starColor, isLast } = Astro.props;
const starSize = Math.max(6, 14 - exp.star.brightness * 1.4);
const haloOpacity = Math.max(0.15, 0.7 - exp.star.brightness * 0.1);
---
<li class="relative pl-10 pb-10" data-star-type={exp.star.type} data-star-brightness={exp.star.brightness}>
  <!-- spine -->
  {!isLast && (
    <span
      aria-hidden="true"
      class="absolute left-[15px] top-[28px] bottom-[-28px] w-px"
      style={`background: linear-gradient(to bottom, ${starColor}, transparent)`}
    ></span>
  )}
  <!-- star -->
  <span
    aria-hidden="true"
    class="absolute left-2 top-2 rounded-full"
    style={`width:${starSize}px;height:${starSize}px;background:${starColor};box-shadow:0 0 ${starSize * 2}px ${starColor}${Math.round(haloOpacity * 255).toString(16).padStart(2, '0')}`}
  ></span>

  <header class="flex flex-wrap items-baseline justify-between gap-2 mb-1">
    <div>
      <h3 class="text-base md:text-lg font-medium text-gray-100">{exp.role}</h3>
      <div class="text-sm text-gray-400">{exp.org}</div>
    </div>
    <div class="font-mono text-xs text-gray-500 uppercase tracking-wider">{exp.span}</div>
  </header>

  <p class="text-sm text-gray-300/90 leading-relaxed mb-2">{exp.summary}</p>

  <div class="flex items-center justify-between gap-3">
    <ul class="flex flex-wrap gap-1.5">
      {exp.tags.map(t => (
        <li class="px-2 py-0.5 rounded-full bg-slate-800/40 border border-slate-700/60 text-xs font-mono text-gray-400">{t}</li>
      ))}
    </ul>
    <div class="font-mono text-[10px] text-gray-500 uppercase">
      mag {exp.star.brightness.toFixed(1)} · {exp.star.type}
    </div>
  </div>
</li>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/static/ExperienceRow.astro
git commit -m "feat: ExperienceRow with stellar-class spine + brightness"
```

---

### Task 2.7: NoteCard.astro

**Files:**
- Create: `src/components/static/NoteCard.astro`

- [ ] **Step 1: Write `NoteCard.astro`**

```astro
---
import ClusterChip from './ClusterChip.astro';
import StatusPill from './StatusPill.astro';

export interface Props {
  note: {
    id: string;
    title: string;
    excerpt: string;
    cluster: string;
    status: 'seedling' | 'budding' | 'evergreen';
    links: number;
    date: string;
    readTime: string;
    words: number;
  };
}
const { note } = Astro.props;
// Astronomical magnitude (lower = brighter). Computed from links + recency.
// See lib/magnitude.ts in Phase 4 — duplicated here to avoid runtime import.
const magnitude = (Math.max(0, 6 - note.links * 0.5)).toFixed(1);
---
<article class="rounded-lg border border-slate-800/70 bg-slate-900/30 p-5 hover:bg-slate-900/50 transition-colors">
  <div class="flex items-start justify-between gap-3 mb-2">
    <ClusterChip cluster={note.cluster} />
    <span class="font-mono text-[10px] text-gray-500 uppercase">M {magnitude}</span>
  </div>
  <h3 class="text-base font-medium text-gray-100 mb-1.5">{note.title}</h3>
  <p class="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">{note.excerpt}</p>
  <footer class="flex items-center justify-between text-xs">
    <StatusPill status={note.status} />
    <span class="font-mono text-gray-500">{note.date} · {note.readTime}</span>
  </footer>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/static/NoteCard.astro
git commit -m "feat: NoteCard with cluster, magnitude badge, status pill"
```

---

### Task 2.8: About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Write `about.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import about from '@/content/about.yaml';
---
<Base title="about" description="who Daniel is and how he works.">
  <section class="max-w-3xl mx-auto px-6 pt-32 pb-16">
    <p class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-3">about</p>
    <h1 class="text-4xl md:text-5xl font-medium mb-8">
      <span class="text-grad-aurora inline-block pe-[0.06em]">Daniel</span>, in long form.
    </h1>

    <div class="prose prose-invert max-w-none space-y-6">
      <p class="text-lg leading-relaxed text-gray-200">{about.intro}</p>
      <p class="text-base leading-relaxed text-gray-300">{about.what}</p>
    </div>

    <h2 class="mt-12 text-xl font-medium text-gray-200 mb-4">How I work</h2>
    <ul class="space-y-4">
      {about.values.map(v => (
        <li class="pl-4 border-l-2 border-star/40">
          <div class="font-medium text-gray-100">{v.label}</div>
          <div class="text-sm text-gray-400 leading-relaxed mt-0.5">{v.note}</div>
        </li>
      ))}
    </ul>

    <h2 class="mt-12 text-xl font-medium text-gray-200 mb-4">Vitals</h2>
    <dl class="grid sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-sm">
      {about.factoids.map(f => (
        <div class="flex justify-between gap-4 border-b border-slate-800/60 pb-2">
          <dt class="text-gray-500 uppercase tracking-wider text-xs">{f.k}</dt>
          <dd class="text-gray-300">{f.v}</dd>
        </div>
      ))}
    </dl>
  </section>
</Base>
```

- [ ] **Step 2: Build + verify**

Run: `npm run build` — expected: builds; `dist/about/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: /about page with intro, values, vitals dl"
```

---

### Task 2.9: Projects page

**Files:**
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Write `projects.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import ProjectCard from '@/components/static/ProjectCard.astro';
import { getCollection } from 'astro:content';

const projects = (await getCollection('projects')).map(p => p.data);
---
<Base title="projects" description="things on the workbench." accent="sunset">
  <section class="max-w-7xl mx-auto px-6 pt-32 pb-16">
    <p class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-3">things on the workbench</p>
    <h1 class="text-4xl md:text-5xl font-medium mb-10">
      Recent <span class="text-grad-sunset inline-block pe-[0.06em]">builds</span>.
    </h1>
    <div class="grid gap-6 md:grid-cols-2">
      {projects.map(p => <ProjectCard project={p} />)}
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat: /projects page grid"
```

---

### Task 2.10: Experience page

**Files:**
- Create: `src/pages/experience.astro`

- [ ] **Step 1: Write `experience.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import ExperienceRow from '@/components/static/ExperienceRow.astro';
import { getCollection } from 'astro:content';

const exps = (await getCollection('experience')).map(e => e.data);
const starColors: Record<string, string> = {
  neutron: '#A5B4FC',
  giant: '#F87171',
  subgiant: '#FBCFE8',
  mainseq: '#FDE047',
  protostar: '#67E8F9',
  whitedwarf: '#E0E7FF',
};
---
<Base title="experience" description="trajectory through cloud, agents, and teaching." accent="nebula">
  <section class="max-w-3xl mx-auto px-6 pt-32 pb-16">
    <p class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-3">where I've been</p>
    <h1 class="text-4xl md:text-5xl font-medium mb-10">
      <span class="text-grad-nebula inline-block pe-[0.06em]">Trajectory</span>.
    </h1>
    <ol class="list-none">
      {exps.map((e, i) => (
        <ExperienceRow exp={e} starColor={starColors[e.star.type] ?? '#FFC700'} isLast={i === exps.length - 1} />
      ))}
    </ol>
  </section>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/experience.astro
git commit -m "feat: /experience page timeline with stellar spine"
```

---

### Task 2.11: Milky-way page skeleton

**Files:**
- Create: `src/pages/milky-way.astro`

- [ ] **Step 1: Write skeleton (final island wired in Phase 4)**

```astro
---
import Base from '@/layouts/Base.astro';
import siteData from '@/content/site.yaml';
---
<Base title="milky way" description="Daniel's digital garden — a constellation of notes." accent="cosmic">
  <section class="max-w-7xl mx-auto px-6 pt-32 pb-16">
    <p class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-3">digital garden · the milky way</p>
    <h1 class="text-4xl md:text-5xl font-medium mb-4">
      The <span class="text-grad-cosmic inline-block pe-[0.06em]">milky way</span>.
    </h1>
    <p class="text-gray-400 max-w-2xl">A constellation of notes I'm tending. Bigger stars are more linked; clusters are colored by topic.</p>

    {siteData.gardenUrl && (
      <a href={siteData.gardenUrl} class="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-grad-cosmic text-white text-sm font-medium">
        full digital garden →
      </a>
    )}

    <div id="milky-way-mount" class="mt-12 min-h-[600px] rounded-xl border border-slate-800/60 bg-slate-900/30 grid place-items-center">
      <p class="text-gray-500 font-mono text-sm">constellation loads here (Phase 4)</p>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/milky-way.astro
git commit -m "feat: /milky-way page skeleton (constellation mount placeholder)"
```

---

### Task 2.12: Home page sections (static parts)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import SectionHead from '@/components/static/SectionHead.astro';
import ProjectCard from '@/components/static/ProjectCard.astro';
import ExperienceRow from '@/components/static/ExperienceRow.astro';
import NoteCard from '@/components/static/NoteCard.astro';
import ClusterChip from '@/components/static/ClusterChip.astro';
import { getCollection } from 'astro:content';
import nowData from '@/content/now.yaml';

const projects = (await getCollection('projects')).map(p => p.data).slice(0, 3);
const exps = (await getCollection('experience')).map(e => e.data).slice(0, 3);
const notes = (await getCollection('notes')).map(n => n.data)
  .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

const starColors: Record<string, string> = {
  neutron: '#A5B4FC', giant: '#F87171', subgiant: '#FBCFE8',
  mainseq: '#FDE047', protostar: '#67E8F9', whitedwarf: '#E0E7FF',
};
---
<Base>
  <!-- Splash placeholder — full island lands in Phase 3 -->
  <section
    id="splash-mount"
    class="relative min-h-screen flex items-center justify-center px-6"
    data-accent="cosmic"
  >
    <div class="text-center max-w-3xl">
      <p class="font-mono text-xs tracking-[0.32em] uppercase text-gray-500 mb-3">
        singapore · 1.3°n · stardate <span id="stardate" data-stardate>computing…</span>
      </p>
      <h1 class="text-5xl md:text-7xl font-medium tracking-tight">
        Hello, I'm <em class="not-italic text-grad-cosmic inline-block pe-[0.06em]">Daniel</em>
      </h1>
      <p class="mt-4 font-mono text-sm text-gray-400 tracking-[0.14em]">
        NUS Computer Sciences · builder · brewer · stargazer
      </p>
    </div>
  </section>

  <!-- Hero proper -->
  <section class="relative max-w-4xl mx-auto px-6 py-24" data-accent="cosmic">
    <p class="font-mono text-xs tracking-[0.18em] uppercase text-gray-500 mb-3">v2026 · personal archive</p>
    <h2 class="text-3xl md:text-5xl font-medium leading-tight mb-6">
      Welcome to my <em class="not-italic text-grad-cosmic inline-block pe-[0.06em]">nebula</em>.
    </h2>
    <p class="text-lg text-gray-300 max-w-2xl leading-relaxed mb-8">
      I'm an NUS Computer Sciences undergrad. Cloud, agents, craft brewing — a small constellation of obsessions and the projects they keep producing.
    </p>
    <p class="italic text-gray-400 mb-8">"Wonder is a renewable resource."</p>

    <a href="/milky-way" class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-grad-cosmic text-white font-medium shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform">
      <span class="w-2 h-2 rounded-full bg-star"></span>
      Enter the Milky Way
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
      </svg>
    </a>
  </section>

  <!-- Now: placeholder until Orrery island in Phase 4 -->
  <section class="relative max-w-7xl mx-auto px-6 py-16" data-accent="aurora">
    <SectionHead eyebrow="now · this week" title="Right" emTitle="now" linkHref="/about" linkLabel="more about me" />
    <div class="grid gap-4 md:grid-cols-3">
      {Object.entries(nowData).slice(0, 6).map(([key, v]: [string, any]) => (
        <div class="rounded-lg border border-slate-800/60 bg-slate-900/30 p-4">
          <div class="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">{key}</div>
          <div class="text-gray-100 font-medium">{v.title}</div>
          {v.note && <p class="text-sm text-gray-400 mt-1 leading-relaxed">{v.note}</p>}
        </div>
      ))}
    </div>
  </section>

  <!-- Projects -->
  <section class="relative max-w-7xl mx-auto px-6 py-16" data-accent="sunset">
    <SectionHead eyebrow="things on my workbench" title="Recent" emTitle="builds" linkHref="/projects" linkLabel="all projects" />
    <div class="grid gap-6 md:grid-cols-3">
      {projects.map(p => <ProjectCard project={p} />)}
    </div>
  </section>

  <!-- Career -->
  <section class="relative max-w-3xl mx-auto px-6 py-16" data-accent="nebula">
    <SectionHead eyebrow="where I've been" title="" emTitle="Trajectory" linkHref="/experience" linkLabel="full timeline" />
    <ol class="list-none">
      {exps.map((e, i) => (
        <ExperienceRow exp={e} starColor={starColors[e.star.type] ?? '#FFC700'} isLast={i === exps.length - 1} />
      ))}
    </ol>
  </section>

  <!-- Milky Way preview (full interactive constellation lands in Phase 4) -->
  <section class="relative max-w-7xl mx-auto px-6 py-16" data-accent="cosmic">
    <SectionHead eyebrow="digital garden · the milky way" title="The" emTitle="milky way" linkHref="/milky-way" linkLabel="enter the milky way" />
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
      {notes.map(n => <NoteCard note={n} />)}
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Build + smoke test**

Run: `npm run build`. Expected: builds successfully; `dist/index.html`, `dist/about/index.html`, `dist/projects/index.html`, `dist/experience/index.html`, `dist/milky-way/index.html` all present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home page with hero, now, projects, career, milky-way preview (static)"
```

**Phase 2 complete.** Run `npm run build && npx http-server dist -p 8000`, open in browser, walk through every route. Run Lighthouse — desktop should still be 100/100/100/100.


---

## Phase 3 — Cosmic islands

### Task 3.1: `useReducedComplexity` hook + tests

**Files:**
- Create: `src/lib/useReducedComplexity.ts`
- Create: `src/lib/useReducedComplexity.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/lib/useReducedComplexity.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedComplexity } from './useReducedComplexity';

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
});

describe('useReducedComplexity', () => {
  it('returns false when neither reduced-motion nor mobile-width matches', () => {
    const { result } = renderHook(() => useReducedComplexity());
    expect(result.current).toBe(false);
  });

  it('returns true when reduced-motion matches', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((q: string) => ({
      matches: q.includes('reduced-motion'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    const { result } = renderHook(() => useReducedComplexity());
    expect(result.current).toBe(true);
  });

  it('returns true when max-width 720 matches', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((q: string) => ({
      matches: q.includes('max-width: 720px'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    const { result } = renderHook(() => useReducedComplexity());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Install test deps**

Run: `npm install --save-dev @testing-library/react jsdom @vitest/ui`

Update `package.json` `vitest` config (add to root):

```json
"vitest": {
  "environment": "jsdom"
}
```

Or create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], test: { environment: 'jsdom', globals: true } });
```

And `npm install --save-dev @vitejs/plugin-react`.

- [ ] **Step 3: Run test (expect FAIL)**

Run: `npm test`
Expected: FAIL — `useReducedComplexity` not defined.

- [ ] **Step 4: Implement**

```ts
// src/lib/useReducedComplexity.ts
import { useEffect, useState } from 'react';

export function useReducedComplexity(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 720px)');
    const update = () => setReduced(motion.matches || mobile.matches);
    update();
    motion.addEventListener('change', update);
    mobile.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
    };
  }, []);

  return reduced;
}
```

- [ ] **Step 5: Run tests (expect PASS)**

Run: `npm test`
Expected: PASS, all 3 cases green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/useReducedComplexity.ts src/lib/useReducedComplexity.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat: useReducedComplexity hook + tests"
```

---

### Task 3.2: Stardate library + tests

**Files:**
- Create: `src/lib/stardate.ts`
- Create: `src/lib/stardate.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/lib/stardate.test.ts
import { describe, it, expect, vi } from 'vitest';
import { computeStardate } from './stardate';

describe('computeStardate', () => {
  it('matches TrekGuide canonical value for 2026-05-18', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T00:00:00Z'));
    const v = parseFloat(computeStardate());
    // From v3-splash.jsx: May 18, 2026 → ~80376.4
    expect(v).toBeGreaterThan(80370);
    expect(v).toBeLessThan(80380);
    vi.useRealTimers();
  });

  it('returns a string with 4 decimal places', () => {
    expect(computeStardate()).toMatch(/^\d+\.\d{4}$/);
  });
});
```

- [ ] **Step 2: Run test (expect FAIL)**

Run: `npm test -- stardate`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/stardate.ts
const STARDATE_EPOCH_MS = Date.UTC(1946, 0, 1);
const MS_PER_JULIAN_YEAR = 365.25 * 24 * 3600 * 1000;

export function computeStardate(now: number = Date.now()): string {
  const yrs = (now - STARDATE_EPOCH_MS) / MS_PER_JULIAN_YEAR;
  return (yrs * 1000).toFixed(4);
}
```

- [ ] **Step 4: Run test (expect PASS)**

Run: `npm test -- stardate`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stardate.ts src/lib/stardate.test.ts
git commit -m "feat: TNG stardate computation with vitest coverage"
```

---

### Task 3.3: Route → accent mapping

**Files:**
- Create: `src/lib/routes.ts`
- Create: `src/lib/routes.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/lib/routes.test.ts
import { describe, it, expect } from 'vitest';
import { accentForPath } from './routes';

describe('accentForPath', () => {
  it('returns cosmic for / and /milky-way', () => {
    expect(accentForPath('/')).toBe('cosmic');
    expect(accentForPath('/milky-way')).toBe('cosmic');
  });
  it('returns aurora for /about', () => { expect(accentForPath('/about')).toBe('aurora'); });
  it('returns sunset for /projects', () => { expect(accentForPath('/projects')).toBe('sunset'); });
  it('returns nebula for /experience', () => { expect(accentForPath('/experience')).toBe('nebula'); });
  it('falls back to cosmic for unknown paths', () => { expect(accentForPath('/xyz')).toBe('cosmic'); });
});
```

- [ ] **Step 2: Run (expect FAIL)**

Run: `npm test -- routes`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/routes.ts
export type Accent = 'cosmic' | 'sunset' | 'aurora' | 'nebula';

const MAP: Record<string, Accent> = {
  '/': 'cosmic',
  '/milky-way': 'cosmic',
  '/about': 'aurora',
  '/projects': 'sunset',
  '/experience': 'nebula',
};

export function accentForPath(path: string): Accent {
  const trimmed = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return MAP[trimmed] ?? 'cosmic';
}
```

- [ ] **Step 4: Run (expect PASS)**

Run: `npm test -- routes`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/routes.ts src/lib/routes.test.ts
git commit -m "feat: route → accent mapping with tests"
```

---

### Task 3.4: Cosmos canvas island

**Files:**
- Create: `src/components/island/Cosmos.tsx`
- Modify: `src/layouts/Base.astro`
- Reference: `design-handoff/algebananazzzzz-2-0/project/v3/v3-cosmos.jsx`

- [ ] **Step 1: Read the prototype**

Run: `Read design-handoff/algebananazzzzz-2-0/project/v3/v3-cosmos.jsx`. It paints ~280 stars + 18 nebula puffs on a fullscreen canvas; respects warpActive prop.

- [ ] **Step 2: Write `src/components/island/Cosmos.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

type Star = { x: number; y: number; r: number; phase: number; speed: number; hue: number };
type Nebula = { x: number; y: number; rx: number; ry: number; rot: number; hue: number; alpha: number };

const STAR_COUNT = 280;
const NEBULA_COUNT = 18;

export default function Cosmos() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedComplexity();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let stars: Star[] = [];
    let nebulae: Nebula[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.5 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.6,
        hue: Math.random() < 0.85 ? 60 : (Math.random() < 0.5 ? 290 : 200),
      }));
      nebulae = Array.from({ length: NEBULA_COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        rx: 120 + Math.random() * 220, ry: 80 + Math.random() * 160,
        rot: Math.random() * Math.PI,
        hue: Math.random() < 0.55 ? 280 : (Math.random() < 0.5 ? 320 : 200),
        alpha: 0.04 + Math.random() * 0.05,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // nebula puffs
      nebulae.forEach(n => {
        ctx.save();
        ctx.translate(n.x, n.y); ctx.rotate(n.rot);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.rx, n.ry));
        grad.addColorStop(0, `hsla(${n.hue}, 70%, 60%, ${n.alpha * 1.4})`);
        grad.addColorStop(1, `hsla(${n.hue}, 70%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // stars
      stars.forEach(s => {
        if (!reduced) s.phase += s.speed * dt;
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${tw})`;
        ctx.shadowColor = `hsla(${s.hue}, 90%, 70%, ${tw * 0.7})`;
        ctx.shadowBlur = s.r * 4;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // single static frame for low-power mode
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #020617 60%, #000 100%)' }}
    />
  );
}
```

- [ ] **Step 3: Slot into `Base.astro`**

Replace `<slot name="background" />` with:

```astro
import Cosmos from '@/components/island/Cosmos';
...
<Cosmos client:idle />
```

- [ ] **Step 4: Mobile fallback CSS in v3.css**

Append to `src/styles/v3.css`:

```css
/* On phones, hide the canvas — body's CSS background carries the night sky */
@media (max-width: 720px) {
  canvas[aria-hidden="true"][class*="fixed"] { display: none; }
}
body {
  background:
    radial-gradient(ellipse at 25% 10%, rgba(126, 34, 206, 0.18), transparent 50%),
    radial-gradient(ellipse at 75% 80%, rgba(0, 223, 213, 0.10), transparent 60%),
    #020617;
}
```

- [ ] **Step 5: Build + visual check**

Run: `npm run dev` and open `http://localhost:4321/`. Expected: starfield twinkling on desktop, gradient bg on phone-width.

- [ ] **Step 6: Commit**

```bash
git add src/components/island/Cosmos.tsx src/layouts/Base.astro src/styles/v3.css
git commit -m "feat: Cosmos canvas island with reduced-complexity fallback"
```

---

### Task 3.5: AccentOrb island

**Files:**
- Create: `src/components/island/AccentOrb.tsx`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Write `AccentOrb.tsx`**

```tsx
import { useEffect, useState } from 'react';

const palettes = {
  cosmic: { a: '#7E22CE', b: '#4F46E5' },
  sunset: { a: '#F97316', b: '#DC2626' },
  aurora: { a: '#16A34A', b: '#0891B2' },
  nebula: { a: '#BE185D', b: '#5B21B6' },
};

export default function AccentOrb() {
  const [accent, setAccent] = useState<keyof typeof palettes>('cosmic');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-accent]'));
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) {
        const a = visible[0].target.getAttribute('data-accent') as keyof typeof palettes;
        if (a in palettes) setAccent(a);
      }
    }, { threshold: [0.2, 0.5, 0.8] });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const { a, b } = palettes[accent];
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700">
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20 blur-3xl transition-colors duration-1000" style={{ background: a }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl transition-colors duration-1000" style={{ background: b }} />
    </div>
  );
}
```

- [ ] **Step 2: Add to Base.astro**

Below the Cosmos line:

```astro
import AccentOrb from '@/components/island/AccentOrb';
...
<AccentOrb client:idle />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/island/AccentOrb.tsx src/layouts/Base.astro
git commit -m "feat: AccentOrb crossfades by section via IntersectionObserver"
```

---

### Task 3.6: Splash island + integrate on home

**Files:**
- Create: `src/components/island/Splash.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `Splash.tsx`**

Port the scroll-driven splash from `v3-splash.jsx` (already reviewed in Phase 0 reading). Convert React 18 `useState_VS`/`useRef_VS` aliases to native names; use the stardate util.

```tsx
import { useEffect, useRef, useState } from 'react';
import { computeStardate } from '@/lib/stardate';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

const warpLines = Array.from({ length: 38 }, (_, i) => {
  const x = (i * 27.7) % 100;
  const yJitter = ((i * 41.3) % 80) - 40;
  const len = 28 + ((i * 13) % 18);
  return { x, yJitter, len, key: i };
});

export default function Splash() {
  const innerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const warpRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const stardateRef = useRef<HTMLSpanElement>(null);
  const [past, setPast] = useState(false);
  const reduced = useReducedComplexity();

  // Live stardate
  useEffect(() => {
    const tick = () => { if (stardateRef.current) stardateRef.current.textContent = computeStardate(); };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, []);

  // Scroll-driven parallax
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY || 0;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, y / (vh * 0.9)));
      const pe = p * p;
      if (innerRef.current) {
        innerRef.current.style.opacity = String(1 - p * 1.05);
        innerRef.current.style.transform = `translateY(${-p * 70}px) scale(${1 + p * 0.06})`;
        innerRef.current.style.filter = `blur(${pe * 14}px)`;
      }
      if (eyebrowRef.current) {
        eyebrowRef.current.style.transform = `translateY(${-p * 140}px)`;
        eyebrowRef.current.style.opacity = String(Math.max(0, 1 - p * 2.4));
      }
      if (helloRef.current) {
        helloRef.current.style.letterSpacing = `${-0.045 + p * 0.08}em`;
      }
      if (subRef.current) {
        subRef.current.style.transform = `translateY(${-p * 30}px) scale(${1 + p * 0.18})`;
        subRef.current.style.opacity = String(Math.max(0, 1 - p * 1.7));
      }
      if (warpRef.current) {
        const wIn = Math.max(0, Math.min(1, (p - 0.02) / 0.23));
        const wOut = Math.max(0, Math.min(1, 1 - (p - 0.75) / 0.20));
        warpRef.current.style.opacity = String(Math.min(wIn, wOut));
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - p * 2.8));
      }
      setPast(p > 0.18);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  const onClickHint = () => {
    const vh = window.innerHeight || 800;
    if (reduced) { window.scrollTo(0, vh); return; }
    const startY = window.scrollY || 0;
    const dist = vh - startY;
    if (dist <= 0) return;
    const duration = 3200;
    const startT = performance.now();
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startT) / duration);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6" aria-label="welcome" data-accent="cosmic">
      <div ref={warpRef} aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {warpLines.map(l => (
          <span key={l.key} className="absolute w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"
            style={{ left: `${l.x}%`, top: `calc(50% + ${l.yJitter}vh)`, height: `${l.len}vh` }} />
        ))}
      </div>
      <div ref={horizonRef} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center bottom, rgba(126,34,206,0.4), transparent 70%)', opacity: 0 }} />

      <div ref={innerRef} className="relative z-10 text-center max-w-3xl">
        <div ref={eyebrowRef} className="font-mono text-xs tracking-[0.32em] uppercase text-gray-500 mb-3 inline-flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-star inline-block" />
          singapore · 1.3°n · stardate <span ref={stardateRef} className="text-star">{computeStardate()}</span>
        </div>
        <h1 ref={helloRef} className="text-5xl md:text-7xl font-medium tracking-tight">
          Hello, I'm <em className="not-italic text-grad-cosmic inline-block pe-[0.06em]">Daniel</em>
        </h1>
        <div ref={subRef} className="mt-4 font-mono text-sm text-gray-400 tracking-[0.14em] flex items-center justify-center gap-2">
          <span>NUS Computer Sciences</span><span>·</span><span>builder</span><span>·</span><span>brewer</span><span>·</span><span>stargazer</span>
        </div>
      </div>

      <button ref={hintRef} onClick={onClickHint} aria-label="descend into the nebula"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors font-mono text-xs">
        <span>descent into the nebula</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Swap placeholder splash on home**

Edit `src/pages/index.astro` — remove the `<section id="splash-mount">…</section>` block and replace with:

```astro
import Splash from '@/components/island/Splash';
...
<Splash client:load />
```

- [ ] **Step 3: Build + test**

Run: `npm run build && npm run preview` then visit `http://localhost:4321/`. Scroll — splash fades and warp streaks lift past.

- [ ] **Step 4: Commit**

```bash
git add src/components/island/Splash.tsx src/pages/index.astro
git commit -m "feat: Splash island with scroll parallax, warp tunnel, live stardate"
```

---

### Task 3.7: Meteor of the day

**Files:**
- Create: `src/components/island/Meteor.tsx`
- Modify: `src/layouts/Base.astro`
- Reference: `design-handoff/algebananazzzzz-2-0/project/v3/v3-meteor.jsx`

- [ ] **Step 1: Read prototype meteor**

Run: `Read design-handoff/algebananazzzzz-2-0/project/v3/v3-meteor.jsx`. Note: spawns every N seconds, animates across screen with trail, catchable on click (head stays, trail hides, callout shows source note), resumes on release.

- [ ] **Step 2: Write `src/components/island/Meteor.tsx`** (compact port)

```tsx
import { useEffect, useRef, useState } from 'react';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

const INTERVAL_MS = 30_000;

export default function Meteor() {
  const reduced = useReducedComplexity();
  const [visible, setVisible] = useState(false);
  const [caught, setCaught] = useState(false);
  const startedAt = useRef(0);
  const trajectory = useRef<{ x0: number; y0: number; x1: number; y1: number }>({ x0: 0, y0: 0, x1: 0, y1: 0 });

  useEffect(() => {
    if (reduced) return;
    const spawn = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const side = Math.random() < 0.5 ? 'tl' : 'tr';
      trajectory.current = side === 'tl'
        ? { x0: -50, y0: Math.random() * h * 0.3, x1: w + 50, y1: h * (0.6 + Math.random() * 0.3) }
        : { x0: w + 50, y0: Math.random() * h * 0.3, x1: -50, y1: h * (0.6 + Math.random() * 0.3) };
      startedAt.current = performance.now();
      setCaught(false);
      setVisible(true);
      setTimeout(() => { if (!caught) setVisible(false); }, 7000);
    };
    spawn();
    const id = setInterval(() => { if (!visible && !caught) spawn(); }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, caught]);

  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced || !visible || caught) return;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt.current) / 4500);
      const { x0, y0, x1, y1 } = trajectory.current;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      if (headRef.current) {
        headRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, caught, reduced]);

  if (reduced || !visible) return null;

  return (
    <button
      ref={headRef}
      onClick={() => setCaught(true)}
      aria-label="catch the meteor"
      className="fixed top-0 left-0 z-30 w-4 h-4 rounded-full bg-star pointer-events-auto"
      style={{ boxShadow: '0 0 24px 4px rgba(255,199,0,0.5)' }}
    >
      {!caught && (
        <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 h-px w-40"
          style={{ background: 'linear-gradient(to left, rgba(255,199,0,0.9), transparent)' }} />
      )}
    </button>
  );
}
```

- [ ] **Step 3: Mount in `Base.astro`**

```astro
import Meteor from '@/components/island/Meteor';
...
<Meteor client:idle />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/island/Meteor.tsx src/layouts/Base.astro
git commit -m "feat: Meteor-of-the-day island with catchable head"
```

**Phase 3 complete.** Run `npm run build && npm run preview`, capture Lighthouse on home and `/about`. Targets: Perf 95+, A11y 100, BP 100, SEO 100 desktop.

---

## Phase 4 — Milky Way + polish

### Task 4.1: Magnitude library + tests

**Files:**
- Create: `src/lib/magnitude.ts`
- Create: `src/lib/magnitude.test.ts`

- [ ] **Step 1: Test first**

```ts
// src/lib/magnitude.test.ts
import { describe, it, expect } from 'vitest';
import { magnitudeFor } from './magnitude';

describe('magnitudeFor', () => {
  it('returns lower (brighter) magnitude for more-linked notes', () => {
    const heavy = magnitudeFor({ links: 9, dateMs: Date.now() });
    const light = magnitudeFor({ links: 2, dateMs: Date.now() });
    expect(heavy).toBeLessThan(light);
  });
  it('penalises older notes (higher magnitude)', () => {
    const fresh = magnitudeFor({ links: 5, dateMs: Date.now() });
    const aged  = magnitudeFor({ links: 5, dateMs: Date.now() - 365 * 86400_000 });
    expect(aged).toBeGreaterThan(fresh);
  });
  it('clamps to a reasonable range', () => {
    const m = magnitudeFor({ links: 99, dateMs: Date.now() });
    expect(m).toBeGreaterThanOrEqual(-3);
  });
});
```

- [ ] **Step 2: Run, expect FAIL**

Run: `npm test -- magnitude`. Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/magnitude.ts
export function magnitudeFor({ links, dateMs }: { links: number; dateMs: number }): number {
  const ageDays = Math.max(0, (Date.now() - dateMs) / 86400_000);
  const ageTax = Math.min(2.5, ageDays / 180);   // up to +2.5 mag over 6 mo
  const linkBoost = Math.log2(1 + links) * 1.2;  // brighter as links pile up
  return Math.max(-3, 6 - linkBoost + ageTax);
}
```

- [ ] **Step 4: Run, expect PASS**

Run: `npm test -- magnitude`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/magnitude.ts src/lib/magnitude.test.ts
git commit -m "feat: astronomical magnitude (links + recency) library"
```

---

### Task 4.2: NotePanel island

**Files:**
- Create: `src/components/island/NotePanel.tsx`

- [ ] **Step 1: Write**

```tsx
import { useEffect } from 'react';

export interface NotePanelData {
  id: string; title: string; excerpt: string; cluster: string;
  status: 'seedling' | 'budding' | 'evergreen';
  links: number; date: string; readTime: string; words: number;
  backlinks: string[]; related: string[];
}

interface Props { note: NotePanelData | null; onClose: () => void; }

export default function NotePanel({ note, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!note) return null;

  return (
    <>
      <button aria-label="close note panel" onClick={onClose}
        className="fixed inset-0 z-40 bg-night/60 backdrop-blur-sm" />
      <aside role="dialog" aria-label={note.title}
        className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-night-soft border-l border-slate-700 p-6 overflow-y-auto">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
            {note.cluster} · {note.status} · M {(6 - note.links * 0.5).toFixed(1)}
          </div>
          <button onClick={onClose} aria-label="close" className="text-gray-400 hover:text-gray-100 text-xl leading-none">×</button>
        </div>
        <h2 className="text-xl font-medium text-gray-100 mb-3">{note.title}</h2>
        <p className="text-gray-300 leading-relaxed mb-6">{note.excerpt}</p>

        <dl className="grid grid-cols-2 gap-y-2 text-xs font-mono mb-6">
          <dt className="text-gray-500">date</dt><dd className="text-gray-300">{note.date}</dd>
          <dt className="text-gray-500">read</dt><dd className="text-gray-300">{note.readTime}</dd>
          <dt className="text-gray-500">words</dt><dd className="text-gray-300">{note.words}</dd>
          <dt className="text-gray-500">links</dt><dd className="text-gray-300">{note.links}</dd>
        </dl>

        {note.backlinks.length > 0 && (
          <section className="mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">backlinks</h3>
            <ul className="space-y-1">
              {note.backlinks.map(b => (
                <li key={b}><a href={`#${b}`} className="text-sm text-star hover:text-star-bright">↳ {b}</a></li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/island/NotePanel.tsx
git commit -m "feat: NotePanel slide-in island with backlinks"
```

---

### Task 4.3: Constellation island (home preview)

**Files:**
- Create: `src/components/island/Constellation.tsx`
- Modify: `src/pages/index.astro`
- Reference: `design-handoff/algebananazzzzz-2-0/project/constellation.jsx`

- [ ] **Step 1: Read prototype**

Run: `Read design-handoff/algebananazzzzz-2-0/project/constellation.jsx`. Notes laid out in viewBox 200×60; stars sized by link count; lines drawn between related notes; hover label; click invokes onSelect.

- [ ] **Step 2: Write `Constellation.tsx`**

```tsx
import { useMemo, useState } from 'react';
import NotePanel, { type NotePanelData } from './NotePanel';

interface Props {
  notes: NotePanelData[];
  clusters: { id: string; label: string; dotColor: string }[];
  activeCluster?: string;
}

const VB_W = 200, VB_H = 60;

function positionFor(note: NotePanelData) {
  // arms 0,1,2 wrap horizontally; arm -1 is the bright core
  const cx = note.arm === -1 ? VB_W / 2 : (20 + note.arm * 60) + note.t * 40;
  const cy = note.arm === -1 ? VB_H / 2 : 15 + (note.arm % 2) * 20 + (note.t - 0.5) * 12;
  return { cx, cy };
}

export default function Constellation({ notes, clusters, activeCluster = 'all' }: Props & { activeCluster?: string }) {
  const clusterById = useMemo(() => Object.fromEntries(clusters.map(c => [c.id, c])), [clusters]);
  const positioned = useMemo(() => notes.map((n: any) => ({ ...n, ...positionFor(n) })), [notes]);
  const noteById = useMemo(() => Object.fromEntries(positioned.map(n => [n.id, n])), [positioned]);

  const lines = useMemo(() => {
    const set = new Set<string>();
    const out: { a: any; b: any; key: string }[] = [];
    positioned.forEach(n => n.related?.forEach(rid => {
      const pair = [n.id, rid].sort().join('-');
      if (set.has(pair)) return;
      const b = noteById[rid];
      if (!b) return;
      set.add(pair);
      out.push({ a: n, b, key: pair });
    }));
    return out;
  }, [positioned, noteById]);

  const [selected, setSelected] = useState<NotePanelData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const dim = (id: string, cluster: string) =>
    activeCluster === 'all' || cluster === activeCluster ? 1 : 0.18;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto max-h-[360px]" role="img" aria-label="Constellation of notes">
        {lines.map(({ a, b, key }) => (
          <line key={key} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                stroke="rgba(255,199,0,0.18)" strokeWidth={0.12} />
        ))}
        {positioned.map(n => {
          const c = clusterById[n.cluster] ?? { dotColor: '#fff' };
          const r = 0.6 + Math.min(1.4, n.links * 0.2);
          const op = dim(n.id, n.cluster);
          return (
            <g key={n.id} style={{ cursor: 'pointer', opacity: op }} onClick={() => setSelected(n)}
               onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
               tabIndex={0} role="button" aria-label={n.title}
               onKeyDown={(e) => { if (e.key === 'Enter') setSelected(n); }}>
              <circle cx={n.cx} cy={n.cy} r={r * 2.4} fill={c.dotColor} opacity="0.15" />
              <circle cx={n.cx} cy={n.cy} r={r} fill={c.dotColor} />
              {hovered === n.id && (
                <text x={n.cx + r + 1.5} y={n.cy + 0.6} fill="#e5e7eb" fontSize="1.6" fontFamily="ui-monospace, monospace">
                  {n.title.slice(0, 28)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <NotePanel note={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
```

- [ ] **Step 3: Mount on home + milky-way preview**

In `src/pages/index.astro`, replace the static NoteCard grid with the constellation island. Add to frontmatter:

```astro
import Constellation from '@/components/island/Constellation';
import { getCollection } from 'astro:content';

const notes = (await getCollection('notes')).map(n => n.data);
const clusters = (await getCollection('clusters')).map(c => c.data);
```

Replace `<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">…</div>` with:

```astro
<div class="mt-6 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
  <Constellation client:visible notes={notes} clusters={clusters} />
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/island/Constellation.tsx src/pages/index.astro
git commit -m "feat: Constellation island — home-preview SVG note graph"
```

---

### Task 4.4: MilkyWay full page island

**Files:**
- Create: `src/components/island/MilkyWay.tsx`
- Modify: `src/pages/milky-way.astro`
- Reference: `design-handoff/algebananazzzzz-2-0/project/milky-way.jsx`

- [ ] **Step 1: Write `MilkyWay.tsx`**

```tsx
import { useMemo, useState } from 'react';
import NotePanel, { type NotePanelData } from './NotePanel';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

interface Props {
  notes: NotePanelData[];
  clusters: { id: string; label: string; dotColor: string }[];
}

const W = 1200, H = 700;
const CORE_X = W / 2, CORE_Y = H / 2;

function spiralPos(arm: number, t: number) {
  if (arm === -1) return { x: CORE_X + (Math.random() - 0.5) * 60, y: CORE_Y + (Math.random() - 0.5) * 40 };
  const armRot = arm * (Math.PI * 2 / 3);
  const angle = armRot + t * Math.PI * 2.4;
  const radius = 80 + t * 380;
  return { x: CORE_X + Math.cos(angle) * radius, y: CORE_Y + Math.sin(angle) * radius * 0.62 };
}

export default function MilkyWay({ notes, clusters }: Props) {
  const reduced = useReducedComplexity();
  const [active, setActive] = useState<string>('all');
  const [selected, setSelected] = useState<NotePanelData | null>(null);

  const clusterById = useMemo(() => Object.fromEntries(clusters.map(c => [c.id, c])), [clusters]);
  const positioned = useMemo(() => notes.map(n => ({ ...n, ...spiralPos(n.arm, n.t) })), [notes]);

  // dust stars for atmosphere
  const dust = useMemo(() => Array.from({ length: reduced ? 60 : 320 }, () => {
    const arm = Math.floor(Math.random() * 3);
    const t = Math.random();
    const { x, y } = spiralPos(arm, t);
    return { x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 24, r: Math.random() * 1.4 };
  }), [reduced]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-6">
      <div className="relative rounded-xl border border-slate-800/60 bg-slate-950/40 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Milky Way of notes">
          <defs>
            <radialGradient id="core">
              <stop offset="0%" stopColor="#FFC700" stopOpacity="0.9"/>
              <stop offset="40%" stopColor="#D946EF" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#7E22CE" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0.20)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
          </defs>
          <ellipse cx={CORE_X} cy={CORE_Y} rx={W * 0.55} ry={H * 0.18} fill="url(#streak)" transform={`rotate(-12 ${CORE_X} ${CORE_Y})`} />
          <ellipse cx={CORE_X} cy={CORE_Y} rx={W * 0.45} ry={H * 0.12} fill="url(#streak)" transform={`rotate(8 ${CORE_X} ${CORE_Y})`} />
          <circle cx={CORE_X} cy={CORE_Y} r={140} fill="url(#core)" />

          {dust.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="rgba(255,255,255,0.55)" />
          ))}

          {positioned.map(n => {
            const c = clusterById[n.cluster] ?? { dotColor: '#fff' };
            const r = 3 + Math.min(8, n.links * 1.4);
            const op = active === 'all' || n.cluster === active ? 1 : 0.18;
            return (
              <g key={n.id} style={{ cursor: 'pointer', opacity: op }} onClick={() => setSelected(n)}
                 tabIndex={0} role="button" aria-label={n.title}
                 onKeyDown={(e) => { if (e.key === 'Enter') setSelected(n); }}>
                <circle cx={n.x} cy={n.y} r={r * 2.5} fill={c.dotColor} opacity="0.12" />
                <circle cx={n.x} cy={n.y} r={r} fill={c.dotColor} />
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="space-y-4">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">filter by cluster</h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => setActive('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${active === 'all' ? 'bg-slate-800/60 text-gray-100' : 'text-gray-400 hover:text-gray-200'}`}>
                <span>all clusters</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800/70 text-gray-200">{notes.length}</span>
              </button>
            </li>
            {clusters.map(c => {
              const count = notes.filter(n => n.cluster === c.id).length;
              return (
                <li key={c.id}>
                  <button onClick={() => setActive(c.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${active === c.id ? 'bg-slate-800/60 text-gray-100' : 'text-gray-400 hover:text-gray-200'}`}>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: c.dotColor }} aria-hidden="true" />
                      {c.label}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800/70 text-gray-200">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <NotePanel note={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
```

- [ ] **Step 2: Mount on `/milky-way`**

Edit `src/pages/milky-way.astro` — replace the `#milky-way-mount` div with:

```astro
import MilkyWay from '@/components/island/MilkyWay';
import { getCollection } from 'astro:content';

const notes = (await getCollection('notes')).map(n => n.data);
const clusters = (await getCollection('clusters')).map(c => c.data);
```

In body, replace the placeholder div:

```astro
<div class="mt-12">
  <MilkyWay client:visible notes={notes} clusters={clusters} />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/island/MilkyWay.tsx src/pages/milky-way.astro
git commit -m "feat: MilkyWay full page — spiral galaxy + sidebar filter"
```

---

### Task 4.5: Orrery island

**Files:**
- Create: `src/components/island/Orrery.tsx`
- Modify: `src/pages/index.astro`
- Reference: `design-handoff/algebananazzzzz-2-0/project/v3/v3-orrery.jsx`

- [ ] **Step 1: Read prototype**

Run: `Read design-handoff/algebananazzzzz-2-0/project/v3/v3-orrery.jsx`. Notes: Sun + 3 orbiting bodies (building / writing / obsessed). Slow rotation; pause on hover.

- [ ] **Step 2: Write `Orrery.tsx`** (faithful but minimal port)

```tsx
import { useEffect, useRef } from 'react';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

interface OrreryItem { title: string; note: string; tag: string; }

interface Props {
  building: OrreryItem; writing: OrreryItem; obsessed: OrreryItem;
}

export default function Orrery({ building, writing, obsessed }: Props) {
  const reduced = useReducedComplexity();
  const svgRef = useRef<SVGSVGElement>(null);
  const bodies = [
    { key: 'building', item: building, color: '#B02EED', orbit: 100, speed: 0.0006 },
    { key: 'writing',  item: writing,  color: '#22D3EE', orbit: 160, speed: 0.0004 },
    { key: 'obsessed', item: obsessed, color: '#F97316', orbit: 220, speed: 0.0003 },
  ];

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      bodies.forEach(b => {
        const el = svgRef.current?.querySelector<SVGGElement>(`[data-key="${b.key}"]`);
        if (!el) return;
        const a = t * b.speed;
        el.setAttribute('transform', `rotate(${(a * 180 / Math.PI) % 360})`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
      <svg ref={svgRef} viewBox="-260 -260 520 520" className="w-full max-w-[420px] mx-auto" role="img" aria-label="Orrery: current projects orbiting">
        <circle r="14" fill="#FFC700" />
        <circle r="30" fill="#FFC700" opacity="0.15" />
        {bodies.map(b => (
          <g key={b.key} data-key={b.key}>
            <circle cx={b.orbit} cy="0" r="6" fill={b.color} />
            <circle cx={b.orbit} cy="0" r="14" fill={b.color} opacity="0.15" />
            <circle cx="0" cy="0" r={b.orbit} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
          </g>
        ))}
      </svg>
      <ul className="space-y-3 text-sm">
        {bodies.map(b => (
          <li key={b.key} className="flex gap-3 items-start">
            <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} aria-hidden="true" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500">{b.key}</div>
              <div className="text-gray-100 font-medium">{b.item.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{b.item.note}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Mount on home**

In `src/pages/index.astro`, replace the now-grid `<div class="grid gap-4 md:grid-cols-3">…</div>` block with:

```astro
import Orrery from '@/components/island/Orrery';
...
<Orrery client:visible building={nowData.building} writing={nowData.writing} obsessed={nowData.obsessed} />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/island/Orrery.tsx src/pages/index.astro
git commit -m "feat: Orrery island — three bodies orbiting current focus"
```

---

### Task 4.6: Final Lighthouse + a11y audit

**Files:**
- Create: `docs/audit-2026-05-19.md` (results doc)

- [ ] **Step 1: Production build**

Run: `npm run build && npm run preview`

- [ ] **Step 2: Run Lighthouse for each route**

Run (one at a time, capture scores):
```bash
npx lighthouse http://localhost:4321/           --quiet --chrome-flags="--headless=new" --output=json --output-path=lh-home.json
npx lighthouse http://localhost:4321/about      --quiet --chrome-flags="--headless=new" --output=json --output-path=lh-about.json
npx lighthouse http://localhost:4321/projects   --quiet --chrome-flags="--headless=new" --output=json --output-path=lh-projects.json
npx lighthouse http://localhost:4321/experience --quiet --chrome-flags="--headless=new" --output=json --output-path=lh-experience.json
npx lighthouse http://localhost:4321/milky-way  --quiet --chrome-flags="--headless=new" --output=json --output-path=lh-milky.json
```

Inspect with:
```bash
for f in lh-*.json; do echo "=== $f ==="; jq '.categories | to_entries | map({k:.key, v:.value.score})' "$f"; done
```

- [ ] **Step 3: Fix any failures**

If any score < target:
- Performance < 95: check for unused CSS, defer more islands, audit `inlineStylesheets`
- A11y < 100: re-run `npx pa11y http://localhost:4321/` for actionable issues
- BP < 100: ensure no mixed-content warnings, no console errors
- SEO < 100: verify per-page `<title>` + `<meta description>` populated

- [ ] **Step 4: Document scores**

Write `docs/audit-2026-05-19.md`:

```md
# Lighthouse audit — 2026-05-19

| Route | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| / | _filled_in_ | _filled_in_ | _filled_in_ | _filled_in_ |
| /about | … | … | … | … |
| /projects | … | … | … | … |
| /experience | … | … | … | … |
| /milky-way | … | … | … | … |

Mobile (emulated): ran with `--preset=mobile`. Scores recorded above for desktop only.
```

- [ ] **Step 5: Commit + cleanup**

```bash
rm lh-*.json
git add docs/audit-2026-05-19.md
git commit -m "docs: record Lighthouse audit results"
```

**Phase 4 complete.** Site is now feature-complete. Surface it via `git push -u origin main` once the GitHub remote is in place — the GitHub Actions workflow handles the deploy.

---

## Self-review checklist

Once every task above is `[x]`, verify against the spec:

- [ ] Lighthouse 100/100/100/100 on every desktop route
- [ ] Lighthouse 95+ A11y, 90+ Perf on mobile
- [ ] Five routes resolve: `/`, `/about`, `/projects`, `/experience`, `/milky-way`
- [ ] YAML files in `src/content/` validate via Zod
- [ ] No Google Fonts requests in network panel
- [ ] No Babel-in-browser script tags
- [ ] `prefers-reduced-motion: reduce` disables continuous animations
- [ ] Tab key navigation visits every interactive element with visible focus ring
- [ ] Skip-link appears on first Tab
- [ ] Splash stardate increments live
- [ ] Constellation on home + Milky Way page open NotePanel on click
- [ ] Cluster filter dims unrelated stars
- [ ] Meteor crosses screen ~every 30s; catching it pauses + hides trail
- [ ] Cosmos canvas hidden on viewports < 720px (CSS gradient instead)
- [ ] `npm run build` exits 0, `dist/` produces valid HTML
- [ ] GitHub Actions workflow deploys cleanly

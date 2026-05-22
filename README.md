# algebananazzzzz — Personal Portfolio + Digital Garden

A personal portfolio + digital garden built as an interactive cartoon cosmos. Five pages laid out like a star map: a splash hero, an orrery of what I'm doing now, a gravity-warped project board, a stellar trajectory of my work history, and a milky-way constellation of notes.

**Live:** https://algebananazzzzz.github.io

## Tech stack

- [Astro 5](https://astro.build) — static site generator
- [React 18](https://react.dev) — interactive islands
- [Tailwind v4](https://tailwindcss.com) — utility CSS
- [TypeScript 5.7](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev) — unit tests
- [Prettier](https://prettier.io) with `prettier-plugin-astro`
- [GitHub Pages](https://pages.github.com) — hosting via GitHub Actions

## Local development

```bash
git clone https://github.com/algebananazzzzz/algebananazzzzz2.0.git
cd algebananazzzzz2.0

# node version (uses .nvmrc)
nvm use

npm install
npm run dev   # http://localhost:4321
```

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Astro dev server with HMR.       |
| `npm run build`        | Static build to `dist/`.         |
| `npm run preview`      | Serve the built `dist/`.         |
| `npm run check`        | TypeScript + Astro diagnostics.  |
| `npm test`             | Vitest single-run.               |
| `npm run test:watch`   | Vitest watch mode.               |
| `npm run format`       | Prettier write across all files. |
| `npm run format:check` | Prettier check (CI gate).        |

## Project structure

```
src/
├── components/
│   ├── island/        React components, hydrated on the client
│   └── static/        Astro components, server-only (TopNav, Footer)
├── content/           YAML data + Zod schemas (projects, experience, notes, clusters, mottos)
├── layouts/           Base.astro — chrome layout
├── lib/               Pure utilities + tests (magnitude, stardate, routes)
├── pages/             Route entries (5 routes)
├── styles/
│   ├── tokens.css     Palette + type tokens (source of truth)
│   ├── global.css     Tailwind + @theme bridge + base resets
│   ├── portfolio.css  Barrel re-export
│   ├── portfolio/     Themed CSS modules (cosmos, splash, hero, ...)
│   ├── pages.css      Sub-page wrappers
│   └── page-bg.css    Per-route accent washes
└── types/             *.yaml module shim
```

## Deployment

Pushes to `main` build and deploy automatically via `.github/workflows/2-preprod-deploy.yml`.

Pull requests and non-`main` branches run CI via `.github/workflows/1-feature-branch-ci.yml` — format check, type check, tests, build.

## Credits

Design system + visual language hand-rolled with Claude Design assistance. Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (variable) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via `@fontsource`. Icons: inline SVG.

## License

Source code: MIT. Content (notes, copy, project descriptions) is not licensed for reuse.

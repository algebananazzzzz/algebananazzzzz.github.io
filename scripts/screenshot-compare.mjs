// scripts/screenshot-compare.mjs
// Renders both the original prototype (port 5000) and my build (port 4321)
// at multiple viewports, captures full-page screenshots, saves to ./shots/
// for side-by-side review.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/Users/bytedance/algebananazzzzz2.0/shots';
mkdirSync(ROOT, { recursive: true });

const targets = [
  {
    name: 'home',
    proto: 'http://localhost:5000/Portfolio%20v3.html',
    mine: 'http://localhost:4321/',
  },
  {
    name: 'about',
    proto: 'http://localhost:5000/Portfolio%20v3.html#/about',
    mine: 'http://localhost:4321/about',
  },
  {
    name: 'projects',
    proto: 'http://localhost:5000/Portfolio%20v3.html#/projects',
    mine: 'http://localhost:4321/projects',
  },
  {
    name: 'experience',
    proto: 'http://localhost:5000/Portfolio%20v3.html#/experience',
    mine: 'http://localhost:4321/experience',
  },
  {
    name: 'milky-way',
    proto: 'http://localhost:5000/Portfolio%20v3.html#/milky-way',
    mine: 'http://localhost:4321/milky-way',
  },
];

const viewports = [{ name: 'desktop', width: 1440, height: 900 }];

const browser = await chromium.launch();
const ctx = await browser.newContext();

for (const v of viewports) {
  for (const t of targets) {
    for (const side of ['proto', 'mine']) {
      const page = await ctx.newPage();
      await page.setViewportSize({ width: v.width, height: v.height });
      const url = t[side];
      console.log(`→ ${v.name} ${t.name} ${side}: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        // give canvases / babel a beat
        await page.waitForTimeout(side === 'proto' ? 4000 : 2000);
        const path = join(ROOT, `${v.name}-${t.name}-${side}.png`);
        await page.screenshot({ path, fullPage: true });
        console.log(`   saved ${path}`);
      } catch (e) {
        console.log(`   FAILED: ${e.message}`);
      }
      await page.close();
    }
  }
}

await browser.close();
console.log('done');

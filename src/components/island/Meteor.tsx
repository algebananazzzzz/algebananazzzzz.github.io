import { useEffect, useRef } from 'react';
import { computeStardate } from '@/lib/stardate';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

type Quote = { text: string; cluster: string };

const QUOTES: Quote[] = [
  { text: 'Learning is always free.', cluster: 'general' },
  { text: 'Patience is the second yeast.', cluster: 'brewery' },
  { text: 'Read like a magpie, link like a librarian.', cluster: 'reading' },
  { text: 'Names outlast architectures.', cluster: 'cloud' },
  { text: 'Prompt like you mean it. Evals before vibes.', cluster: 'llm' },
  { text: 'I keep a garden, not a blog.', cluster: 'general' },
  { text: 'Wonder is a renewable resource.', cluster: 'general' },
  { text: 'Cache is a promise you keep tomorrow.', cluster: 'cloud' },
  { text: 'Margin notes are the real book.', cluster: 'reading' },
  { text: 'Quote slow, summarise slower.', cluster: 'reading' },
  { text: 'The map is not the model.', cluster: 'llm' },
  { text: 'Every batch is a confession.', cluster: 'brewery' },
];

interface Props {
  enabled?: boolean;
  intervalMs?: number;
}

export default function Meteor({ enabled = true, intervalMs = 30_000 }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const reduced = useReducedComplexity();

  useEffect(() => {
    if (!enabled || reduced) return;
    const layer = layerRef.current;
    if (!layer) return;

    const cleanups: Array<() => void> = [];

    const launch = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const fromRight = Math.random() > 0.35;
      const startX = fromRight ? w + 280 : -280;
      const startY = Math.random() * h * 0.35 + 60;
      const endX = fromRight ? -260 : w + 260;
      const drop = h * (0.45 + Math.random() * 0.18);
      const endY = startY + drop;
      const duration = 18_000 + Math.random() * 4_000;

      const q = QUOTES[indexRef.current % QUOTES.length];
      indexRef.current++;

      const node = document.createElement('div');
      node.className = 'meteor';
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', `Meteor: "${q.text}". Click to keep it.`);

      const dx = endX - startX;
      const dy = endY - startY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      node.innerHTML = `
        <div class="meteor-rotor" style="transform: rotate(${angle}deg)">
          <span class="trail"></span>
          <span class="head"></span>
        </div>
        <span class="quote">${escapeHtml(q.text)}</span>
        <span class="catch-hint" aria-hidden="true">click to keep</span>
      `;

      node.style.left = startX + 'px';
      node.style.top = startY + 'px';
      node.style.transform = 'translate(0, 0)';
      node.style.opacity = '0';

      layer.appendChild(node);
      // Force layout to commit the initial transform/opacity before we set the
      // transition + target values — without this, React+Vite occasionally
      // collapses both updates into a single style flush, skipping the animation.
      void node.offsetHeight;

      const traversalStartT = performance.now() + 60;
      let pausedFraction = 0;
      let released = false;
      let removeT: ReturnType<typeof setTimeout> | null = null;
      let fadeT: ReturnType<typeof setTimeout> | null = null;

      const scheduleEndFade = (msLeft: number) => {
        if (fadeT) clearTimeout(fadeT);
        if (removeT) clearTimeout(removeT);
        fadeT = setTimeout(() => {
          if (!node.classList.contains('caught')) node.style.opacity = '0';
        }, Math.max(0, msLeft - 1400));
        removeT = setTimeout(() => {
          if (!node.classList.contains('caught')) node.remove();
        }, Math.max(0, msLeft + 200));
      };
      scheduleEndFade(duration);

      const onCatch = (ev: Event) => {
        ev.stopPropagation();
        if (released || node.classList.contains('caught')) return;

        // Measure head viewport position NOW — before caught CSS changes the layout.
        // getBoundingClientRect forces a sync layout, giving the exact flying position.
        const headEl = node.querySelector('.head') as HTMLElement | null;
        const anchor = headEl ? headEl.getBoundingClientRect() : node.getBoundingClientRect();
        const headCX = anchor.left + anchor.width / 2;
        const headCY = anchor.top + anchor.height / 2;

        // Read the current in-flight transform BEFORE any mutation — getComputedStyle
        // returns a live object in Chrome, so accessing .transform after setting
        // transition:none would re-resolve against the cancelled transition and
        // return the endpoint value, causing a zero-distance release animation.
        const currentTransform = getComputedStyle(node).transform;
        node.style.transition = 'none';
        node.style.transform = currentTransform;
        node.style.opacity = '1';
        node.classList.add('caught');
        const pausedAt = performance.now();
        pausedFraction = Math.min(1, Math.max(0, (pausedAt - traversalStartT) / duration));
        if (fadeT) {
          clearTimeout(fadeT);
          fadeT = null;
        }
        if (removeT) {
          clearTimeout(removeT);
          removeT = null;
        }
        try {
          window.dispatchEvent(
            new CustomEvent('meteor-caught', { detail: { quote: q.text, cluster: q.cluster } }),
          );
        } catch {
          /* noop */
        }

        // Create callout as a layer sibling (not child of node) so it can be
        // positioned freely in viewport space without being clipped by the node.
        const callout = document.createElement('div');
        callout.className = 'meteor-callout';
        // Park off-screen + invisible while we measure callout dimensions.
        callout.style.cssText =
          'position:absolute;top:-9999px;left:-9999px;margin:0;visibility:hidden;pointer-events:auto;z-index:6;';
        const sd = computeStardate();
        callout.innerHTML = `
          <div class="callout-quote">&ldquo;${escapeHtml(q.text)}&rdquo;</div>
          <div class="callout-meta">
            <span class="dim">caught at stardate · ${sd}</span>
          </div>
          <div class="callout-actions">
            <button type="button" class="callout-dismiss">release</button>
            <a class="callout-link" href="/milky-way">read more like this <span class="arr">→</span></a>
          </div>
        `;
        layer.appendChild(callout);
        cleanups.push(() => callout.remove());

        // Place callout using the pre-measured flying-state head position.
        // RAF ensures the callout is in the DOM so offsetWidth/Height are available.
        requestAnimationFrame(() => {
          const cW = callout.offsetWidth;
          const cH = callout.offsetHeight;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const GAP = 16;
          const EDGE = 12;

          // Prefer below the head; flip above if not enough space below.
          const placeAbove = vh - headCY < cH + GAP + EDGE && headCY > cH + GAP + EDGE;
          let top = placeAbove ? headCY - cH - GAP : headCY + GAP;
          let left = headCX - cW / 2;
          left = Math.max(EDGE, Math.min(vw - cW - EDGE, left));
          top = Math.max(EDGE, Math.min(vh - cH - EDGE, top));

          callout.style.top = top + 'px';
          callout.style.left = left + 'px';
          callout.style.visibility = '';
          callout.style.animation = `calloutIn-${placeAbove ? 'up' : 'down'} 280ms cubic-bezier(0.2,0,0.3,1) both`;
        });

        const release = () => {
          if (!node.classList.contains('caught')) return;
          released = true;
          node.style.pointerEvents = 'none';
          node.style.cursor = 'default';
          callout.classList.add('releasing');
          setTimeout(() => callout.remove(), 320);
          node.classList.remove('caught');
          const remaining = Math.max(duration * (1 - pausedFraction), 5_000);

          // Rebase: move left/top to the current viewport position and reset
          // transform to translate(0,0). This gives the browser a clean
          // translate(0)→translate(remainDelta) animation — no matrix form,
          // no ambiguity, guaranteed to fire regardless of prior transform state.
          const m = new DOMMatrix(node.style.transform);
          const remainDx = dx - m.e;  // remaining X displacement
          const remainDy = dy - m.f;  // remaining Y displacement
          node.style.transition = 'none';
          node.style.left = `${startX + m.e}px`;
          node.style.top = `${startY + m.f}px`;
          node.style.transform = 'translate(0px, 0px)';
          node.style.opacity = '0.95';
          void node.offsetHeight;

          requestAnimationFrame(() => {
            node.style.transition = `opacity 800ms ease-out, transform ${remaining}ms cubic-bezier(0.3,0,0.6,1)`;
            node.style.transform = `translate(${remainDx}px, ${remainDy}px)`;
          });

          scheduleEndFade(remaining);
        };
        const dismiss = callout.querySelector('.callout-dismiss');
        dismiss?.addEventListener('click', (e) => {
          e.stopPropagation();
          release();
        });
      };
      node.addEventListener('click', onCatch);
      node.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCatch(e);
        }
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          node.style.transition = `opacity 800ms ease-out, transform ${duration}ms cubic-bezier(0.34, 0.06, 0.6, 1)`;
          node.style.opacity = '0.95';
          node.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });

      cleanups.push(() => {
        if (fadeT) clearTimeout(fadeT);
        if (removeT) clearTimeout(removeT);
      });
    };

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startT = setTimeout(() => {
      launch();
      intervalId = setInterval(launch, intervalMs);
    }, 3500);

    return () => {
      clearTimeout(startT);
      if (intervalId) clearInterval(intervalId);
      cleanups.forEach((fn) => fn());
    };
  }, [enabled, intervalMs, reduced]);

  return <div ref={layerRef} className="meteor-layer" aria-hidden="false" />;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

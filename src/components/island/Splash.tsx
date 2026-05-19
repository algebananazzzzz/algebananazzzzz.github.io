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

  useEffect(() => {
    const tick = () => { if (stardateRef.current) stardateRef.current.textContent = computeStardate(); };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, []);

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
        <div ref={eyebrowRef} className="font-mono text-xs tracking-[0.32em] uppercase text-gray-400 mb-3 inline-flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-star inline-block" />
          singapore · 1.3°n · stardate <span ref={stardateRef} className="text-star" suppressHydrationWarning>{computeStardate()}</span>
        </div>
        <h1 ref={helloRef} className="text-5xl md:text-7xl font-medium tracking-tight">
          Hello, I'm <em className="not-italic text-grad-cosmic inline-block pe-[0.06em]">Daniel</em>
        </h1>
        <div ref={subRef} className="mt-4 font-mono text-sm text-gray-400 tracking-[0.14em] flex items-center justify-center gap-2">
          <span>NUS Computer Sciences</span><span>·</span><span>builder</span><span>·</span><span>brewer</span><span>·</span><span>stargazer</span>
        </div>
      </div>

      <button ref={hintRef} onClick={onClickHint} aria-label="descent into the nebula"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors font-mono text-xs">
        <span>descent into the nebula</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </section>
  );
}

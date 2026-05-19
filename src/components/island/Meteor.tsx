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

  const headRef = useRef<HTMLButtonElement>(null);
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

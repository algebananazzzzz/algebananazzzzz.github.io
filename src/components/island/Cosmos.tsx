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

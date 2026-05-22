import { useEffect, useState } from 'react';

type Accent = 'cosmic' | 'sunset' | 'aurora' | 'nebula';

const layers: Record<Accent, string> = {
  cosmic: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(91, 33, 182, 0.42), transparent 65%),
           radial-gradient(ellipse 60% 50% at 30% 80%, rgba(67, 56, 202, 0.32), transparent 70%)`,
  sunset: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(249, 115, 22, 0.32), transparent 65%),
           radial-gradient(ellipse 60% 50% at 70% 80%, rgba(220, 38, 38, 0.28), transparent 70%)`,
  aurora: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(22, 163, 74, 0.32), transparent 65%),
           radial-gradient(ellipse 60% 50% at 30% 80%, rgba(8, 145, 178, 0.28), transparent 70%)`,
  nebula: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(190, 24, 93, 0.38), transparent 65%),
           radial-gradient(ellipse 60% 50% at 70% 80%, rgba(91, 33, 182, 0.32), transparent 70%)`,
};

export default function AccentOrb() {
  const [accent, setAccent] = useState<Accent>(() => {
    if (typeof document === 'undefined') return 'cosmic';
    const initial = document.documentElement.getAttribute('data-accent');
    return initial && initial in layers ? (initial as Accent) : 'cosmic';
  });
  const [drivenBySections, setDrivenBySections] = useState(false);

  useEffect(() => {
    // Only observe in-flow content sections (home page). Excludes <html>
    // (page-level accent set by Base.astro) and <footer data-accent="nebula">
    // (a sibling of <main>) so sub-pages don't get their accent hijacked when
    // the footer scrolls into view.
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main [data-accent]'));
    if (!sections.length) return;
    setDrivenBySections(true);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const a = visible[0].target.getAttribute('data-accent') as Accent;
          if (a in layers) setAccent(a);
        }
      },
      { threshold: [0.2, 0.5, 0.8] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Only write back to <html data-accent> on pages that actually drive the
    // accent from observed sections (home). On sub-pages Base.astro is the
    // sole source of truth.
    if (!drivenBySections) return;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-accent', accent);
    }
  }, [accent, drivenBySections]);

  return (
    <div className="accent-orb" aria-hidden="true">
      {(Object.keys(layers) as Accent[]).map((k) => (
        <div
          key={k}
          className={`accent-layer ${k === accent ? 'active' : ''}`}
          style={{ background: layers[k] }}
        />
      ))}
    </div>
  );
}

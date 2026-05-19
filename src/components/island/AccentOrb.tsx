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

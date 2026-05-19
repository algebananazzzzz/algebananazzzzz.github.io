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
              <div className="font-mono text-[10px] uppercase tracking-wider text-gray-400">{b.key}</div>
              <div className="text-gray-100 font-medium">{b.item.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{b.item.note}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

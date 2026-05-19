import { useMemo, useState } from 'react';
import NotePanel, { type NotePanelData } from './NotePanel';
import { useReducedComplexity } from '@/lib/useReducedComplexity';

interface NoteWithSpiral extends NotePanelData {
  arm: number;
  t: number;
}

interface Props {
  notes: NoteWithSpiral[];
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
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">filter by cluster</p>
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

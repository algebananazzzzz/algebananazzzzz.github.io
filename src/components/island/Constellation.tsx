import { useMemo, useState } from 'react';
import NotePanel, { type NotePanelData } from './NotePanel';

interface Props {
  notes: NotePanelData[];
  clusters: { id: string; label: string; dotColor: string }[];
  activeCluster?: string;
}

const VB_W = 200, VB_H = 60;

interface PositionedNote extends NotePanelData {
  arm: number;
  t: number;
  cx: number;
  cy: number;
}

function positionFor(note: NotePanelData & { arm: number; t: number }) {
  const cx = note.arm === -1 ? VB_W / 2 : (20 + note.arm * 60) + note.t * 40;
  const cy = note.arm === -1 ? VB_H / 2 : 15 + (note.arm % 2) * 20 + (note.t - 0.5) * 12;
  return { cx, cy };
}

export default function Constellation({ notes, clusters, activeCluster = 'all' }: Props) {
  const clusterById = useMemo(() => Object.fromEntries(clusters.map(c => [c.id, c])), [clusters]);
  const positioned = useMemo(() =>
    notes.map((n: any) => ({ ...n, ...positionFor(n) })) as PositionedNote[],
    [notes]
  );
  const noteById = useMemo(() => Object.fromEntries(positioned.map(n => [n.id, n])), [positioned]);

  const lines = useMemo(() => {
    const set = new Set<string>();
    const out: { a: PositionedNote; b: PositionedNote; key: string }[] = [];
    positioned.forEach(n => n.related?.forEach(rid => {
      const pair = [n.id, rid].sort().join('-');
      if (set.has(pair)) return;
      const b = noteById[rid];
      if (!b) return;
      set.add(pair);
      out.push({ a: n, b, key: pair });
    }));
    return out;
  }, [positioned, noteById]);

  const [selected, setSelected] = useState<NotePanelData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const dim = (cluster: string) =>
    activeCluster === 'all' || cluster === activeCluster ? 1 : 0.18;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto max-h-[360px]" role="img" aria-label="Constellation of notes">
        {lines.map(({ a, b, key }) => (
          <line key={key} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                stroke="rgba(255,199,0,0.18)" strokeWidth={0.12} />
        ))}
        {positioned.map(n => {
          const c = clusterById[n.cluster] ?? { dotColor: '#fff' };
          const r = 0.6 + Math.min(1.4, n.links * 0.2);
          const op = dim(n.cluster);
          return (
            <g key={n.id} style={{ cursor: 'pointer', opacity: op }} onClick={() => setSelected(n)}
               onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
               tabIndex={0} role="button" aria-label={n.title}
               onKeyDown={(e) => { if (e.key === 'Enter') setSelected(n); }}>
              <circle cx={n.cx} cy={n.cy} r={r * 2.4} fill={c.dotColor} opacity="0.15" />
              <circle cx={n.cx} cy={n.cy} r={r} fill={c.dotColor} />
              {hovered === n.id && (
                <text x={n.cx + r + 1.5} y={n.cy + 0.6} fill="#e5e7eb" fontSize="1.6" fontFamily="ui-monospace, monospace">
                  {n.title.slice(0, 28)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <NotePanel note={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

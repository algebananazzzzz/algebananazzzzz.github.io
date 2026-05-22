import { useMemo, useState } from 'react';
import NotePanel, { type NotePanelData } from './NotePanel';

interface Props {
  notes: NotePanelData[];
  clusters: { id: string; label: string; dotColor: string }[];
  activeCluster?: string;
}

const VB_W = 200,
  VB_H = 60;

// Hand-tuned positions from handoff constellation.jsx — spread across the
// 200x60 viewBox so the graph reads as a constellation, not a clump.
const FIXED_XY: Record<string, [number, number]> = {
  yeast: [36, 22],
  saison: [64, 13],
  hopping: [22, 41],
  metaprompt: [116, 18],
  'tool-design': [144, 32],
  'ctx-window': [100, 38],
  eval: [128, 48],
  iam: [172, 14],
  'edge-cache': [180, 42],
  'reading-21': [56, 50],
  garden: [88, 50],
};

// Hardcoded wiki-link edges (matches handoff).
const EDGES: [string, string][] = [
  ['yeast', 'saison'],
  ['yeast', 'hopping'],
  ['saison', 'hopping'],
  ['metaprompt', 'tool-design'],
  ['metaprompt', 'ctx-window'],
  ['metaprompt', 'eval'],
  ['tool-design', 'ctx-window'],
  ['ctx-window', 'eval'],
  ['iam', 'edge-cache'],
  ['garden', 'yeast'],
  ['garden', 'metaprompt'],
  ['garden', 'reading-21'],
  ['tool-design', 'iam'],
];

interface PositionedNote extends NotePanelData {
  cx: number;
  cy: number;
  r: number;
}

function sizeFor(links: number): number {
  return 0.55 + ((Math.min(links, 9) - 2) / 7) * 1.45;
}

function positionFor(id: string, arm: number | undefined, t: number | undefined): [number, number] {
  const fixed = FIXED_XY[id];
  if (fixed) return fixed;
  const a = arm ?? 0;
  const ti = t ?? 0.5;
  const cx = a === -1 ? VB_W / 2 : 20 + a * 60 + ti * 40;
  const cy = a === -1 ? VB_H / 2 : 15 + (a % 2) * 20 + (ti - 0.5) * 12;
  return [cx, cy];
}

export default function Constellation({ notes, clusters, activeCluster = 'all' }: Props) {
  const clusterById = useMemo(() => Object.fromEntries(clusters.map((c) => [c.id, c])), [clusters]);

  const positioned: PositionedNote[] = useMemo(
    () =>
      notes.map((n) => {
        const [cx, cy] = positionFor(n.id, n.arm, n.t);
        return { ...n, cx, cy, r: sizeFor(n.links) };
      }),
    [notes],
  );

  const byId = useMemo(() => Object.fromEntries(positioned.map((n) => [n.id, n])), [positioned]);

  const [selected, setSelected] = useState<NotePanelData | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const hasActive = !!activeCluster && activeCluster !== 'all';
  const activeColor = hasActive ? (clusterById[activeCluster]?.dotColor ?? '#fff') : null;

  const isDim = (n: PositionedNote) => hasActive && n.cluster !== activeCluster;
  const isLit = (n: PositionedNote) => hasActive && n.cluster === activeCluster;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto"
        style={{ aspectRatio: '200/60', maxHeight: 420 }}
        role="img"
        aria-label="Constellation of notes"
      >
        <defs>
          <radialGradient id="cons-haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,236,67,0.45)" />
            <stop offset="100%" stopColor="rgba(255,236,67,0)" />
          </radialGradient>
          {hasActive && activeColor && (
            <radialGradient id="cons-haloActive" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.85" />
              <stop offset="45%" stopColor={activeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
            </radialGradient>
          )}
          <filter id="cons-softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cons-brightGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.6" result="b1" />
            <feGaussianBlur stdDeviation="0.6" in="SourceGraphic" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base edges */}
        <g>
          {EDGES.map(([a, b], i) => {
            const na = byId[a];
            const nb = byId[b];
            if (!na || !nb) return null;
            const bothDim = isDim(na) && isDim(nb);
            const bothActive = isLit(na) && isLit(nb);
            let stroke = 'rgba(255,236,67,0.18)';
            let width = 0.22;
            let dash: string | undefined;
            if (bothActive && activeColor) {
              stroke = activeColor;
              width = 0.42;
            } else if (bothDim) {
              stroke = 'rgba(255,255,255,0.03)';
              dash = '0.6 0.8';
            }
            return (
              <line
                key={`e-${i}`}
                x1={na.cx}
                y1={na.cy}
                x2={nb.cx}
                y2={nb.cy}
                stroke={stroke}
                strokeWidth={width}
                strokeDasharray={dash}
                opacity={bothActive ? 0.85 : 1}
                style={{ transition: 'stroke 250ms, stroke-width 250ms, opacity 250ms' }}
              />
            );
          })}
        </g>

        {/* Hover-highlighted edges from hovered node */}
        {hover && (
          <g>
            {EDGES.filter(([a, b]) => a === hover || b === hover).map(([a, b], i) => {
              const na = byId[a];
              const nb = byId[b];
              if (!na || !nb) return null;
              return (
                <line
                  key={`he-${i}`}
                  x1={na.cx}
                  y1={na.cy}
                  x2={nb.cx}
                  y2={nb.cy}
                  stroke="rgba(255,236,67,0.7)"
                  strokeWidth="0.32"
                />
              );
            })}
          </g>
        )}

        {/* Nodes */}
        <g>
          {positioned.map((n) => {
            const c = clusterById[n.cluster] ?? { dotColor: '#fff' };
            const dimmed = isDim(n);
            const lit = isLit(n);
            const isHover = hover === n.id;
            const rNode = lit ? n.r * 1.25 : n.r;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected(n)}
                tabIndex={0}
                role="button"
                aria-label={n.title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelected(n);
                }}
                style={{
                  cursor: 'pointer',
                  opacity: dimmed ? 0.15 : 1,
                  transition: 'opacity 250ms',
                }}
              >
                {lit && (
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={n.r * 5.5}
                    fill="url(#cons-haloActive)"
                    style={{
                      animation: 'cons-pulse 2.6s ease-in-out infinite',
                      transformOrigin: `${n.cx}px ${n.cy}px`,
                    }}
                  />
                )}
                {!lit && n.r > 1.0 && (
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={n.r * 3.0}
                    fill="url(#cons-haloGrad)"
                    opacity={isHover ? 0.95 : 0.6}
                  />
                )}
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r={rNode}
                  fill={c.dotColor}
                  filter={lit ? 'url(#cons-brightGlow)' : 'url(#cons-softGlow)'}
                />
                {(lit || n.r > 1.4) && (
                  <circle cx={n.cx} cy={n.cy} r={rNode * 0.42} fill="rgba(255,255,255,0.98)" />
                )}
              </g>
            );
          })}
        </g>

        {/* Hover label */}
        {hover &&
          (() => {
            const n = byId[hover];
            if (!n) return null;
            const flip = n.cx > 140;
            const lx = flip ? n.cx - 2.4 : n.cx + 2.4;
            return (
              <g pointerEvents="none">
                <text
                  x={lx}
                  y={n.cy - 1.4}
                  fill="#e5e7eb"
                  fontSize="2.2"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  textAnchor={flip ? 'end' : 'start'}
                  style={{ paintOrder: 'stroke', stroke: '#0f172a', strokeWidth: 0.8 }}
                >
                  {n.title}
                </text>
                <text
                  x={lx}
                  y={n.cy + 1.8}
                  fill="#9ca3af"
                  fontSize="1.6"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  textAnchor={flip ? 'end' : 'start'}
                  style={{ paintOrder: 'stroke', stroke: '#0f172a', strokeWidth: 0.8 }}
                >
                  {n.links} links · {n.status}
                </text>
              </g>
            );
          })()}
      </svg>

      <NotePanel note={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

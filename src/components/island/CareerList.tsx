import { useState, type CSSProperties } from 'react';

export interface CareerEntry {
  id: string;
  span: string;
  role: string;
  org: string;
  summary: string;
  tags: string[];
  starType: string;
}

interface Props {
  entries: CareerEntry[];
  defaultOpenIndex?: number;
}

interface StellarClass {
  stellarClass: string;
  classDesc: string;
  color: string;
  glow: string;
  sizeMul: number;
  bri: number;
}

const STELLAR_BY_KEY: Record<string, StellarClass> = {
  protostar: { stellarClass: 'Protostar', classDesc: 'collapsing, pre-fusion', color: '#dc2626', glow: 'rgba(220, 38, 38, 0.55)', sizeMul: 0.75, bri: 0.6 },
  mainseq: { stellarClass: 'Main-sequence star', classDesc: 'hydrogen fusion, stable burn', color: '#fde047', glow: 'rgba(253, 224, 71, 0.6)', sizeMul: 1.0, bri: 1.0 },
  dwarf: { stellarClass: 'Red Dwarf', classDesc: 'M-type, low-mass, long-burning', color: '#f87171', glow: 'rgba(248, 113, 113, 0.5)', sizeMul: 0.85, bri: 0.7 },
  kmain: { stellarClass: 'K-type', classDesc: 'orange, steady main-sequence', color: '#fdba74', glow: 'rgba(253, 186, 116, 0.55)', sizeMul: 0.95, bri: 0.9 },
  gmain: { stellarClass: 'G-type', classDesc: 'sun-like, balanced fusion', color: '#fde047', glow: 'rgba(253, 224, 71, 0.6)', sizeMul: 1.05, bri: 1.1 },
  bgiant: { stellarClass: 'Blue Giant', classDesc: 'O-type, hot, luminous', color: '#93c5fd', glow: 'rgba(147, 197, 253, 0.65)', sizeMul: 1.3, bri: 1.6 },
  subgiant: { stellarClass: 'Subgiant', classDesc: 'expanding, fusion shell forming', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)', sizeMul: 1.2, bri: 1.2 },
  giant: { stellarClass: 'Red Giant', classDesc: 'expanded, fusing helium', color: '#f87171', glow: 'rgba(248, 113, 113, 0.65)', sizeMul: 1.55, bri: 1.4 },
  whitedwarf: { stellarClass: 'White Dwarf', classDesc: 'compact ember, cooling', color: '#e5e7eb', glow: 'rgba(229, 231, 235, 0.55)', sizeMul: 0.55, bri: 0.45 },
  neutron: { stellarClass: 'Neutron Star', classDesc: 'collapsed, magnetic pulsar', color: '#bae6fd', glow: 'rgba(186, 230, 253, 0.95)', sizeMul: 0.5, bri: 2.0 },
  blackhole: { stellarClass: 'Black Hole', classDesc: 'singular, light-bending', color: '#1e1b4b', glow: 'rgba(192, 132, 252, 0.75)', sizeMul: 0.7, bri: 0.55 },
};

const BASE_SIZE = 12;

export default function CareerList({ entries, defaultOpenIndex = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const list = entries.map((e) => ({
    ...e,
    ...(STELLAR_BY_KEY[e.starType] ?? STELLAR_BY_KEY.mainseq),
  }));

  return (
    <div className="career-list">
      {list.map((e, idx) => {
        const isOpen = idx === openIndex;
        const starSize = Math.round(BASE_SIZE * e.sizeMul);
        const next = list[idx + 1];
        const style = {
          '--row-color': e.color,
          '--row-glow': e.glow,
          '--star-size': `${starSize}px`,
          '--star-bri': e.bri,
          '--next-row-color': next ? next.color : e.color,
          '--next-star-bri': next ? next.bri : 0,
        } as CSSProperties;

        return (
          <button
            key={e.id}
            type="button"
            onClick={() => setOpenIndex(isOpen ? null : idx)}
            aria-expanded={isOpen}
            className={`career-row ${isOpen ? 'open' : ''}`}
            style={style}
          >
            <div className="row-head">
              <span className="star" aria-hidden="true">
                <span className="star-core" />
              </span>
              <span className="span">{e.span}</span>
              <span className="role">
                {e.role}
                <span className="org-sep">·</span>
                <span className="org">{e.org}</span>
              </span>
              <span className="class">{e.stellarClass.toLowerCase()}</span>
              <svg
                className="chev"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <div className="row-body">
              <div className="body-inner">
                <p className="summary">{e.summary}</p>
                <div className="row-meta">
                  <span className="class-desc">
                    <span className="swatch" style={{ background: e.color, color: e.color }} />
                    {e.classDesc}
                  </span>
                  {e.tags.length > 0 && (
                    <div className="tags">
                      {e.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

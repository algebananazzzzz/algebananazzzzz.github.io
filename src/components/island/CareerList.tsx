import { useState, type CSSProperties } from 'react';

export interface StarData {
  type: string;
  stellarClass: string;
  classDesc: string;
  color: string;
  accent: string;
  glow: string;
  sizeMul: number;
  bri: number;
}

export interface CareerEntry {
  id: string;
  date: string;
  role: string;
  org: string;
  summary: string;
  tags: string[];
  star: StarData;
}

interface Props {
  entries: CareerEntry[];
  defaultOpenIndex?: number;
}

const BASE_SIZE = 12;

export default function CareerList({ entries, defaultOpenIndex = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const list = entries.map((e) => ({
    ...e,
    ...e.star,
  }));

  return (
    <div className="career-list">
      {list.map((e, idx) => {
        const isOpen = idx === openIndex;
        const starSize = Math.round(BASE_SIZE * e.sizeMul);
        const cssBri = e.bri / 5;
        const next = list[idx + 1];
        const nextBri = next ? next.bri / 5 : 0;
        const style = {
          '--row-color': e.color,
          '--row-glow': e.glow,
          '--row-accent': e.accent,
          '--star-size': `${starSize}px`,
          '--star-bri': cssBri,
          '--next-row-color': next ? next.color : e.color,
          '--next-star-bri': nextBri,
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
              <span className="date">{e.date}</span>
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
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
                        <span key={tag} className="tag">
                          {tag}
                        </span>
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

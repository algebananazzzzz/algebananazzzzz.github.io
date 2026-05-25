import { useState } from 'react';
import s from './ProjectsList.module.css';

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  tech: string[];
  summary: string;
  bullets: string[];
  role: string;
  impact: string;
  cluster: string;
  href: string;
}

interface Props {
  projects: ProjectItem[];
}

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'cloud', label: 'cloud' },
  { id: 'llm', label: 'llm + agents' },
  { id: 'brewery', label: 'brewery' },
  { id: 'general', label: 'general' },
];

export default function ProjectsList({ projects }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.cluster === filter);

  return (
    <>
      <div className={s.pageFilter}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${s.pageFilterBtn} ${filter === f.id ? s.active : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={s.projectsList}>
        {filtered.map((p) => (
          <article key={p.id} className={s.projectRow}>
            <div className={s.projectRowSide}>
              <div className={s.projectTech} aria-label="stack">
                {p.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className={s.projectRowRole}>{p.role}</div>
              <div className={s.projectRowImpact}>{p.impact}</div>
            </div>
            <div>
              <h2 className={s.projectRowTitle}>{p.title}</h2>
              <p className={s.projectRowTagline}>{p.tagline}</p>
              <p className={s.projectRowSummary}>{p.summary}</p>
              <ul className={s.projectRowBullets}>
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className={s.projectRowCta}>
                <a href={p.href} target="_blank" rel="noreferrer" className="cta-secondary">
                  source
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

import { useState } from 'react';

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
  { id: 'all',     label: 'all' },
  { id: 'cloud',   label: 'cloud' },
  { id: 'llm',     label: 'llm + agents' },
  { id: 'brewery', label: 'brewery' },
  { id: 'general', label: 'general' },
];

const TECH_LABEL: Record<string, string> = {
  aws: 'AWS', react: 'React', tailwindcss: 'Tailwind', gatsby: 'Gatsby',
  docker: 'Docker', kubernetes: 'Kubernetes', terraform: 'Terraform',
};

export default function ProjectsList({ projects }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.cluster === filter);

  return (
    <>
      <div className="page-filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`page-filter-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="projects-list">
        {filtered.map((p) => (
          <article key={p.id} className="project-row">
            <div className="project-row-side">
              <div className="project-tech" aria-label="stack">
                {p.tech.map((t) => (
                  <span key={t} className="tag">{TECH_LABEL[t] ?? t}</span>
                ))}
              </div>
              <div className="project-row-role">{p.role}</div>
              <div className="project-row-impact">{p.impact}</div>
            </div>
            <div className="project-row-body">
              <h2 className="project-row-title">{p.title}</h2>
              <p className="project-row-tagline">{p.tagline}</p>
              <p className="project-row-summary">{p.summary}</p>
              <ul className="project-row-bullets">
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="project-row-cta">
                <a href={p.href} target="_blank" rel="noreferrer" className="cta-secondary">
                  source
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

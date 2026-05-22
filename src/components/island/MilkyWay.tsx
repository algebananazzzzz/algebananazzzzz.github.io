import { useState } from 'react';
import Constellation from './Constellation';
import type { WikiPage, WikiTopic } from '@/types/wiki';

interface Props {
  pages: WikiPage[];
  topics: WikiTopic[];
  baseUrl: string;
}

export default function MilkyWay({ pages, topics, baseUrl }: Props) {
  const [active, setActive] = useState<string>('all');

  return (
    <div className="mw-layout">
      <aside className="mw-side" aria-label="Filter by topic">
        <div className="mw-side-label">filter · topic</div>
        <div className="mw-cluster-list">
          <button
            type="button"
            className={`mw-cluster-btn ${active === 'all' ? 'active' : ''}`}
            onClick={() => setActive('all')}
          >
            <span className="dot" style={{ background: '#e5e7eb' }} />
            <span className="label">all</span>
            <span className="count">{pages.length}</span>
          </button>
          {topics.map((t) => {
            const count = pages.filter((p) => p.topic === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                className={`mw-cluster-btn ${active === t.id ? 'active' : ''}`}
                onClick={() => setActive(t.id)}
              >
                <span className="dot" style={{ background: t.dotColor }} />
                <span className="label">{t.label}</span>
                <span className="count">{count}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="mw-frame">
        <Constellation pages={pages} topics={topics} baseUrl={baseUrl} activeCluster={active} />
      </div>
    </div>
  );
}

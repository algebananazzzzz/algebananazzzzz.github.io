import { useState } from 'react';
import Constellation from './Constellation';
import type { WikiPage, WikiTopic } from '@/types/wiki';
import s from './MilkyWay.module.css';

interface Props {
  pages: WikiPage[];
  topics: WikiTopic[];
  baseUrl: string;
}

export default function MilkyWay({ pages, topics, baseUrl }: Props) {
  const [active, setActive] = useState<string>('all');

  return (
    <div className={s.mwLayout}>
      <aside className={s.mwSide} aria-label="Filter by topic">
        <div className={s.mwSideLabel}>filter · topic</div>
        <div className={s.mwClusterList}>
          <button
            type="button"
            className={`${s.mwClusterBtn} ${active === 'all' ? s.active : ''}`}
            onClick={() => setActive('all')}
          >
            <span className={s.dot} style={{ background: '#e5e7eb' }} />
            <span className={s.label}>all</span>
            <span className={s.count}>{pages.length}</span>
          </button>
          {topics.map((t) => {
            const count = pages.filter((p) => p.topic === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                className={`${s.mwClusterBtn} ${active === t.id ? s.active : ''}`}
                onClick={() => setActive(t.id)}
              >
                <span className={s.dot} style={{ background: t.dotColor }} />
                <span className={s.label}>{t.label}</span>
                <span className={s.count}>{count}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className={s.mwFrame}>
        <Constellation pages={pages} topics={topics} baseUrl={baseUrl} activeCluster={active} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import Constellation from './Constellation';
import type { NotePanelData } from './NotePanel';

interface NoteWithSpiral extends NotePanelData {
  arm: number;
  t: number;
}

interface Props {
  notes: NoteWithSpiral[];
  clusters: { id: string; label: string; dotColor: string }[];
}

export default function MilkyWay({ notes, clusters }: Props) {
  const [active, setActive] = useState<string>('all');

  return (
    <div className="mw-layout">
      <aside className="mw-side" aria-label="Filter by cluster">
        <div className="mw-side-label">filter · cluster</div>
        <div className="mw-cluster-list">
          <button
            type="button"
            className={`mw-cluster-btn ${active === 'all' ? 'active' : ''}`}
            onClick={() => setActive('all')}
          >
            <span className="dot" style={{ background: '#e5e7eb' }} />
            <span className="label">all</span>
            <span className="count">{notes.length}</span>
          </button>
          {clusters.map((c) => {
            const count = notes.filter((n) => n.cluster === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                className={`mw-cluster-btn ${active === c.id ? 'active' : ''}`}
                onClick={() => setActive(c.id)}
              >
                <span className="dot" style={{ background: c.dotColor }} />
                <span className="label">{c.label}</span>
                <span className="count">{count}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="mw-frame">
        <Constellation notes={notes} clusters={clusters} activeCluster={active} />
      </div>
    </div>
  );
}

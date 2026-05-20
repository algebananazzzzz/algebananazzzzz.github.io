import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface NotePanelData {
  id: string;
  title: string;
  excerpt: string;
  cluster: string;
  status: 'seedling' | 'budding' | 'evergreen';
  links: number;
  date: string;
  readTime: string;
  words: number;
  backlinks: string[];
  related: string[];
}

interface Props {
  note: NotePanelData | null;
  onClose: () => void;
}

export default function NotePanel({ note, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!note) return null;

  // Portalled to document.body to escape backdrop-filter containing blocks
  // (mw-frame has backdrop-filter which makes fixed children viewport-unaware)
  return createPortal(
    <>
      <button
        aria-label="close note panel"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(2,6,23,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: 0,
          cursor: 'default',
        }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={note.title}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 201,
          height: '100dvh',
          width: '100%',
          maxWidth: 448,
          background: '#1e293b',
          borderLeft: '1px solid rgba(148,163,184,0.18)',
          padding: '24px',
          overflowY: 'auto',
          fontFamily: 'var(--font-sans)',
          animation: 'noteSlideIn 280ms cubic-bezier(0.4,0,0.2,1) both',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'rgba(148,163,184,0.8)',
            }}
          >
            {note.cluster} · {note.status} · M {(6 - note.links * 0.5).toFixed(1)}
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            style={{
              background: 'none',
              border: 0,
              color: 'rgba(148,163,184,0.8)',
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
              padding: '0 2px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: '#f1f5f9',
            margin: '0 0 12px',
            letterSpacing: '-0.015em',
            lineHeight: 1.2,
          }}
        >
          {note.title}
        </h2>
        <p
          style={{
            color: 'rgba(209,213,219,0.9)',
            lineHeight: 1.65,
            marginBottom: 24,
            fontSize: 15,
          }}
        >
          {note.excerpt}
        </p>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            marginBottom: 24,
          }}
        >
          <dt style={{ color: 'rgba(148,163,184,0.75)' }}>date</dt>
          <dd style={{ color: 'rgba(229,231,235,0.9)', margin: 0 }}>{note.date}</dd>
          <dt style={{ color: 'rgba(148,163,184,0.75)' }}>read</dt>
          <dd style={{ color: 'rgba(229,231,235,0.9)', margin: 0 }}>{note.readTime}</dd>
          <dt style={{ color: 'rgba(148,163,184,0.75)' }}>words</dt>
          <dd style={{ color: 'rgba(229,231,235,0.9)', margin: 0 }}>{note.words}</dd>
          <dt style={{ color: 'rgba(148,163,184,0.75)' }}>links</dt>
          <dd style={{ color: 'rgba(229,231,235,0.9)', margin: 0 }}>{note.links}</dd>
        </dl>

        {note.backlinks.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'rgba(148,163,184,0.75)',
                marginBottom: 8,
              }}
            >
              backlinks
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {note.backlinks.map((b) => (
                <li key={b}>
                  <a
                    href={`/milky-way#${b}`}
                    style={{ fontSize: 13, color: '#FFC700', textDecoration: 'none' }}
                  >
                    ↳ {b}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </>,
    document.body,
  );
}

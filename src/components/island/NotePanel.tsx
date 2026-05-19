import { useEffect } from 'react';

export interface NotePanelData {
  id: string; title: string; excerpt: string; cluster: string;
  status: 'seedling' | 'budding' | 'evergreen';
  links: number; date: string; readTime: string; words: number;
  backlinks: string[]; related: string[];
}

interface Props { note: NotePanelData | null; onClose: () => void; }

export default function NotePanel({ note, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!note) return null;

  return (
    <>
      <button aria-label="close note panel" onClick={onClose}
        className="fixed inset-0 z-40 bg-night/60 backdrop-blur-sm" />
      <aside role="dialog" aria-label={note.title}
        className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-night-soft border-l border-slate-700 p-6 overflow-y-auto">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
            {note.cluster} · {note.status} · M {(6 - note.links * 0.5).toFixed(1)}
          </div>
          <button onClick={onClose} aria-label="close" className="text-gray-400 hover:text-gray-100 text-xl leading-none">×</button>
        </div>
        <h2 className="text-xl font-medium text-gray-100 mb-3">{note.title}</h2>
        <p className="text-gray-300 leading-relaxed mb-6">{note.excerpt}</p>

        <dl className="grid grid-cols-2 gap-y-2 text-xs font-mono mb-6">
          <dt className="text-gray-400">date</dt><dd className="text-gray-300">{note.date}</dd>
          <dt className="text-gray-400">read</dt><dd className="text-gray-300">{note.readTime}</dd>
          <dt className="text-gray-400">words</dt><dd className="text-gray-300">{note.words}</dd>
          <dt className="text-gray-400">links</dt><dd className="text-gray-300">{note.links}</dd>
        </dl>

        {note.backlinks.length > 0 && (
          <section className="mb-4">
            <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">backlinks</p>
            <ul className="space-y-1">
              {note.backlinks.map(b => (
                <li key={b}><a href={`#${b}`} className="text-sm text-star hover:text-star-bright">↳ {b}</a></li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </>
  );
}

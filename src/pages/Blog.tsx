import { useState, useEffect } from 'react';
import { marked } from 'marked';

interface LogEntry {
  id: string;
  title: string;
  html: string;
  date: string;
  preview: string;
}

function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1] : '无标题';
}

function stripFirstHeading(md: string): string {
  return md.replace(/^#\s+.+$/m, '').replace(/^\n+/, '');
}

function htmlToPreview(html: string, maxLen: number): string {
  const text = html.replace(/<[^>]+>/g, '');
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

const modules = import.meta.glob('../data/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontmatter(md: string): { data: Record<string, string>; content: string } {
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, content: md };
  const yaml = match[1];
  const content = md.slice(match[0].length);
  const data: Record<string, string> = {};
  for (const line of yaml.split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return { data, content };
}

function loadEntries(): LogEntry[] {
  const all: LogEntry[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const raw: string = typeof mod === 'string' ? mod : (mod as any).default;
    if (!raw) continue;
    const { data, content } = parseFrontmatter(raw);
    const body = stripFirstHeading(content);
    const html = marked.parse(body, { async: false }) as string;
    const title = (data.title as string) || extractTitle(content);
    const date = (data.date as string) || new Date().toISOString();
    const filename = path.replace(/^.*\/|\.md$/g, '');
    all.push({
      id: filename,
      title,
      html,
      date,
      preview: htmlToPreview(html, 200),
    });
  }
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return all;
}

function Blog() {
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    try {
      return loadEntries();
    } catch (e) {
      console.error('loadEntries failed', e);
      return [];
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept(() => {
        try {
          setError(null);
          setEntries(loadEntries());
        } catch (e: any) {
          setError(e.message || String(e));
        }
      });
    }
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      }) +
      ' ' +
      d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2
        className="section-title"
        style={{ animation: 'fadeInUp 0.5s 0.1s cubic-bezier(0.22,0.61,0.36,1) both', marginBottom: 8 }}
      >
        日志
      </h2>

      {error && (
        <div
          className="glass content-card"
          style={{ textAlign: 'center', padding: '48px 32px', animation: 'fadeInUp 0.5s 0.15s cubic-bezier(0.22,0.61,0.36,1) both', color: '#e74c3c' }}
        >
          <p style={{ fontWeight: 600, marginBottom: 8 }}>加载失败</p>
          <p style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{error}</p>
        </div>
      )}

      {!error && entries.length === 0 && (
        <div
          className="glass content-card"
          style={{ textAlign: 'center', padding: '48px 32px', animation: 'fadeInUp 0.5s 0.15s cubic-bezier(0.22,0.61,0.36,1) both' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>还没有日志。</p>
        </div>
      )}

      {entries.map((entry, i) => {
        const expanded = expandedId === entry.id;

        return (
          <div
            key={entry.id}
            className="glass diary-entry"
            style={{ animation: `fadeInUp 0.45s ${0.12 + i * 0.06}s cubic-bezier(0.22,0.61,0.36,1) both` }}
          >
            <div className="diary-entry-header" onClick={() => setExpandedId(expanded ? null : entry.id)}>
              <div className="diary-entry-info">
                <h3 className="diary-entry-title">{entry.title}</h3>
                <span className="diary-entry-date">{formatDate(entry.date)}</span>
              </div>
            </div>
            <div className={`diary-entry-body ${expanded ? 'expanded' : ''}`}>
              {expanded ? (
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: entry.html }} />
              ) : (
                <p>{entry.preview}</p>
              )}
              {!expanded && entry.preview.endsWith('...') && (
                <span className="diary-expand-hint">点击展开</span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Blog;

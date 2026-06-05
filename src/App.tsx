import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Blog from './pages/Blog';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';

/* =============================================
   THEME HOOK
   ============================================= */

type Theme = 'light' | 'dark' | 'system';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const apply = (t: Theme) => {
      if (t === 'system') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', dark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', t);
      }
    };

    apply(theme);
    localStorage.setItem('theme', theme);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') apply('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const cycle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'));
  }, []);

  return { theme, cycle };
}

/* =============================================
   WEATHER HOOK
   ============================================= */

interface WeatherData {
  temp: number;
  code: number;
}

function weatherLabel(code: number): string {
  if (code === 0) return '晴';
  if (code <= 3) return '多云';
  if (code <= 48) return '雾';
  if (code <= 55) return '小雨';
  if (code <= 65) return '雨';
  if (code <= 75) return '雪';
  if (code <= 82) return '阵雨';
  if (code <= 99) return '雷暴';
  return '--';
}

function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) { setError(true); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const json = await res.json();
          setData({
            temp: Math.round(json.current_weather.temperature),
            code: json.current_weather.weathercode,
          });
        } catch {
          setError(true);
        }
      },
      () => setError(true),
      { timeout: 5000 }
    );
  }, []);

  return { data, error };
}

/* =============================================
   APP
   ============================================= */

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <div className="page-body">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
            </Routes>
            <footer className="footer">
              &copy; {new Date().getFullYear()} aparas — 使用 React + Vite 构建
            </footer>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

/* ===== Navbar ===== */
function Navbar() {
  const location = useLocation();
  const { theme, cycle } = useTheme();

  const links = [
    { to: '/', label: '日志' },
    { to: '/about', label: '关于' },
    { to: '/skills', label: '技能' },
    { to: '/projects', label: '项目' },
  ];

  const themeLabel = theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统';

  const ThemeIcon = () => {
    if (theme === 'light') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    );
    if (theme === 'dark') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    );
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    );
  };

  return (
    <nav className="navbar" style={{ animation: 'fadeInDown 0.6s 0s cubic-bezier(0.22,0.61,0.36,1) both' }}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>aparas</Link>
        <span className="navbar-flag" title="MtF" style={{ animation: `fadeInDown 0.5s 0.06s cubic-bezier(0.22,0.61,0.36,1) both` }}>🏳️‍⚧️</span>
        <a href="https://mtf.wiki" target="_blank" rel="noopener noreferrer" className="navbar-wiki-link" style={{ animation: `fadeInDown 0.5s 0.08s cubic-bezier(0.22,0.61,0.36,1) both` }}>MtF.wiki</a>
        <a href="https://ftm.wiki" target="_blank" rel="noopener noreferrer" className="navbar-wiki-link" style={{ animation: `fadeInDown 0.5s 0.1s cubic-bezier(0.22,0.61,0.36,1) both` }}>FtM.wiki</a>
      </div>
      <div className="navbar-right">
        <NavTimeWeather />
        <ul className="navbar-links">
          {links.map((l, i) => (
            <li key={l.to} style={{ animation: `fadeInDown 0.5s ${0.04 + i * 0.04}s cubic-bezier(0.22,0.61,0.36,1) both` }}>
              <Link
                to={l.to}
                className={location.pathname === l.to ? 'nav-active' : ''}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="theme-toggle"
          onClick={cycle}
          title={`当前：${themeLabel} — 点击切换`}
          style={{ animation: `fadeInDown 0.5s 0.16s cubic-bezier(0.22,0.61,0.36,1) both` }}
        >
          <ThemeIcon />
        </button>
      </div>
    </nav>
  );
}

/* ===== Sidebar ===== */
function Sidebar() {
  const contacts = [
    {
      href: 'mailto:xrarlenal@outlook.com',
      label: 'xrarlenal@outlook.com',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
    {
      href: 'https://github.com/xrarlenal',
      label: 'github.com/xrarlenal',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      ),
    },
    {
      href: 'https://x.com/aparasr',
      label: 'x.com/aparasr',
      icon: <span style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1 }}>𝕏</span>,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="glass sidebar-card" style={{ animation: 'fadeInLeft 0.7s 0.1s cubic-bezier(0.22,0.61,0.36,1) both' }}>
        <div className="avatar" style={{ animation: 'scaleInBounce 0.7s 0.25s cubic-bezier(0.22,0.61,0.36,1) both' }}>a</div>
        <div className="name" style={{ animation: 'fadeInUp 0.5s 0.35s cubic-bezier(0.22,0.61,0.36,1) both' }}>aparas</div>
        <div className="role" style={{ animation: 'fadeInUp 0.5s 0.4s cubic-bezier(0.22,0.61,0.36,1) both' }}>Graphics Engineer</div>
        <div className="sidebar-divider" style={{ animation: 'fadeInUp 0.5s 0.45s cubic-bezier(0.22,0.61,0.36,1) both' }} />
        <div className="sidebar-links">
          {contacts.map((c, i) => (
            <a
              key={c.href}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link"
              style={{ animation: `fadeInUp 0.45s ${0.47 + i * 0.06}s cubic-bezier(0.22,0.61,0.36,1) both` }}
            >
              {c.icon}
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ===== Navbar Time & Weather ===== */
function NavTimeWeather() {
  const [time, setTime] = useState(new Date());
  const { data: weather } = useWeather();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('zh-CN', { hour12: false });

  return (
    <div className="nav-time-weather" style={{ animation: `fadeInDown 0.5s 0.06s cubic-bezier(0.22,0.61,0.36,1) both` }}>
      <span>{timeStr}</span>
      {weather && (
        <>
          <span className="nav-tw-sep">|</span>
          <span>{weatherLabel(weather.code)} {weather.temp}°C</span>
        </>
      )}
    </div>
  );
}

export default App;

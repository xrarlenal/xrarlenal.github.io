function Skills() {
  const graphicsAPI = ['OpenGL', 'OpenGL ES', 'DirectX 9', 'DirectX 11', 'WebGL', 'GLSL/HLSL'];
  const engines = ['Unity', 'Godot', 'Three.js', 'Blender'];
  const web = ['Vue', 'React', 'TypeScript', 'Vite', 'Node.js', 'Tailwind CSS'];
  const fullstack = ['TypeScript'];
  const gfxLangs = ['C/C++', 'Rust'];
  const backend = ['Go', 'Rust'];

  const groups = [
    { label: '图形 API', tags: graphicsAPI, pink: false },
    { label: '引擎 & 工具', tags: engines, pink: true },
    { label: 'Web 前端', tags: web, pink: false },
    { label: '全栈语言', tags: fullstack, pink: true },
    { label: '图形 / 渲染语言', tags: gfxLangs, pink: false },
    { label: '后端语言', tags: backend, pink: true },
  ];

  return (
    <section className="glass content-card" style={{ animation: 'fadeInRight 0.65s 0.1s cubic-bezier(0.22,0.61,0.36,1) both' }}>
      <h2 className="section-title">技能</h2>
      {groups.map((g, gi) => (
        <div key={g.label} style={{ marginBottom: gi < groups.length - 1 ? 18 : 0 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>{g.label}</p>
          <div className="tags-wrap">
            {g.tags.map((t, ti) => (
              <span
                key={t}
                className={`tag${g.pink ? ' pink' : ''}`}
                style={{ animation: `scaleIn 0.4s ${0.18 + gi * 0.1 + ti * 0.05}s cubic-bezier(0.22,0.61,0.36,1) both` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Skills;

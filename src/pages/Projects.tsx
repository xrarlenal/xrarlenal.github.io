function Projects() {
  const projects = [
    {
      title: 'WebGL 着色器编辑器',
      desc: '浏览器端交互式着色器编辑工具，支持 GLSL 实时编写、Uniform 参数调节与 URL 分享。基于 Three.js + React 构建。',
      tags: ['Three.js', 'GLSL', 'React', 'WebGL'],
      link: 'https://github.com/xrarlenal',
    },
    {
      title: 'Godot VFX 工具集',
      desc: 'Godot 引擎自定义着色器与视觉特效集合——体积雾、风格化水体、后处理栈等。',
      tags: ['Godot', 'GLSL', 'VFX'],
      link: 'https://github.com/xrarlenal',
    },
    {
      title: 'Unity 程序化地形',
      desc: '基于 GPU Compute Shader 的程序化地形生成，包含侵蚀模拟与 LOD 系统。',
      tags: ['Unity', 'C#', 'HLSL', 'Compute Shader'],
      link: 'https://github.com/xrarlenal',
    },
    {
      title: '3D 个人主页（本站）',
      desc: '毛玻璃风格个人主页，React + Vite + TypeScript 构建，响应式布局，全站动效。',
      tags: ['React', 'TypeScript', 'Vite'],
      link: 'https://github.com/xrarlenal',
    },
  ];

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="section-title" style={{ animation: 'fadeInUp 0.5s 0.1s cubic-bezier(0.22,0.61,0.36,1) both', marginBottom: 8 }}>
        项目
      </h2>
      <div className="project-grid">
        {projects.map((p, i) => {
          const anim = i % 2 === 0 ? 'fadeInLeft' : 'fadeInRight';
          return (
            <div
              key={p.title}
              className="glass project-card"
              style={{ animation: `${anim} 0.6s ${0.14 + (Math.floor(i / 2)) * 0.1}s cubic-bezier(0.22,0.61,0.36,1) both` }}
            >
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="tags-wrap">
                {p.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                查看
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;

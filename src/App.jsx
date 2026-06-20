import { useState, useEffect, useRef } from "react";
import profileData from "./data/profile.json";
import skillsData from "./data/skills.json";
import experienceData from "./data/experience.json";
import projectsData from "./data/projects.json";

// ==================== Particles Background ====================
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.35)"; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(p.x - particles[j].x, p.y - particles[j].y);
          if (dist < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 130)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

// ==================== Animated Counter ====================
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let cur = 0; const step = target / 60;
    const t = setInterval(() => { cur += step; if (cur >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [started, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ==================== Navbar ====================
function Navbar({ active }) {
  const items = [
    { id: "hero", label: "档案" }, { id: "skills", label: "技能树" },
    { id: "experience", label: "副本" }, { id: "projects", label: "项目" }, { id: "contact", label: "联系" },
  ];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,15,0.88)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "center", gap: "1.5rem", padding: "0.75rem 1rem" }}>
      {items.map(s => (
        <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
          style={{ background: "none", border: "none", cursor: "pointer", color: active === s.id ? "var(--cyan)" : "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", padding: "0.25rem 0.6rem", borderRadius: "4px", transition: "all 0.3s", textShadow: active === s.id ? "0 0 8px rgba(0,212,255,0.5)" : "none" }}>
          <span style={{ opacity: 0.4 }}>{">"}</span> {s.label}
        </button>
      ))}
    </nav>
  );
}

// ==================== Hero Section ====================
function HeroSection() {
  const [typed, setTyped] = useState("");
  const full = profileData.slogan;
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { if (i <= full.length) { setTyped(full.slice(0, i)); i++; } else clearInterval(t); }, 60);
    return () => clearInterval(t);
  }, []);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top - r.height / 2) / r.height) * -6, y: ((e.clientX - r.left - r.width / 2) / r.width) * 6 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative" }}>
      <div ref={cardRef} className="hero-card" onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: "20px", padding: "3rem", maxWidth: "560px", width: "100%", textAlign: "center", transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.15s ease-out", boxShadow: "0 0 60px rgba(0,212,255,0.04)" }}>
        {/* Avatar */}
        <div style={{ width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto 1.5rem", background: "linear-gradient(135deg, var(--cyan), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 0 30px rgba(0,212,255,0.25)", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fff" }}>
          CY
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", color: "var(--text-bright)", marginBottom: "0.3rem", letterSpacing: "0.05em" }}>
          {profileData.name}
        </h1>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--cyan)", marginBottom: "0.8rem", textShadow: "0 0 10px rgba(0,212,255,0.3)" }}>
          {profileData.title}
        </div>

        {/* Typed slogan */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-dim)", minHeight: "1.4rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          <span style={{ opacity: 0.4 }}>// </span>{typed}<span style={{ animation: "blink 1s step-end infinite", color: "var(--cyan)" }}>|</span>
        </div>

        {/* Education */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
          {profileData.education.map((edu, i) => (
            <div key={i} style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.8 }}>
              <span style={{ color: "var(--purple)", fontFamily: "var(--font-mono)" }}>{edu.school}</span>
              <br />{edu.degree1}
              <br />{edu.degree2}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.2rem" }}>
          {profileData.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", color: "var(--cyan)", fontWeight: 600, textShadow: "0 0 10px rgba(0,212,255,0.25)" }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: "0.15rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "2rem", color: "var(--text-faint)", fontSize: "0.72rem", fontFamily: "var(--font-mono)", animation: "float 2.5s ease-in-out infinite" }}>
        ↓ SCROLL TO EXPLORE ↓
      </div>
    </section>
  );
}

// ==================== Skill Tree Section ====================
function SkillNode({ skill, color, x, y, delay, visible }) {
  const [hovered, setHovered] = useState(false);
  const brightness = skill.level / skill.maxLevel;
  const r = 22;
  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "pointer" }}>
      {/* Pulse ring for mastered */}
      {brightness >= 1 && visible && (
        <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4">
          <animate attributeName="r" from={r} to={r + 10} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Hover ring */}
      {hovered && (
        <circle cx={x} cy={y} r={r + 6} fill="none" stroke={color} strokeWidth="1" opacity="0.3">
          <animate attributeName="r" from={r + 4} to={r + 14} dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Node circle */}
      <circle cx={x} cy={y} r={r} fill="rgba(10,10,15,0.92)" stroke={color} strokeWidth={brightness > 0.5 ? 2 : 1}
        opacity={visible ? (0.3 + brightness * 0.7) : 0} style={{ transition: `opacity 0.5s ease ${delay}s` }} />
      {/* Label */}
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={visible ? "#e0e0e0" : "transparent"}
        fontSize="9" fontFamily="var(--font-mono)" style={{ transition: `fill 0.5s ease ${delay}s`, pointerEvents: "none" }}>
        {skill.name.length > 7 ? skill.name.slice(0, 6) + ".." : skill.name}
      </text>
      {/* Stars */}
      <text x={x} y={y + r + 13} textAnchor="middle" fill={visible ? color : "transparent"} fontSize="7.5" opacity="0.7"
        style={{ transition: `fill 0.5s ease ${delay}s`, pointerEvents: "none" }}>
        {"★".repeat(skill.level)}{"☆".repeat(skill.maxLevel - skill.level)}
      </text>
      {/* Tooltip */}
      {hovered && (
        <g>
          <rect x={x - 95} y={y - r - 58} width={190} height={46} rx={8} fill="rgba(10,10,20,0.96)" stroke={color} strokeWidth="1" />
          <text x={x} y={y - r - 38} textAnchor="middle" fill="#e0e0e0" fontSize="10.5" fontFamily="var(--font-mono)">
            {skill.name} · {skill.years}年经验
          </text>
          <text x={x} y={y - r - 21} textAnchor="middle" fill="#9ca3af" fontSize="8.5">{skill.desc}</text>
        </g>
      )}
    </g>
  );
}

function SkillTreeSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={ref} style={{ minHeight: "100vh", padding: "6rem 1.5rem 4rem" }}>
      <h2 className="section-title"><span className="neon-cyan">{"<"}</span> 技能树 <span className="neon-cyan">{"/>"}</span></h2>
      <p className="section-subtitle">// hover 节点查看详细技能信息</p>
      <div className="skills-grid" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center", maxWidth: "960px", margin: "0 auto" }}>
        {skillsData.branches.map((branch, bi) => (
          <div key={branch.name} style={{ flex: "1 1 420px", maxWidth: "460px", background: "var(--bg-card)", borderRadius: "16px", border: `1px solid ${branch.color}18`, padding: "1.5rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", color: branch.color, marginBottom: "1rem", textShadow: `0 0 8px ${branch.color}33` }}>
              {branch.icon} [{branch.name}]
            </div>
            <svg viewBox="0 0 420 170" style={{ width: "100%", height: "auto" }}>
              {branch.skills.map((skill, si) => {
                const cols = Math.min(branch.skills.length, 2);
                const row = Math.floor(si / cols);
                const col = si % cols;
                const x = 105 + col * 210;
                const y = 45 + row * 75;
                let line = null;
                if (si > 0 && si % cols !== 0) {
                  const px = 105 + (col - 1) * 210;
                  const py = 45 + row * 75;
                  line = <line x1={px + 22} y1={py} x2={x - 22} y2={y} stroke={branch.color} strokeWidth="1" opacity={visible ? 0.25 : 0} strokeDasharray="4,4"
                    style={{ transition: `opacity 0.5s ease ${si * 0.15}s` }} />;
                }
                if (si >= cols) {
                  const px = 105 + col * 210;
                  const py = 45 + (row - 1) * 75;
                  line = <line x1={px} y1={py + 22} x2={x} y2={y - 22} stroke={branch.color} strokeWidth="1" opacity={visible ? 0.2 : 0} strokeDasharray="4,4"
                    style={{ transition: `opacity 0.5s ease ${si * 0.15}s` }} />;
                }
                return (
                  <g key={skill.id}>
                    {line}
                    <SkillNode skill={skill} color={branch.color} x={x} y={y} delay={si * 0.15} visible={visible} />
                  </g>
                );
              })}
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== Experience Section ====================
function ExperienceSection() {
  const [expanded, setExpanded] = useState(0);
  const { experiences } = experienceData;

  return (
    <section id="experience" style={{ minHeight: "100vh", padding: "6rem 1.5rem 4rem" }}>
      <h2 className="section-title"><span className="neon-purple">{"<"}</span> 职业副本 <span className="neon-purple">{"/>"}</span></h2>
      <p className="section-subtitle">// 点击展开查看每段经历的成就详情</p>

      <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative" }}>
        {/* Timeline line */}
        <div style={{ position: "absolute", left: "20px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(to bottom, var(--cyan), var(--purple), #3c8cff)", opacity: 0.25 }} />

        {experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: "2rem", paddingLeft: "52px", position: "relative" }}>
            {/* Timeline dot */}
            <div style={{ position: "absolute", left: "12px", top: "8px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--bg)", border: `2px solid ${exp.color}`, boxShadow: `0 0 12px ${exp.color}44` }} />

            <div onClick={() => setExpanded(expanded === i ? -1 : i)} style={{
              background: expanded === i ? "var(--bg-card-hover)" : "var(--bg-card)",
              borderRadius: "14px", border: `1px solid ${expanded === i ? exp.color + "44" : exp.color + "18"}`,
              padding: "1.2rem 1.5rem", cursor: "pointer", transition: "all 0.35s ease",
              boxShadow: expanded === i ? `0 0 24px ${exp.color}0a` : "none"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.05rem", color: "var(--text-bright)", margin: 0 }}>{exp.company}</h3>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.15rem" }}>{exp.role} · {exp.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: exp.color, background: `${exp.color}12`, padding: "0.2rem 0.6rem", borderRadius: "4px", whiteSpace: "nowrap" }}>
                    {exp.period}
                  </span>
                  {exp.award && <div style={{ fontSize: "0.7rem", color: "#fbbf24", marginTop: "0.3rem" }}>🏆 {exp.award}</div>}
                </div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.6rem", lineHeight: 1.6 }}>{exp.scope}</div>

              {/* Achievements (expandable) */}
              <div style={{ maxHeight: expanded === i ? "800px" : "0", overflow: "hidden", transition: "max-height 0.5s ease" }}>
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>
                    成就解锁 ({exp.achievements.length}):
                  </div>
                  {exp.achievements.map((ach, j) => (
                    <div key={j} style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "1.3rem", lineHeight: 1, flexShrink: 0 }}>{ach.icon}</span>
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: exp.color, marginBottom: "0.2rem" }}>{ach.title}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.6 }}>{ach.desc}</div>
                        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                          {ach.tags?.map(t => <span key={t} className="tag" style={{ background: `${exp.color}0d`, color: exp.color, borderColor: `${exp.color}25` }}>{t}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== Projects Section ====================
function ProjectsSection() {
  const { projects } = projectsData;
  return (
    <section id="projects" style={{ minHeight: "80vh", padding: "6rem 1.5rem 4rem" }}>
      <h2 className="section-title"><span style={{ color: "var(--teal)" }}>{"<"}</span> 重点项目 <span style={{ color: "var(--teal)" }}>{"/>"}</span></h2>
      <p className="section-subtitle">// 核心产品与项目成果展示</p>

      <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
        {projects.map((proj, i) => (
          <div key={i} className={`project-card ${proj.size}`} style={{
            gridColumn: proj.size === "large" ? "span 2" : "span 1",
            background: "var(--bg-card)", borderRadius: "16px",
            border: `1px solid ${proj.color}15`, padding: "1.5rem",
            transition: "all 0.3s ease", cursor: "default",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${proj.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${proj.color}0a`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${proj.color}15`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--text-bright)", marginBottom: "0.3rem" }}>{proj.name}</h3>
            <div style={{ fontSize: "0.78rem", color: proj.color, marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>{proj.subtitle}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
              {proj.highlights.map((h, j) => (
                <li key={j} style={{ fontSize: "0.8rem", color: "var(--text)", padding: "0.25rem 0", paddingLeft: "1rem", position: "relative", lineHeight: 1.6 }}>
                  <span style={{ position: "absolute", left: 0, color: proj.color, opacity: 0.6 }}>▸</span> {h}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {proj.tags?.map(t => <span key={t} className="tag" style={{ background: `${proj.color}0d`, color: proj.color, borderColor: `${proj.color}20` }}>{t}</span>)}
            </div>
            {proj.metrics && <div style={{ marginTop: "0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-faint)" }}>{proj.metrics}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== Contact Section ====================
function ContactSection() {
  const [copied, setCopied] = useState("");
  const copy = (text, label) => { navigator.clipboard?.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 2000); };
  const links = [
    { label: "email", value: profileData.contact.email, icon: "📧" },
    { label: "github", value: profileData.contact.github, icon: "💻" },
    { label: "linkedin", value: profileData.contact.linkedin, icon: "🔗" },
  ];
  return (
    <section id="contact" style={{ minHeight: "50vh", padding: "6rem 1.5rem 4rem" }}>
      <h2 className="section-title"><span style={{ color: "var(--teal)" }}>{"<"}</span> 建立连接 <span style={{ color: "var(--teal)" }}>{"/>"}</span></h2>
      <div style={{ maxWidth: "480px", margin: "0 auto", background: "var(--bg-card)", borderRadius: "14px", border: "1px solid rgba(0,212,255,0.08)", padding: "1.5rem", fontFamily: "var(--font-mono)" }}>
        <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginBottom: "1rem" }}>
          ~/contact $ <span style={{ color: "var(--teal)" }}>cat connections.json</span>
        </div>
        {links.map(link => (
          <div key={link.label} onClick={() => copy(link.value, link.label)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 1rem", marginBottom: "0.5rem", background: "rgba(255,255,255,0.015)", borderRadius: "8px", border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.18)"; e.currentTarget.style.background = "rgba(0,212,255,0.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>
              <span style={{ marginRight: "0.5rem" }}>{link.icon}</span>
              <span style={{ color: "var(--text-dim)" }}>{link.label}:</span>{" "}
              <span className="neon-cyan">{link.value}</span>
            </span>
            <span style={{ fontSize: "0.68rem", color: copied === link.label ? "#22c55e" : "var(--text-faint)" }}>
              {copied === link.label ? "✓ copied" : "click to copy"}
            </span>
          </div>
        ))}
        <div style={{ marginTop: "1.2rem", textAlign: "center", fontSize: "0.7rem", color: "var(--text-faint)" }}>
          <span style={{ color: "var(--teal)" }}>TIP:</span> 键盘输入 <span style={{ color: "var(--purple)", background: "rgba(168,85,247,0.1)", padding: "0.1rem 0.4rem", borderRadius: "3px" }}>hire</span> 解锁彩蛋
        </div>
      </div>
    </section>
  );
}

// ==================== App ====================
export default function App() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const onScroll = () => {
      for (const id of ["contact", "projects", "experience", "skills", "hero"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Easter egg
  useEffect(() => {
    let buf = "";
    const handler = (e) => {
      buf += e.key.toLowerCase();
      if (buf.length > 10) buf = buf.slice(-10);
      if (buf.includes("hire")) {
        buf = "";
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(10,10,15,0.92);animation:fadeIn 0.5s ease;";
        overlay.innerHTML = `<div style="text-align:center;animation:float 2s ease-in-out infinite">
          <div style="font-size:4rem;margin-bottom:1rem">🎉</div>
          <div style="font-family:var(--font-mono);font-size:1.5rem;color:var(--cyan);text-shadow:0 0 20px rgba(0,212,255,0.5);margin-bottom:0.5rem">成就解锁！</div>
          <div style="font-size:0.9rem;color:var(--text-dim);max-width:320px;line-height:1.6">恭喜你发现了隐藏成就！<br/>这说明你是一个注重细节的人。<br/>期待与您的合作 ✨</div>
          <div style="margin-top:1.5rem;font-size:0.7rem;color:var(--text-faint);font-family:var(--font-mono)">点击任意处关闭</div>
        </div>`;
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 6000);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", position: "relative" }}>
      <Particles />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active={active} />
        <HeroSection />
        <SkillTreeSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
        <footer style={{ textAlign: "center", padding: "2rem", color: "var(--text-faint)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", borderTop: "1px solid var(--border)" }}>
          {"<"} Built with React + Vite {" | "} Deployed on GitHub Pages {"/>"}
        </footer>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}

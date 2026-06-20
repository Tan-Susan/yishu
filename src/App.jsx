import { useState, useEffect, useRef } from "react";
import profileData from "./data/profile.json";
import skillsData from "./data/skills.json";
import experienceData from "./data/experience.json";
import projectsData from "./data/projects.json";

// ==================== Particles Background ====================
function Particles() {
  const c = useRef(null);
  useEffect(() => {
    const cv = c.current; if (!cv) return;
    const ctx = cv.getContext("2d"); let af; const ps = [];
    const rs = () => { cv.width = cv.parentElement.offsetWidth; cv.height = cv.parentElement.offsetHeight; };
    rs(); window.addEventListener("resize", rs);
    for (let i = 0; i < 40; i++) ps.push({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.2 + 0.4,
    });
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cv.width) p.vx *= -1;
        if (p.y < 0 || p.y > cv.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.3)"; ctx.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(p.x - ps[j].x, p.y - ps[j].y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      af = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(af); window.removeEventListener("resize", rs); };
  }, []);
  return <canvas ref={c} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

// ==================== Animated Counter ====================
function Counter({ target, suffix = "" }) {
  const [v, setV] = useState(0), ref = useRef(null), [go, setGo] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !go) setGo(true); }, { threshold: 0.5 });
    if (ref.current) o.observe(ref.current); return () => o.disconnect();
  }, [go]);
  useEffect(() => {
    if (!go) return;
    let cur = 0; const step = target / 60;
    const t = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(t); } else setV(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [go, target]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

// ==================== Left Panel: Profile Card ====================
function ProfileCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(0,212,255,0.1)", borderRadius: "20px",
      padding: "2.5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Subtle scan lines */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "20px",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
        pointerEvents: "none",
      }} />

      {/* Avatar */}
      <div style={{
        width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 1.2rem",
        background: "linear-gradient(135deg, #00d4ff, #a855f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.8rem", boxShadow: "0 0 28px rgba(0,212,255,0.25)",
        fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fff", position: "relative",
      }}>CY</div>

      <h1 style={{
        fontFamily: "var(--font-mono)", fontSize: "1.7rem", color: "var(--text-bright)",
        marginBottom: "0.3rem", letterSpacing: "0.05em", position: "relative",
      }}>{profileData.name}</h1>

      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--cyan)",
        marginBottom: "0.5rem", textShadow: "0 0 10px rgba(0,212,255,0.3)", position: "relative",
      }}>{profileData.title}</div>

      {profileData.subtitle && (
        <div style={{
          fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "1.2rem",
          position: "relative", letterSpacing: "0.08em",
        }}>{profileData.subtitle}</div>
      )}

      {/* Education */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1.2rem", position: "relative" }}>
        {profileData.education.map((edu, i) => (
          <div key={i} style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.9 }}>
            <span style={{ color: "var(--purple)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{edu.school}</span><br />
            {edu.degree1}<br />{edu.degree2}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${Math.min(profileData.stats.length, 2)}, 1fr)`,
        gap: "0.8rem", borderTop: "1px solid var(--border)", paddingTop: "1rem", position: "relative",
      }}>
        {profileData.stats.map(s => (
          <div key={s.label} style={{
            background: "rgba(0,212,255,0.04)", borderRadius: "10px", padding: "0.7rem",
            border: "1px solid rgba(0,212,255,0.06)",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "1.4rem", color: "var(--cyan)",
              fontWeight: 600, textShadow: "0 0 10px rgba(0,212,255,0.2)",
            }}><Counter target={s.value} suffix={s.suffix} /></div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: "0.15rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Contact */}
      {profileData.contact && (
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: "0.8rem", marginTop: "1rem",
          position: "relative", fontSize: "0.75rem", color: "var(--text-dim)",
          fontFamily: "var(--font-mono)", lineHeight: 1.8,
        }}>
          {profileData.contact.email && <div>📧 {profileData.contact.email}</div>}
          {profileData.contact.tel && <div>📱 {profileData.contact.tel}</div>}
        </div>
      )}
    </div>
  );
}

// ==================== Left Panel: Skills (Simplified) ====================
function SkillTree() {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h2 style={{
        fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "var(--text-bright)",
        marginBottom: "1rem",
      }}><span className="neon-cyan">技能树</span></h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {skillsData.branches.map((branch) => (
          <div key={branch.name} style={{
            background: "rgba(255,255,255,0.02)", borderRadius: "14px",
            border: `1px solid ${branch.color}15`, padding: "1rem 1.2rem",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: branch.color,
              marginBottom: "0.7rem", textShadow: `0 0 6px ${branch.color}33`,
            }}>{branch.icon} {branch.name}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {branch.skills.map((skill) => (
                <div key={skill.id} style={{
                  display: "flex", alignItems: "baseline", gap: "0.6rem",
                  padding: "0.35rem 0",
                }}>
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                    background: branch.color, boxShadow: `0 0 6px ${branch.color}55`,
                    marginTop: "0.4rem",
                  }} />
                  <div>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.8rem",
                      color: "var(--text-bright)",
                    }}>{skill.name}</span>
                    <span style={{
                      fontSize: "0.75rem", color: "var(--text-dim)",
                      marginLeft: "0.5rem",
                    }}>{skill.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Right Panel: Experience List ====================
function ExperienceList({ expanded, setExpanded, onProjectClick }) {
  const { experiences } = experienceData;
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: "16px", top: "8px", bottom: "8px", width: "2px",
        background: "linear-gradient(to bottom, #00d4ff, #a855f7, #3c8cff)", opacity: 0.2,
      }} />
      {experiences.map((exp, i) => (
        <div key={i} style={{ marginBottom: "1.5rem", paddingLeft: "46px", position: "relative" }}>
          <div style={{
            position: "absolute", left: "8px", top: "10px", width: "18px", height: "18px",
            borderRadius: "50%", background: "var(--bg)", border: `2px solid ${exp.color}`,
            boxShadow: `0 0 10px ${exp.color}44`,
          }} />
          <div onClick={() => setExpanded(expanded === i ? -1 : i)} style={{
            background: expanded === i ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.02)",
            borderRadius: "14px", border: `1px solid ${expanded === i ? exp.color + "40" : exp.color + "15"}`,
            padding: "1.2rem 1.5rem", cursor: "pointer", transition: "all 0.35s ease",
            boxShadow: expanded === i ? `0 0 20px ${exp.color}08` : "none",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.05rem", color: "var(--text-bright)", margin: 0 }}>{exp.company}</h3>
                <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.15rem" }}>{exp.role} · {exp.location}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: exp.color, background: `${exp.color}12`, padding: "0.2rem 0.6rem", borderRadius: "4px", whiteSpace: "nowrap" }}>{exp.period}</span>
                {exp.award && <div style={{ fontSize: "0.7rem", color: "#fbbf24", marginTop: "0.3rem" }}>🏆 {exp.award}</div>}
              </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.6rem", lineHeight: 1.7 }}>{exp.scope}</div>

            {/* Expandable */}
            <div style={{ maxHeight: expanded === i ? "2000px" : "0", overflow: "hidden", transition: "max-height 0.5s ease" }}>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>
                  成就解锁 ({exp.achievements.length}):
                </div>
                {exp.achievements.map((ach, j) => (
                  <div key={j} style={{ display: "flex", gap: "0.8rem", marginBottom: "0.9rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.2rem", lineHeight: 1, flexShrink: 0 }}>{ach.icon}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: exp.color, marginBottom: "0.2rem" }}>{ach.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.6 }}>{ach.desc}</div>
                      <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
                        {ach.tags?.map(t => <span key={t} className="tag" style={{ background: `${exp.color}0d`, color: exp.color, borderColor: `${exp.color}22` }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Nested Projects */}
                {exp.projects && exp.projects.length > 0 && (
                  <div style={{ marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>
                      关联项目 ({exp.projects.length}):
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {exp.projects.map((proj, pi) => (
                        <div key={pi} onClick={(e) => { e.stopPropagation(); onProjectClick(proj, exp); }}
                          style={{
                            background: "rgba(255,255,255,0.015)", borderRadius: "10px",
                            border: `1px solid ${proj.color}12`, padding: "0.9rem 1.2rem",
                            cursor: "pointer", transition: "all 0.3s ease",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = `${proj.color}35`; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = `${proj.color}12`; e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-bright)" }}>{proj.name}</span>
                              <span style={{ fontSize: "0.72rem", color: proj.color, marginLeft: "0.6rem", fontFamily: "var(--font-mono)" }}>{proj.subtitle}</span>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== Mermaid Renderer Hook ====================
function useMermaid(containerRef) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const blocks = el.querySelectorAll(".mermaid-src");
    if (blocks.length === 0) return;
    const render = async () => {
      const m = window.mermaid;
      if (!m) { setTimeout(render, 300); return; }
      for (const block of blocks) {
        if (block.dataset.rendered) continue;
        try {
          const id = `mermaid-${Math.random().toString(36).slice(2, 8)}`;
          const { svg } = await m.render(id, block.textContent.trim());
          block.innerHTML = svg;
          block.dataset.rendered = "true";
        } catch (err) {
          block.innerHTML = `<pre style="color:#ff6b6b;font-size:0.75rem">${err.message}</pre>`;
        }
      }
    };
    render();
  });
}

// ==================== Right Panel: Project Detail Page ====================
function renderDetail(detail) {
  if (!detail) return null;
  const parts = detail.split(/(```mermaid[\s\S]*?```)/g);
  return parts.map((part, i) => {
    const m = part.match(/^```mermaid\n?([\s\S]*?)```$/);
    if (m) {
      return <div key={i} className="mermaid-src" style={{ margin: "1rem 0", textAlign: "center" }}>{m[1].trim()}</div>;
    }
    return part.trim() ? <p key={i} style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.8, marginBottom: "0.8rem" }}>{part.trim()}</p> : null;
  });
}

function ProjectDetailPage({ project, company, onBack }) {
  const [fadeIn, setFadeIn] = useState(false);
  const detailRef = useRef(null);
  useMermaid(detailRef);
  useEffect(() => { requestAnimationFrame(() => setFadeIn(true)); }, []);

  return (
    <section style={{
      opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        background: "none", border: `1px solid var(--border)`, borderRadius: "8px",
        color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.78rem",
        padding: "0.5rem 1rem", cursor: "pointer", marginBottom: "2rem",
        transition: "all 0.3s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = company.color; e.currentTarget.style.color = company.color; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
      >
        ← 返回 {company.company}
      </button>

      {/* Project header */}
      <div style={{
        background: "rgba(255,255,255,0.02)", borderRadius: "16px",
        border: `1px solid ${project.color}18`, padding: "2rem", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", fontFamily: "var(--font-mono)", marginBottom: "0.5rem" }}>
          {company.company} / {project.name}
        </div>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", color: "var(--text-bright)", marginBottom: "0.3rem" }}>
          {project.name}
        </h2>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: project.color, marginBottom: "1rem", textShadow: `0 0 8px ${project.color}33` }}>
          {project.subtitle}
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {project.tags?.map(t => <span key={t} className="tag" style={{ background: `${project.color}0d`, color: project.color, borderColor: `${project.color}18` }}>{t}</span>)}
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: "rgba(255,255,255,0.02)", borderRadius: "14px",
        border: "1px solid var(--border)", padding: "1.5rem 2rem", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>
          项目概述
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.8 }}>
          {project.description}
        </div>
      </div>

      {/* Images */}
      {project.images && project.images.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: project.images.length === 1 ? "1fr" : "repeat(2, 1fr)",
          gap: "1rem", marginBottom: "1.5rem",
        }}>
          {project.images.map((img, idx) => (
            <div key={idx} style={{
              borderRadius: "12px", overflow: "hidden",
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,0.2)",
            }}>
              <img src={img.src || img} alt={img.alt || project.name}
                style={{ width: "100%", height: "auto", display: "block" }}
                loading="lazy"
              />
              {img.caption && (
                <div style={{
                  padding: "0.5rem 0.8rem", fontSize: "0.72rem",
                  color: "var(--text-dim)", fontFamily: "var(--font-mono)",
                  borderTop: "1px solid var(--border)",
                }}>{img.caption}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail area — supports mermaid diagrams */}
      <div ref={detailRef} style={{
        background: "rgba(255,255,255,0.02)", borderRadius: "14px",
        border: "1px solid var(--border)", padding: "1.5rem 2rem",
        minHeight: "200px",
      }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>
          详细设计
        </div>
        {project.detail ? (
          <div>{renderDetail(project.detail)}</div>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: "120px", color: "var(--text-faint)", fontFamily: "var(--font-mono)",
            fontSize: "0.8rem", fontStyle: "italic", border: "1px dashed var(--border)",
            borderRadius: "8px",
          }}>
            项目详细文档待补充
          </div>
        )}
      </div>
    </section>
  );
}

// ==================== Right Panel: Experience (with view switching) ====================
function Experience({ onProjectClick }) {
  const [expanded, setExpanded] = useState(0);

  return (
    <section>
      <h2 style={{
        fontFamily: "var(--font-mono)", fontSize: "1.3rem", color: "var(--text-bright)",
        marginBottom: "0.4rem",
      }}><span className="neon-purple">职业副本</span></h2>
      <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginBottom: "2rem" }}>
        点击展开查看成就，点击项目进入详情
      </p>
      <ExperienceList expanded={expanded} setExpanded={setExpanded} onProjectClick={onProjectClick} />
    </section>
  );
}

// ==================== Right Panel: Standalone Projects ====================
function StandaloneProjects() {
  const { projects } = projectsData;
  if (!projects || projects.length === 0) return null;

  return (
    <section style={{ marginTop: "3rem" }}>
      <h2 style={{
        fontFamily: "var(--font-mono)", fontSize: "1.3rem", color: "var(--text-bright)",
        marginBottom: "0.4rem",
      }}><span style={{ color: "var(--teal)" }}>个人项目</span></h2>
      <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginBottom: "1.5rem" }}>
        独立项目与创作
      </p>

      {projects.map((proj, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.02)", borderRadius: "14px",
          border: `1px solid ${proj.color}12`, padding: "1.5rem", transition: "all 0.3s ease",
          marginBottom: "1rem",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${proj.color}35`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${proj.color}08`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${proj.color}12`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--text-bright)", marginBottom: "0.3rem" }}>
            {proj.name}
          </h3>
          <div style={{ fontSize: "0.78rem", color: proj.color, marginBottom: "0.8rem", fontFamily: "var(--font-mono)" }}>
            {proj.subtitle}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
            {proj.highlights.map((h, j) => (
              <li key={j} style={{
                fontSize: "0.8rem", color: "var(--text)", padding: "0.25rem 0", paddingLeft: "1rem",
                position: "relative", lineHeight: 1.6,
              }}>
                <span style={{ position: "absolute", left: 0, color: proj.color, opacity: 0.6 }}>▸</span>{h}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {proj.tags?.map(t => (
              <span key={t} className="tag" style={{ background: `${proj.color}0d`, color: proj.color, borderColor: `${proj.color}18` }}>
                {t}
              </span>
            ))}
          </div>
          {proj.metrics && (
            <div style={{ marginTop: "0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {proj.metrics}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

// ==================== App (Two-Column Layout) ====================
export default function App() {
  // View state: null = list view, { project, company } = detail view
  const [view, setView] = useState(null);

  const openProject = (project, company) => {
    setView({ project, company });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => setView(null);

  // Easter egg
  useEffect(() => {
    let buf = "";
    const handler = (e) => {
      buf += e.key.toLowerCase();
      if (buf.length > 10) buf = buf.slice(-10);
      if (buf.includes("hire")) {
        buf = "";
        const o = document.createElement("div");
        o.style.cssText = "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(10,10,15,0.92);cursor:pointer";
        o.innerHTML = `<div style="text-align:center;animation:float 2s ease-in-out infinite">
          <div style="font-size:4rem;margin-bottom:1rem">🎉</div>
          <div style="font-family:var(--font-mono);font-size:1.5rem;color:var(--cyan);text-shadow:0 0 20px rgba(0,212,255,0.5);margin-bottom:0.5rem">成就解锁！</div>
          <div style="font-size:0.9rem;color:var(--text-dim);max-width:320px;line-height:1.6">恭喜你发现了隐藏成就！<br/>这说明你是一个注重细节的人。<br/>期待与您的合作 ✨</div>
          <div style="margin-top:1.5rem;font-size:0.7rem;color:var(--text-faint);font-family:var(--font-mono)">点击任意处关闭</div>
        </div>`;
        o.onclick = () => o.remove();
        document.body.appendChild(o);
        setTimeout(() => o.remove(), 6000);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{
      background: "var(--bg)", color: "var(--text)", minHeight: "100vh",
      fontFamily: "var(--font-sans)", position: "relative",
    }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>

      {/* Main two-column layout */}
      <div className="layout-root" style={{
        display: "flex", minHeight: "100vh",
        maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem",
        gap: "2.5rem",
      }}>
        {/* ===== LEFT PANEL (sticky sidebar) ===== */}
        <aside className="layout-sidebar" style={{
          width: "380px", flexShrink: 0, position: "sticky", top: 0,
          height: "100vh", overflowY: "auto", paddingTop: "2.5rem", paddingBottom: "2.5rem",
          scrollbarWidth: "none",
        }}>
          <div style={{ position: "relative" }}>
            <Particles />
            <ProfileCard />
            <SkillTree />
          </div>

          <div style={{
            marginTop: "2rem", textAlign: "center", fontSize: "0.65rem",
            color: "var(--text-faint)", fontFamily: "var(--font-mono)",
          }}>
            TIP: 键盘输入 <span style={{ color: "var(--purple)", background: "rgba(168,85,247,0.1)", padding: "0.1rem 0.35rem", borderRadius: "3px" }}>hire</span> 解锁彩蛋
          </div>
        </aside>

        {/* ===== RIGHT PANEL ===== */}
        <main className="layout-main" style={{ flex: 1, paddingTop: "2.5rem", paddingBottom: "3rem", minWidth: 0 }}>
          {view ? (
            <ProjectDetailPage project={view.project} company={view.company} onBack={goBack} />
          ) : (
            <>
              <Experience onProjectClick={openProject} />
              <StandaloneProjects />
            </>
          )}

          <footer style={{
            marginTop: "3rem", textAlign: "center", padding: "1.5rem",
            color: "var(--text-faint)", fontSize: "0.68rem", fontFamily: "var(--font-mono)",
            borderTop: "1px solid var(--border)",
          }}>
            Built with React + Vite · Deployed on GitHub Pages
          </footer>
        </main>
      </div>
    </div>
  );
}

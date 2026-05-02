"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  profile, stats, skills, projects, articles, videos, contact,
  allArtworks, appScreens, personalPhotos, knowledgeBaseScreens,
  chatgptArtworks, productArtworks,
} from "@/data/site-data";

// 滚动渐显 hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// 渐显容器
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [galleryCount, setGalleryCount] = useState(24);
  const [zoom, setZoom] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  // 菜单打开时禁止背景滚动
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* 加载动画 */}
      <div className={`page-loader${loaded ? " loaded" : ""}`}>
        <div className="loader-logo">DANDELION</div>
        <div className="loader-bar"><div className="loader-bar-inner" /></div>
      </div>

      <div className="page-content">
      {/* 导航 */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <span className="nav-logo">DANDELION</span>
        <div className="nav-links">
          <a href="#works">作品</a>
          <a href="#skills">技能</a>
          <a href="#projects">项目</a>
          <a href="#about">关于</a>
          <a href="#contact">联系</a>
        </div>
        <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单">
          <span /><span /><span />
        </button>
      </nav>

      {/* 手机菜单 */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#works" onClick={closeMenu}>作品</a>
        <a href="#skills" onClick={closeMenu}>技能</a>
        <a href="#projects" onClick={closeMenu}>项目</a>
        <a href="#about" onClick={closeMenu}>关于</a>
        <a href="#contact" onClick={closeMenu}>联系</a>
      </div>
      {menuOpen && <div className="mobile-backdrop" onClick={closeMenu} />}

      {/* Hero */}
      <section className="hero" id="hero">
        <video className="hero-bg" src="/assets/bg-ink.mp4" autoPlay loop muted playsInline />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-overline">你好，我是</p>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-bio">{profile.bio}</p>
          <p className="hero-tagline">&ldquo;{profile.tagline}&rdquo;</p>
          <a href="#works" className="hero-cta">探索我的作品</a>
        </div>
      </section>

      {/* Stats */}
      <Reveal>
        <div className="stats-bar">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* AI摄影 */}
      <section className="section" id="works">
        <Reveal>
          <p className="section-label">Selected Works</p>
          <h2 className="section-title">AI摄影 & 视觉创作</h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>精通光效·焦距·构图·色彩四大体系，190+张AI摄影作品</p>
        </Reveal>
        <div className="gallery-grid">
          {allArtworks.slice(0, galleryCount).map((src, i) => (
            <Reveal key={i} delay={Math.min(i % 8, 4) * 60}>
              <div className="gallery-item" style={{ aspectRatio: "1/1" }} onClick={() => setZoom(src)}>
                <img src={src} alt={`作品 ${i + 1}`} loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>
        {galleryCount < allArtworks.length && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button className="load-more-btn" onClick={() => setGalleryCount(c => Math.min(c + 24, allArtworks.length))}>
              加载更多（{allArtworks.length - galleryCount}）
            </button>
          </div>
        )}
      </section>

      <hr className="divider" />

      {/* 海报设计 */}
      <section className="section">
        <Reveal>
          <p className="section-label">Poster Design</p>
          <h2 className="section-title">海报设计</h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>概念海报 · 视觉叙事 · 排版设计</p>
        </Reveal>
        <div className="gallery-grid">
          {chatgptArtworks.map((src, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="gallery-item" style={{ aspectRatio: "3/4" }} onClick={() => setZoom(src)}>
                <img src={src} alt={`海报 ${i + 1}`} loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* AI视频 */}
      <section className="section">
        <Reveal>
          <p className="section-label">Video Works</p>
          <h2 className="section-title">AI视频创作</h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>概念设定→AI出图→动态生成→剪辑调色</p>
        </Reveal>
        <div className="video-grid">
          {videos.map((v) => (
            <Reveal key={v.title}>
              <div className="video-card">
                <video src={v.src} controls playsInline loop muted preload="metadata" />
                <div className="video-card-title">{v.title}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* 海报与文创 */}
      <section className="section">
        <Reveal>
          <p className="section-label">Product Design</p>
          <h2 className="section-title">海报与文创设计</h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>蜜雪冰城中文排版、国风文创、产品摄影</p>
        </Reveal>
        <div className="gallery-grid">
          {productArtworks.map((src, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="gallery-item" style={{ aspectRatio: "1/1" }} onClick={() => setZoom(src)}>
                <img src={src} alt={`文创 ${i + 1}`} loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* APP */}
      <section className="section">
        <Reveal>
          <p className="section-label">Personal Project</p>
          <h2 className="section-title">Dandelion APP</h2>
          <p className="section-desc">番茄钟·白噪音·习惯记录·便签·热力图·心情签</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "8px 0 32px" }}>React + Supabase</p>
        </Reveal>
        <div className="app-grid">
          {appScreens.map((src, i) => (
            <div key={i} className="app-item" onClick={() => setZoom(src)}>
              <img src={src} alt={`APP ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* 技能 */}
      <section className="section" id="skills">
        <Reveal>
          <p className="section-label">Capabilities</p>
          <h2 className="section-title">核心技能</h2>
        </Reveal>
        <div className="skills-grid" style={{ marginTop: 32 }}>
          {skills.map((s, i) => (
            <Reveal key={s.category} delay={i * 80}>
              <div className="skill-card">
                <div className="skill-card-title">{s.category}</div>
                <div className="skill-card-items">
                  {s.items.map((item) => (<span key={item} className="skill-tag">{item}</span>))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* 项目 */}
      <section className="section" id="projects">
        <Reveal>
          <p className="section-label">Experience</p>
          <h2 className="section-title">项目经验</h2>
        </Reveal>
        <div className="projects-grid" style={{ marginTop: 32 }}>
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="project-card">
                <div className="project-period">{p.period}</div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>
                <div className="project-tech">{p.tech.map((t) => (<span key={t}>{t}</span>))}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* 公众号 */}
      <section className="section">
        <Reveal>
          <p className="section-label">Content Creation</p>
          <h2 className="section-title">公众号 & 知识库</h2>
          <p className="section-desc">公众号 {contact.wechatPublic}（600+粉丝）· 小红书 {contact.xiaohongshu}（422粉丝）</p>
          <p className="section-desc" style={{ marginBottom: 32 }}>15万字AI知识库 + 12万字笔记</p>
        </Reveal>
        <Reveal delay={100}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--accent)" }}>爆款文章</h3>
          <div className="articles-list" style={{ marginBottom: 40 }}>
            {articles.map((a, i) => (
              <div key={i} className="article-item">
                <span style={{ color: "var(--accent)", marginRight: 8, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                {a}
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--accent)" }}>知识库一览</h3>
          <div className="kb-grid">
            {knowledgeBaseScreens.map((src, i) => (
              <div key={i} className="kb-item" onClick={() => setZoom(src)}>
                <img src={src} alt={`知识库 ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="divider" />

      {/* 关于 */}
      <section className="section" id="about">
        <Reveal>
          <p className="section-label">About</p>
          <h2 className="section-title">关于我</h2>
        </Reveal>
        <div className="about-content" style={{ marginTop: 32 }}>
          <Reveal>
            <div className="about-photo">
              <img src={personalPhotos[0]} alt="杜涛" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <p className="about-quote">&ldquo;相机给了你黑色的画布，摄影让你涂抹光明&rdquo;</p>
              <p className="about-story">{`我是杜涛，来自贵州，在重庆读书。西南大学园艺专业大二在读，国家励志奖学金获得者。

从高中不敢举手到大学主动竞选班长。从焦虑迷茫到建立15万字知识库。

阿德勒心理学深度实践者，元认知训练让我学会第三视角观察。
日更朋友圈1000+篇，记录每天的思考。

喜欢摄影、跑步、猫咪和一切可爱的事物。梦想成为数字游民。`}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["INFP", "园艺", "AI Art", "提示词工程", "逆向工程", "Vibe Coding", "摄影", "跑步", "猫咪"].map((tag) => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* 联系 */}
      <section className="section" id="contact">
        <Reveal>
          <p className="section-label">Get in Touch</p>
          <h2 className="section-title">联系我</h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>如果你对我的作品感兴趣，欢迎联系</p>
        </Reveal>
        <div className="contact-grid">
          <Reveal delay={0}><a className="contact-card" href={`mailto:${contact.email}`}><div className="contact-label">Email</div><div className="contact-value">{contact.email}</div></a></Reveal>
          <Reveal delay={60}><a className="contact-card" href={`tel:${contact.phone}`}><div className="contact-label">电话</div><div className="contact-value">{contact.phone}</div></a></Reveal>
          <Reveal delay={120}><div className="contact-card"><div className="contact-label">微信</div><div className="contact-value">{contact.wechat}</div></div></Reveal>
          <Reveal delay={180}><div className="contact-card"><div className="contact-label">QQ</div><div className="contact-value">{contact.qq}</div></div></Reveal>
          <Reveal delay={240}><div className="contact-card"><div className="contact-label">公众号</div><div className="contact-value">{contact.wechatPublic}</div></div></Reveal>
          <Reveal delay={300}><div className="contact-card"><div className="contact-label">小红书</div><div className="contact-value">{contact.xiaohongshu}</div></div></Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">DANDELION · {profile.name}</div>
        <div className="footer-copy">© 2026 {profile.name} · {profile.location}</div>
      </footer>

      {zoom && (
        <div className="zoom-overlay" onClick={() => setZoom(null)}>
          <button className="zoom-close" onClick={() => setZoom(null)}>×</button>
          <img src={zoom} alt="放大查看" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      </div>
    </>
  );
}

import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "हिन्दी" },
  { code: "ta", label: "TA", name: "தமிழ்" },
  { code: "es", label: "ES", name: "Español" },
  { code: "fr", label: "FR", name: "Français" },
];

export default function Navbar({ navigate, activePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const NAV_LINKS = [
    { label: "Analysis", page: "analysis" },
    { label: "Dashboard", page: "dashboard" },
    { label: "Consult", page: "consultation" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: `${scrolled ? "12px" : "20px"} clamp(24px, 6vw, 60px)`,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(248,250,249,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1400px", margin: "0 auto" }}>
          {/* Logo */}
          <button
            onClick={() => navigate("landing")}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <div style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg, var(--teal-700), var(--teal-400))",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
            }}>🔬</div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "20px", fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.01em",
            }}>SkinHealth AI</span>
          </button>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="nav-desktop">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                style={{
                  padding: "8px 18px",
                  border: "none",
                  background: activePage === link.page ? "rgba(20,184,166,0.1)" : "transparent",
                  color: activePage === link.page ? "var(--teal-600)" : "var(--text-muted)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "14px", fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (activePage !== link.page) e.target.style.color = "var(--text)"; e.target.style.background = "rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { if (activePage !== link.page) { e.target.style.color = "var(--text-muted)"; e.target.style.background = "transparent"; } }}
              >{link.label}</button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Language */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "13px", fontWeight: 500,
                  color: "var(--text)",
                  fontFamily: "'DM Mono', monospace",
                  display: "flex", alignItems: "center", gap: "4px",
                  transition: "all 0.2s",
                }}
              >
                {LANGUAGES.find(l => l.code === lang)?.label}
                <span style={{ fontSize: "10px", opacity: 0.5 }}>▼</span>
              </button>
              {langOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-md)",
                  padding: "8px",
                  minWidth: "140px", zIndex: 200,
                  animation: "fadeIn 0.15s ease",
                }}>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "8px 12px", border: "none",
                        background: lang === l.code ? "rgba(20,184,166,0.08)" : "transparent",
                        color: lang === l.code ? "var(--teal-600)" : "var(--text)",
                        borderRadius: "8px", cursor: "pointer",
                        fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                        display: "flex", gap: "8px", alignItems: "center",
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{ fontFamily: "'DM Mono', monospace", opacity: 0.6, fontSize: "11px" }}>{l.label}</span>
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              style={{
                width: 38, height: 38, borderRadius: "10px",
                background: "transparent",
                border: "1px solid var(--border)",
                cursor: "pointer", fontSize: "17px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(20,184,166,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* CTA */}
            <button className="btn-primary" onClick={() => navigate("analysis")}
              style={{ padding: "10px 20px", fontSize: "14px" }}>
              Analyze Free →
            </button>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none", width: 38, height: 38,
                borderRadius: "10px", border: "1px solid var(--border)",
                background: "transparent", cursor: "pointer", fontSize: "18px",
                alignItems: "center", justifyContent: "center",
              }}
            >☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex", flexDirection: "column", gap: "4px",
          }}>
            {NAV_LINKS.map(link => (
              <button key={link.page} onClick={() => { navigate(link.page); setMobileOpen(false); }}
                style={{
                  padding: "14px 16px", border: "none",
                  background: "transparent", textAlign: "left",
                  color: "var(--text)", cursor: "pointer",
                  fontSize: "16px", fontFamily: "'DM Sans', sans-serif",
                  borderRadius: "10px",
                }}>{link.label}</button>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {langOpen && <div onClick={() => setLangOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />}
    </>
  );
}

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConfidenceRing from "../components/ConfidenceRing";

const MOCK_HISTORY = [
  { id: 1, date: "2025-12-10", disease: "Melanocytic Nevi", confidence: 94.2, severity: "Low",   emoji: "🔵", status: "Monitored" },
  { id: 2, date: "2025-11-22", disease: "Benign Keratosis",  confidence: 88.5, severity: "Low",   emoji: "🟤", status: "Stable" },
  { id: 3, date: "2025-10-05", disease: "Actinic Keratosis", confidence: 79.1, severity: "Moderate", emoji: "🟡", status: "Consult booked" },
  { id: 4, date: "2025-09-14", disease: "Dermatofibroma",    confidence: 91.3, severity: "Low",   emoji: "🟣", status: "Resolved" },
  { id: 5, date: "2025-08-01", disease: "Melanocytic Nevi",  confidence: 93.8, severity: "Low",   emoji: "🔵", status: "Monitored" },
];

const SEVERITY_COLOR = { Low: "#10b981", Moderate: "#f59e0b", High: "#f43f5e", "Very High": "#7c3aed" };
const SEVERITY_BG    = { Low: "#d1fae5", Moderate: "#fef3c7", High: "#ffe4ea", "Very High": "#ede9fe" };

const NOTIFICATIONS = [
  { id: 1, icon: "🩺", text: "Dr. Kavitha accepted your consultation request.", time: "2m ago", unread: true },
  { id: 2, icon: "📊", text: "Your analysis for Actinic Keratosis is ready.", time: "1h ago", unread: true },
  { id: 3, icon: "⚠️", text: "UV index is 9 (Very High) in Chennai today.", time: "3h ago", unread: false },
  { id: 4, icon: "🏆", text: "You earned the 'Skin Guardian' badge! 7-day streak.", time: "1d ago", unread: false },
];

const CHATBOT_RESPONSES = {
  "what causes nevi": "Melanocytic nevi (moles) form when melanocytes — skin cells that produce pigment — grow in clusters instead of spreading out. Sun exposure during childhood and genetics are primary factors.",
  "is it dangerous": "Most nevi are benign and never become cancerous. The risk is very low (<0.001%/year). Regular self-exams and annual dermatology checks are the best precaution.",
  "what should i do": "For low-risk nevi: apply SPF 30+ daily, do monthly self-exams using the ABCDE method, and see a dermatologist annually. If you notice any changes, see a doctor sooner.",
  default: "That's a great question. Based on your analysis, I'd recommend consulting a dermatologist for personalized advice. Would you like me to help you book a consultation?",
};

function StatWidget({ icon, label, value, sub, color = "var(--teal-600)" }) {
  return (
    <div style={{
      padding: "22px 24px",
      borderRadius: 18,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
      transition: "all 0.3s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "none"}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: "clamp(24px,3vw,32px)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

function HistoryCard({ item, navigate }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "16px 20px",
      borderRadius: 16,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      transition: "all 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal-400)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Thumb */}
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, rgba(20,184,166,0.15), rgba(20,184,166,0.05))`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>{item.emoji}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.disease}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {item.confidence}% confidence
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
        <span style={{
          padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
          background: SEVERITY_BG[item.severity],
          color: SEVERITY_COLOR[item.severity],
        }}>{item.severity}</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.status}</span>
      </div>

      {/* Re-analyze */}
      <button
        onClick={() => navigate("analysis")}
        style={{
          padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8,
          background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif", flexShrink: 0, whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal-400)"; e.currentTarget.style.color = "var(--teal-600)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
      >↩ Re-analyze</button>
    </div>
  );
}

function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your SkinHealth AI assistant. Ask me anything about your analyses, conditions, or skin care." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const key = Object.keys(CHATBOT_RESPONSES).find(k => userMsg.toLowerCase().includes(k));
    const reply = CHATBOT_RESPONSES[key] || CHATBOT_RESPONSES.default;
    setTyping(false);
    setMessages(m => [...m, { role: "ai", text: reply }]);
  };

  return (
    <div style={{
      borderRadius: 20, border: "1px solid var(--border)",
      background: "var(--bg-card)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      height: 420,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        background: "linear-gradient(135deg, rgba(20,184,166,0.06), transparent)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--teal-600), var(--teal-400))",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>AI Assistant</div>
          <div style={{ fontSize: 11, color: "var(--green)" }}>● Online</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "linear-gradient(135deg, var(--teal-600), var(--teal-500))" : "rgba(20,184,166,0.06)",
              color: m.role === "user" ? "#fff" : "var(--text)",
              border: m.role === "user" ? "none" : "1px solid rgba(20,184,166,0.15)",
              fontSize: 14, lineHeight: 1.6,
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(20,184,166,0.06)", width: "fit-content", alignItems: "center" }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%", background: "var(--teal-400)",
                animation: `pulse-ring 1s ease-in-out ${d}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about your skin condition..."
          className="input" style={{ flex: 1, padding: "10px 14px", fontSize: 14 }}
        />
        <button onClick={send} className="btn-primary" style={{ padding: "10px 18px", fontSize: 14 }}>→</button>
      </div>
    </div>
  );
}

function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        position: "relative", width: 42, height: 42,
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--bg-card)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>
        🔔
        {unreadCount > 0 && (
          <div style={{
            position: "absolute", top: 6, right: 6,
            width: 16, height: 16, borderRadius: "50%",
            background: "var(--rose-500, #f43f5e)", color: "#fff",
            fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--bg-card)",
          }}>{unreadCount}</div>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 10px)", right: 0,
            width: 340, maxHeight: 420,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 16, boxShadow: "var(--shadow-lg)", zIndex: 100,
            overflow: "hidden", animation: "fadeIn 0.15s ease",
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 15 }}>
              Notifications <span style={{ fontSize: 12, color: "var(--teal-600)", fontWeight: 500, marginLeft: 6 }}>{unreadCount} new</span>
            </div>
            <div style={{ overflowY: "auto", maxHeight: 340 }}>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{
                  padding: "14px 20px", display: "flex", gap: 12, alignItems: "flex-start",
                  borderBottom: "1px solid var(--border)",
                  background: n.unread ? "rgba(20,184,166,0.03)" : "transparent",
                  transition: "background 0.2s",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, marginBottom: 4 }}>{n.text}</p>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{n.time}</span>
                  </div>
                  {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal-500)", flexShrink: 0, marginTop: 6 }} />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function HealthScore() {
  const score = 78;
  const r = 54; const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{
      padding: 28, borderRadius: 20,
      background: "linear-gradient(135deg, var(--teal-700), var(--teal-600))",
      color: "#fff", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 180, height: 180,
        borderRadius: "50%", border: "2px solid rgba(255,255,255,0.08)",
      }} />
      <div style={{
        position: "absolute", top: 20, right: 20, width: 100, height: 100,
        borderRadius: "50%", border: "2px solid rgba(255,255,255,0.05)",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width={130} height={130}>
          <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={8} />
          <circle
            cx={65} cy={65} r={r} fill="none"
            stroke="#fff" strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s ease" }}
          />
          <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 24, fontWeight: 700, fill: "#fff", fontFamily: "'Cormorant Garamond', serif" }}>{score}</text>
          <text x="50%" y="64%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 10, fill: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>/100</text>
        </svg>
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Skin Health Score</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, marginBottom: 8 }}>Good</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            Based on 5 analyses,<br />journal entries & UV data.
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            ▲ +4 from last month
          </div>
        </div>
      </div>
    </div>
  );
}

function DiseaseDistributionChart() {
  const data = [
    { name: "Melanocytic Nevi", count: 3, color: "#14b8a6" },
    { name: "Benign Keratosis", count: 1, color: "#d97706" },
    { name: "Actinic Keratosis", count: 1, color: "#f59e0b" },
  ];
  const total = data.reduce((a, d) => a + d.count, 0);
  let angle = 0;

  return (
    <div style={{ padding: 24, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>📊 Disease Distribution</h4>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {/* Pie chart */}
        <svg width={110} height={110} style={{ flexShrink: 0 }}>
          {data.map((d, i) => {
            const pct = d.count / total;
            const a1 = angle; const a2 = angle + pct * 360;
            angle = a2;
            const r = 48, cx = 55, cy = 55;
            const a1r = (a1 - 90) * Math.PI / 180, a2r = (a2 - 90) * Math.PI / 180;
            const x1 = cx + r * Math.cos(a1r), y1 = cy + r * Math.sin(a1r);
            const x2 = cx + r * Math.cos(a2r), y2 = cy + r * Math.sin(a2r);
            const large = pct > 0.5 ? 1 : 0;
            return (
              <path key={i}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
                fill={d.color} stroke="var(--bg-card)" strokeWidth={3}
              />
            );
          })}
        </svg>
        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
              <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: "var(--text-muted)" }}>{d.count}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Gamification() {
  const badges = [
    { icon: "🛡️", name: "Skin Guardian",  desc: "7-day streak",       earned: true },
    { icon: "🔬", name: "Lab Rat",         desc: "5 analyses done",    earned: true },
    { icon: "🌞", name: "Sun Safe",        desc: "30-day SPF streak",  earned: false },
    { icon: "🏥", name: "Dr. Ready",       desc: "Book a consultation", earned: false },
  ];

  return (
    <div style={{ padding: 24, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600 }}>🏆 Achievements</h4>
        <span style={{ fontSize: 12, color: "var(--teal-600)", fontWeight: 600 }}>
          {badges.filter(b => b.earned).length}/{badges.length} earned
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {badges.map((b, i) => (
          <div key={i} style={{
            padding: "12px 14px", borderRadius: 12,
            background: b.earned ? "rgba(20,184,166,0.06)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${b.earned ? "rgba(20,184,166,0.2)" : "var(--border)"}`,
            opacity: b.earned ? 1 : 0.45,
            display: "flex", gap: 10, alignItems: "center",
          }}>
            <span style={{ fontSize: 22 }}>{b.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "rgba(20,184,166,0.06)", fontSize: 13, color: "var(--teal-700)", textAlign: "center" }}>
        🔥 7-day streak — keep going! Next badge in 23 days.
      </div>
    </div>
  );
}

export default function Dashboard({ navigate }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar navigate={navigate} activePage="dashboard" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px clamp(16px,4vw,40px) 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: 12 }}>Welcome back</span>
            <h1 style={{ fontSize: "clamp(28px,4vw,42px)", marginBottom: 8 }}>Your Skin Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Track, analyze, and improve your skin health over time.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <NotificationCenter />
            <button className="btn-primary" onClick={() => navigate("analysis")} style={{ fontSize: 14, padding: "11px 22px" }}>
              + New Analysis
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatWidget icon="🔬" label="Total Analyses" value="5" sub="All time" />
          <StatWidget icon="📅" label="This Month" value="3" sub="Average severity: Low" />
          <StatWidget icon="🩺" label="Consultations" value="2" sub="1 upcoming" color="var(--purple)" />
          <StatWidget icon="🏆" label="Current Streak" value="7d" sub="Personal best!" color="var(--gold)" />
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }} className="dashboard-grid">
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Analysis history */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 18 }}>Analysis History</h3>
                <button style={{ background: "none", border: "none", color: "var(--teal-600)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                  View all →
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MOCK_HISTORY.map(item => <HistoryCard key={item.id} item={item} navigate={navigate} />)}
              </div>
            </div>

            {/* AI Chatbot */}
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>AI Chat Assistant</h3>
              <ChatBot />
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <HealthScore />
            <DiseaseDistributionChart />
            <Gamification />

            {/* Quick actions */}
            <div style={{ padding: 20, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "🔬", label: "Analyze new image",      action: () => navigate("analysis") },
                  { icon: "🩺", label: "Book consultation",       action: () => navigate("consultation") },
                  { icon: "📔", label: "Open skin journal",        action: () => {} },
                  { icon: "📄", label: "Download full report",     action: () => window.print() },
                  { icon: "🌐", label: "Community forum",          action: () => {} },
                ].map((a, i) => (
                  <button key={i} onClick={a.action} style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid var(--border)", borderRadius: 12,
                    background: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    fontSize: 14, color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
                    textAlign: "left", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal-400)"; e.currentTarget.style.background = "rgba(20,184,166,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 18 }}>{a.icon}</span>
                    {a.label}
                    <span style={{ marginLeft: "auto", fontSize: 16, color: "var(--text-muted)" }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
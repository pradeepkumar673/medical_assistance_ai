import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const STATS = [
  { value: "94.2%", label: "AI Accuracy", sub: "on HAM10000 dataset" },
  { value: "12K+", label: "Analyses Done", sub: "this month" },
  { value: "320+", label: "Dermatologists", sub: "verified & available" },
  { value: "<3s", label: "Result Time", sub: "instant AI diagnosis" },
];

const FEATURES = [
  {
    icon: "🔬",
    title: "AI Skin Analysis",
    desc: "Upload any skin image and receive a detailed clinical-grade analysis in seconds, powered by deep learning trained on 10,000+ dermatology cases.",
    color: "var(--teal-500)",
    bg: "rgba(20,184,166,0.06)",
  },
  {
    icon: "🩺",
    title: "Live Consultation",
    desc: "Connect instantly with board-certified dermatologists via encrypted video call, voice, or chat — available 24/7.",
    color: "var(--purple)",
    bg: "rgba(124,58,237,0.06)",
  },
  {
    icon: "🗓️",
    title: "Skin Journal",
    desc: "Track your skin's journey with AI-powered trend analysis across your uploaded images over time.",
    color: "var(--gold)",
    bg: "rgba(217,119,6,0.06)",
  },
  {
    icon: "📊",
    title: "Detailed Reports",
    desc: "Download polished PDF reports with heatmaps, confidence scores, treatment advice, and doctor notes.",
    color: "var(--green)",
    bg: "rgba(16,185,129,0.06)",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "End-to-end encrypted data, anonymous upload option, GDPR-compliant storage. Your health data is yours.",
    color: "var(--rose-500)",
    bg: "rgba(244,63,94,0.06)",
  },
  {
    icon: "🌐",
    title: "Multi-Language",
    desc: "Full support for English, Hindi, Tamil, Spanish and French with auto-detection based on your location.",
    color: "var(--teal-600)",
    bg: "rgba(13,148,136,0.06)",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Upload Your Image", desc: "Drag & drop or capture live with your camera. Supports JPEG, PNG, HEIC." },
  { step: "02", title: "AI Analysis", desc: "Our model analyzes 7 skin conditions in under 3 seconds with Grad-CAM heatmaps." },
  { step: "03", title: "Get Results", desc: "View detailed breakdown: disease, severity, confidence score, and personalized advice." },
  { step: "04", title: "Consult a Doctor", desc: "Optionally connect with a dermatologist for professional follow-up — all within the app." },
];

const TESTIMONIALS = [
  {
    name: "Priya S.", location: "Chennai, IN",
    quote: "The heatmap overlay is incredible — I could actually see what the AI was looking at. Helped me understand my diagnosis.",
    rating: 5, condition: "Melanocytic Nevi",
  },
  {
    name: "Rahul M.", location: "Mumbai, IN",
    quote: "Got a video consultation within 20 minutes. The doctor reviewed the AI report and it saved me a physical clinic visit.",
    rating: 5, condition: "Eczema Follow-up",
  },
  {
    name: "Sofia L.", location: "Barcelona, ES",
    quote: "Nervioso al principio, pero los resultados fueron claros y el médico fue muy tranquilizador. Aplicación excelente.",
    rating: 5, condition: "Basal Cell Carcinoma (early)",
  },
];

function WaveBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none"
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(20,184,166,${0.04 - i * 0.01}), transparent 70%)`,
          width: `${800 + i * 300}px`,
          height: `${800 + i * 300}px`,
          top: `${-200 + i * 100}px`,
          right: `${-200 + i * 80}px`,
          animation: `wave ${8 + i * 3}s ease-in-out infinite`,
          animationDelay: `${i * 1.5}s`,
        }} />
      ))}
    </div>
  );
}

function StatCard({ value, label, sub, delay }) {
  const [count, setCount] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCount(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      textAlign: "center",
      animation: count ? `fadeUp 0.6s ease ${delay}s both` : "none",
    }}>
      <div style={{
        fontSize: "clamp(32px, 5vw, 52px)",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
        color: "var(--teal-600)",
        lineHeight: 1,
        marginBottom: "8px",
      }}>{value}</div>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{sub}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, bg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? color + "40" : "var(--border)"}`,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 40px ${color}20` : "var(--shadow-sm)",
        cursor: "default",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, marginBottom: 20,
        transition: "transform 0.3s",
        transform: hovered ? "scale(1.1) rotate(-5deg)" : "none",
      }}>{icon}</div>
      <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "var(--text)" }}>{title}</h3>
      <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-muted)" }}>{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, location, quote, rating, condition }) {
  return (
    <div style={{
      padding: "32px",
      borderRadius: "var(--radius-lg)",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
      display: "flex", flexDirection: "column", gap: "16px",
    }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[...Array(rating)].map((_, i) => (
          <span key={i} style={{ color: "var(--gold)", fontSize: "16px" }}>★</span>
        ))}
      </div>
      <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--text)", fontStyle: "italic" }}>
        "{quote}"
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{name}</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{location}</div>
        </div>
        <span className="badge badge-teal" style={{ fontSize: "11px" }}>{condition}</span>
      </div>
    </div>
  );
}

export default function LandingPage({ navigate }) {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar navigate={navigate} />

      {/* HERO */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "120px clamp(24px, 6vw, 100px) 80px",
        overflow: "hidden",
      }}>
        <WaveBg />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px" }}>
          <div className="badge badge-teal animate-fadeUp" style={{ marginBottom: "24px", fontSize: "13px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal-500)", display: "inline-block" }} />
            AI-powered · Clinically-informed · Secure
          </div>

          <h1 className="animate-fadeUp-delay-1" style={{
            fontSize: "clamp(42px, 6vw, 80px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}>
            Your skin,{" "}
            <span className="gradient-text">decoded</span>
            {" "}by AI.
          </h1>

          <p className="animate-fadeUp-delay-2" style={{
            fontSize: "18px", lineHeight: 1.8,
            color: "var(--text-muted)",
            marginBottom: "40px",
            maxWidth: "540px",
          }}>
            Upload a photo of any skin concern and receive instant AI analysis, 
            Grad-CAM heatmaps, severity scoring — and connect with a dermatologist 
            in minutes.
          </p>

          <div className="animate-fadeUp-delay-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate("analysis")}
              style={{ fontSize: "16px", padding: "16px 36px" }}>
              Analyze My Skin →
            </button>
            <button className="btn-outline" onClick={() => navigate("dashboard")}>
              View Dashboard
            </button>
          </div>

          <p style={{ marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
            No account needed · Free first analysis · 256-bit encrypted
          </p>
        </div>

        {/* Hero visual */}
        <div style={{
          position: "absolute",
          right: "clamp(24px, 6vw, 100px)",
          top: "50%", transform: "translateY(-50%)",
          display: "none",
        }} className="hero-visual">
          <HeroVisual />
        </div>

        <style>{`@media (min-width: 1024px) { .hero-visual { display: block !important; } }`}</style>
      </section>

      {/* STATS */}
      <section style={{
        padding: "80px clamp(24px, 6vw, 100px)",
        background: "linear-gradient(to right, var(--teal-700), var(--teal-600))",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "48px",
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "white", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginTop: "8px" }}>{s.label}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px clamp(24px, 6vw, 100px)" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span className="badge badge-teal" style={{ marginBottom: "16px" }}>Everything you need</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", marginBottom: "16px" }}>
            Built for serious skin health
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            From AI diagnosis to live doctor consultations, every feature is crafted with clinical precision.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: "100px clamp(24px, 6vw, 100px)",
        background: "linear-gradient(135deg, rgba(20,184,166,0.04), rgba(124,58,237,0.03))",
      }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span className="badge badge-purple" style={{ marginBottom: "16px" }}>Simple process</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>How it works</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "32px",
          maxWidth: "1000px", margin: "0 auto",
          position: "relative",
        }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{ textAlign: "center", padding: "32px 24px" }}>
              <div style={{
                fontSize: "48px",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                color: "var(--teal-400)",
                opacity: 0.5,
                lineHeight: 1,
                marginBottom: "16px",
              }}>{step.step}</div>
              <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>{step.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px clamp(24px, 6vw, 100px)" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span className="badge badge-gold" style={{ marginBottom: "16px" }}>Real stories</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>Trusted by thousands</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          maxWidth: "1100px", margin: "0 auto",
        }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px clamp(24px, 6vw, 100px)",
        textAlign: "center",
        background: "linear-gradient(135deg, var(--teal-700) 0%, var(--teal-600) 50%, #0d6e68 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08), transparent 60%)",
        }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", color: "white", marginBottom: "20px" }}>
            Your skin health starts today.
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", marginBottom: "40px", maxWidth: "480px", margin: "0 auto 40px" }}>
            Upload your first image free — no registration required.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("analysis")}
            style={{
              fontSize: "17px", padding: "18px 48px",
              background: "white",
              color: "var(--teal-700)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            Start Free Analysis →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "48px clamp(24px, 6vw, 100px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, var(--teal-600), var(--teal-400))",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>🔬</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600 }}>SkinHealth AI</span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          © 2025 SkinHealth AI · Not a substitute for professional medical advice.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: "13px", color: "var(--text-muted)", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "var(--teal-600)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: "relative", width: "440px", height: "480px" }} className="animate-float">
      {/* Main card */}
      <div style={{
        position: "absolute",
        top: "40px", left: "20px",
        width: "360px",
        background: "var(--bg-card)",
        borderRadius: "24px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
        padding: "24px",
        zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "12px", background: "var(--teal-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🔬</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>AI Analysis Complete</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>2.4 seconds · 94.2% confidence</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className="badge badge-green" style={{ fontSize: "11px" }}>✓ Done</span>
          </div>
        </div>

        {/* Image area */}
        <div style={{
          height: "160px", borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(124,58,237,0.1))",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: "48px" }}>🧬</div>
          {/* Heatmap overlay hint */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(244,63,94,0.2) 30%, transparent 70%)",
            borderRadius: "16px",
          }} />
          <div style={{
            position: "absolute", bottom: "12px", right: "12px",
            background: "rgba(244,63,94,0.9)", color: "white",
            fontSize: "11px", fontWeight: 600, padding: "4px 8px", borderRadius: "6px",
          }}>HEATMAP ON</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>Detected Condition</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>Melanocytic Nevi</div>
          </div>
          <ConfidenceRing value={94} size={56} />
        </div>

        <div style={{
          padding: "12px", borderRadius: "12px",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "16px" }}>✅</span>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--green)" }}>Severity: Low</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Monitor quarterly, no urgent action</div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div style={{
        position: "absolute",
        bottom: "20px", right: "0px",
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: "10px",
        zIndex: 3,
      }}>
        <div style={{ fontSize: "20px" }}>🩺</div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>Dr. available now</div>
          <div style={{ fontSize: "11px", color: "var(--teal-600)" }}>Consult in 8 min →</div>
        </div>
      </div>
    </div>
  );
}

function ConfidenceRing({ value, size = 80 }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#grad)" strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.8s" }}
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--teal-500)" />
          <stop offset="100%" stopColor="var(--teal-300, #5eead4)" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        style={{ fontSize: size < 60 ? "12px" : "14px", fontWeight: 700, fill: "var(--teal-600)", fontFamily: "'DM Sans', sans-serif" }}>
        {value}%
      </text>
    </svg>
  );
}

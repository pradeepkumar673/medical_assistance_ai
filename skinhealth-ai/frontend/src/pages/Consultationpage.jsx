import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const DOCTORS = [
  {
    id: 1, name: "Dr. Kavitha Ramesh", specialty: "Dermatology & Skin Oncology",
    rating: 4.9, reviews: 312, experience: "14 years",
    languages: ["English", "Tamil", "Hindi"],
    location: "Chennai, IN", online: true,
    nextSlot: "Today, 4:30 PM", price: 599, currency: "₹",
    avatar: "👩‍⚕️", badge: "Top Rated",
  },
  {
    id: 2, name: "Dr. Arjun Mehta", specialty: "Cosmetic Dermatology",
    rating: 4.7, reviews: 198, experience: "9 years",
    languages: ["English", "Hindi"],
    location: "Mumbai, IN", online: true,
    nextSlot: "Today, 6:00 PM", price: 499, currency: "₹",
    avatar: "👨‍⚕️", badge: "Best Value",
  },
  {
    id: 3, name: "Dr. Priya Nair", specialty: "Pediatric Dermatology",
    rating: 4.8, reviews: 267, experience: "11 years",
    languages: ["English", "Malayalam", "Tamil"],
    location: "Kochi, IN", online: false,
    nextSlot: "Tomorrow, 10:00 AM", price: 549, currency: "₹",
    avatar: "👩‍⚕️", badge: null,
  },
];

const CONSULT_OPTIONS = [
  {
    id: "chat", icon: "💬", title: "Text Chat",
    desc: "Async or real-time text with your doctor. Share images & reports.",
    price: 299, currency: "₹", time: "~15 min", badge: null,
  },
  {
    id: "voice", icon: "📞", title: "Voice Call",
    desc: "Clear HD audio consultation with noise cancellation.",
    price: 399, currency: "₹", time: "~20 min", badge: "Popular",
  },
  {
    id: "video", icon: "📹", title: "Video Call",
    desc: "Full video with live skin exam, screen share & annotation tools.",
    price: 599, currency: "₹", time: "~30 min", badge: "Best",
  },
];

const MOCK_MESSAGES = [
  { role: "doctor", text: "Hello! I've reviewed your AI analysis. The melanocytic nevus appears benign, but I'd like to ask a few questions.", time: "4:32 PM" },
  { role: "user", text: "Thank you, Doctor. I've had this mole for about 3 years and recently noticed it looks slightly darker.", time: "4:33 PM" },
  { role: "doctor", text: "Slight darkening can be normal due to sun exposure. Can you tell me if there's any itching, bleeding, or size change?", time: "4:34 PM" },
];

function StarRating({ value }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(value) ? "#d97706" : "var(--border)", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function DoctorCard({ doctor, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(doctor.id)}
      style={{
        padding: "20px 24px",
        borderRadius: 18,
        background: "var(--bg-card)",
        border: `2px solid ${selected ? "var(--teal-500)" : "var(--border)"}`,
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: selected ? "scale(1.01)" : "scale(1)",
        boxShadow: selected ? "var(--shadow-glow)" : "var(--shadow-sm)",
        position: "relative",
      }}
    >
      {/* Badge */}
      {doctor.badge && (
        <div style={{
          position: "absolute", top: -1, right: 18,
          background: doctor.badge === "Best Value" ? "var(--gold)" : "var(--teal-600)",
          color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px",
          borderRadius: "0 0 8px 8px", letterSpacing: "0.04em",
        }}>{doctor.badge}</div>
      )}

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          background: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(20,184,166,0.05))",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
          position: "relative",
        }}>
          {doctor.avatar}
          {doctor.online && (
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              width: 12, height: 12, borderRadius: "50%",
              background: "#10b981", border: "2px solid var(--bg-card)",
            }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{doctor.name}</div>
          <div style={{ fontSize: 13, color: "var(--teal-600)", marginBottom: 6 }}>{doctor.specialty}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <StarRating value={doctor.rating} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{doctor.rating}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({doctor.reviews} reviews)</span>
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--teal-700)", fontFamily: "'Cormorant Garamond', serif" }}>
            {doctor.currency}{doctor.price}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>per session</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="badge badge-teal" style={{ fontSize: 11 }}>📍 {doctor.location}</span>
        <span className="badge badge-teal" style={{ fontSize: 11 }}>⏱ {doctor.experience}</span>
        <span className={`badge ${doctor.online ? "badge-green" : "badge-gold"}`} style={{ fontSize: 11 }}>
          {doctor.online ? "● Online now" : "🕐 " + doctor.nextSlot}
        </span>
        {doctor.languages.map(l => (
          <span key={l} className="badge badge-purple" style={{ fontSize: 11 }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function ConsultOptionCard({ opt, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(opt.id)}
      style={{
        padding: "24px",
        borderRadius: 18,
        background: "var(--bg-card)",
        border: `2px solid ${selected ? "var(--teal-500)" : "var(--border)"}`,
        cursor: "pointer",
        transition: "all 0.25s",
        transform: selected ? "translateY(-2px)" : "none",
        boxShadow: selected ? "var(--shadow-glow)" : "none",
        position: "relative",
        textAlign: "center",
      }}
    >
      {opt.badge && (
        <div style={{
          position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
          background: opt.badge === "Best" ? "linear-gradient(135deg, var(--teal-600), var(--teal-400))" : "var(--gold)",
          color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 14px",
          borderRadius: "0 0 10px 10px",
        }}>{opt.badge}</div>
      )}
      <div style={{ fontSize: 40, marginBottom: 12 }}>{opt.icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, marginBottom: 8 }}>{opt.title}</div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>{opt.desc}</p>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--teal-700)", fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>
        {opt.currency}{opt.price}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{opt.time} session</div>
    </div>
  );
}

function ChatRoom({ doctor }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef();
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim(); setInput("");
    setMessages(m => [...m, { role: "user", text: msg, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 1400));
    setTyping(false);
    setMessages(m => [...m, {
      role: "doctor",
      text: "Thank you for that information. I recommend scheduling a follow-up dermatoscopy. In the meantime, apply SPF 50+ daily and avoid prolonged sun exposure.",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }]);
  };

  return (
    <div style={{ borderRadius: 20, border: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", flexDirection: "column", height: 500, overflow: "hidden" }}>
      {/* Chat header */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12,
        background: "linear-gradient(135deg, rgba(20,184,166,0.05), transparent)",
      }}>
        <div style={{ fontSize: 28 }}>{doctor.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{doctor.name}</div>
          <div style={{ fontSize: 12, color: "#10b981" }}>● Online · Typically replies in 2 min</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["📞", "📹", "📎"].map(icon => (
            <button key={icon} style={{
              width: 36, height: 36, border: "1px solid var(--border)", borderRadius: 10,
              background: "transparent", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "12px 16px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? "linear-gradient(135deg, var(--teal-600), var(--teal-500))" : "rgba(20,184,166,0.06)",
              border: m.role === "user" ? "none" : "1px solid rgba(20,184,166,0.15)",
              color: m.role === "user" ? "#fff" : "var(--text)",
              fontSize: 14, lineHeight: 1.65,
            }}>{m.text}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, paddingLeft: 4 }}>{m.time}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 5, padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(20,184,166,0.06)", width: "fit-content", alignItems: "center", border: "1px solid rgba(20,184,166,0.15)" }}>
            {[0, 0.25, 0.5].map((d, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal-400)", animation: `pulse-ring 1s ${d}s ease-in-out infinite` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
        <button style={{ width: 36, height: 36, border: "none", background: "transparent", cursor: "pointer", fontSize: 20 }}>📎</button>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="input" style={{ flex: 1, padding: "10px 14px", fontSize: 14 }}
        />
        <button onClick={send} className="btn-primary" style={{ padding: "10px 18px", fontSize: 14 }}>→</button>
      </div>
    </div>
  );
}

function VideoCallUI({ doctor, onEnd }) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  useEffect(() => { const iv = setInterval(() => setDuration(d => d + 1), 1000); return () => clearInterval(iv); }, []);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0a1628", zIndex: 200,
      display: "flex", flexDirection: "column",
    }}>
      {/* Main video area */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Doctor feed */}
        <div style={{
          width: "100%", height: "100%", maxWidth: 900,
          background: "linear-gradient(135deg, #0f2338, #0d1f2d)",
          borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16, color: "rgba(255,255,255,0.5)", fontSize: 80,
          position: "relative",
        }}>
          {doctor.avatar}
          <div style={{ fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>{doctor.name}</div>

          {/* Timer */}
          <div style={{
            position: "absolute", top: 20, left: 24,
            background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 8,
            padding: "4px 12px", fontSize: 14, fontFamily: "'DM Mono', monospace",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f43f5e", display: "inline-block", animation: "pulse-ring 1.5s infinite" }} />
            {fmt(duration)}
          </div>

          {/* E2E badge */}
          <div style={{
            position: "absolute", top: 20, right: 24,
            background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
            color: "#10b981", borderRadius: 8, padding: "4px 10px", fontSize: 12,
          }}>🔒 End-to-end encrypted</div>
        </div>

        {/* Self feed (PiP) */}
        <div style={{
          position: "absolute", bottom: 24, right: 24,
          width: 160, height: 110,
          background: videoOff ? "#1a2332" : "linear-gradient(135deg, #1e3a5f, #0f2338)",
          borderRadius: 14, border: "2px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: videoOff ? 14 : 30, color: "rgba(255,255,255,0.5)",
          overflow: "hidden",
        }}>
          {videoOff ? "Camera off" : "👤"}
        </div>
      </div>

      {/* Controls bar */}
      <div style={{
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        {[
          { icon: muted ? "🔇" : "🎤", label: muted ? "Unmute" : "Mute", action: () => setMuted(m => !m), active: muted },
          { icon: videoOff ? "📵" : "📹", label: videoOff ? "Start video" : "Stop video", action: () => setVideoOff(v => !v), active: videoOff },
          { icon: "🖥", label: "Share screen", action: () => {}, active: false },
          { icon: "🖊", label: "Annotate", action: () => {}, active: false },
          { icon: "⋮", label: "More", action: () => {}, active: false },
        ].map(btn => (
          <div key={btn.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <button onClick={btn.action} style={{
              width: 52, height: 52, borderRadius: "50%",
              background: btn.active ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.1)",
              border: `1px solid ${btn.active ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.15)"}`,
              cursor: "pointer", fontSize: 22,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>{btn.icon}</button>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{btn.label}</span>
          </div>
        ))}

        {/* End call */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button onClick={onEnd} style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "#f43f5e", border: "none", cursor: "pointer", fontSize: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(244,63,94,0.4)", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >📵</button>
          <span style={{ fontSize: 11, color: "#f43f5e" }}>End call</span>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ doctor, option, onSuccess, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState("upi");

  const handle = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setDone(true);
    setTimeout(onSuccess, 2000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
      zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "var(--bg-card)", borderRadius: 24, padding: 36,
        width: "100%", maxWidth: 440,
        boxShadow: "var(--shadow-lg)", animation: "fadeUp 0.3s ease",
      }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", marginBottom: 8 }}>Payment Successful!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Your consultation has been confirmed. Connecting you with {doctor.name}...</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif" }}>Complete Payment</h3>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "var(--text-muted)" }}>×</button>
            </div>

            {/* Order summary */}
            <div style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.15)", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{option.title} Consultation</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{option.currency}{option.price}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Doctor</span>
                <span style={{ fontSize: 14 }}>{doctor.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)", fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: "var(--teal-600)", fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>{option.currency}{option.price}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>Payment Method</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ id: "upi", icon: "📲", label: "UPI" }, { id: "card", icon: "💳", label: "Card" }, { id: "wallet", icon: "👛", label: "Wallet" }].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{
                    flex: 1, padding: "12px 8px",
                    border: `2px solid ${method === m.id ? "var(--teal-500)" : "var(--border)"}`,
                    borderRadius: 12,
                    background: method === m.id ? "rgba(20,184,166,0.06)" : "transparent",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span style={{ fontSize: 12, color: method === m.id ? "var(--teal-700)" : "var(--text-muted)", fontWeight: method === m.id ? 600 : 400 }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {method === "upi" && (
              <input className="input" placeholder="Enter UPI ID (e.g. name@upi)" style={{ marginBottom: 16 }} />
            )}

            <button
              className="btn-primary"
              onClick={handle}
              disabled={processing}
              style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px", opacity: processing ? 0.8 : 1 }}
            >
              {processing ? (
                <><span style={{ display: "inline-block", animation: "spin 0.6s linear infinite", marginRight: 8 }}>⟳</span>Processing…</>
              ) : `Pay ${option.currency}${option.price}`}
            </button>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 12 }}>
              🔒 Secured by Razorpay · 256-bit SSL encryption
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConsultationPage({ navigate }) {
  const [step, setStep] = useState("select"); // select | option | confirm | chat | video
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [filter, setFilter] = useState({ search: "", online: false });

  const doctor = DOCTORS.find(d => d.id === selectedDoctor);
  const option = CONSULT_OPTIONS.find(o => o.id === selectedOption);

  const filteredDoctors = DOCTORS.filter(d =>
    (!filter.online || d.online) &&
    (!filter.search || d.name.toLowerCase().includes(filter.search.toLowerCase()) || d.specialty.toLowerCase().includes(filter.search.toLowerCase()))
  );

  if (step === "video" && doctor) return <VideoCallUI doctor={doctor} onEnd={() => setStep("chat")} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar navigate={navigate} activePage="consultation" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px clamp(16px,4vw,40px) 60px" }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>320+ Verified Doctors</span>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", marginBottom: 12 }}>Consult a Dermatologist</h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 500 }}>
            Connect with a board-certified dermatologist via chat, voice, or video — available 24/7.
          </p>
        </div>

        {/* If chat is active */}
        {step === "chat" && doctor ? (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center" }}>
              <button onClick={() => setStep("confirm")} style={{ background: "none", border: "none", color: "var(--teal-600)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                ← Back
              </button>
              <button className="btn-primary" onClick={() => setStep("video")} style={{ padding: "10px 20px", fontSize: 14, marginLeft: "auto" }}>
                📹 Switch to Video Call
              </button>
            </div>
            <ChatRoom doctor={doctor} />
          </div>
        ) : step === "confirm" && doctor && option ? (
          /* Confirmation screen */
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <button onClick={() => setStep("option")} style={{ background: "none", border: "none", color: "var(--teal-600)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
              ← Change selection
            </button>
            <div style={{ padding: 32, borderRadius: 24, background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{option.icon}</div>
              <h2 style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", marginBottom: 8 }}>Ready to connect</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
                {option.title} with {doctor.name} · {option.time} session
              </p>
              <div style={{ padding: "16px 24px", borderRadius: 14, background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.15)", marginBottom: 24, textAlign: "left" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 32 }}>{doctor.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{doctor.name}</div>
                    <div style={{ fontSize: 13, color: "var(--teal-600)" }}>{doctor.specialty}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      <StarRating value={doctor.rating} />
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{doctor.rating} · {doctor.nextSlot}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => setShowPayment(true)} style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}>
                Proceed to Payment · {option.currency}{option.price} →
              </button>
            </div>
          </div>
        ) : step === "option" && doctor ? (
          /* Option selection */
          <div>
            <button onClick={() => setStep("select")} style={{ background: "none", border: "none", color: "var(--teal-600)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
              ← Change doctor
            </button>
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Choose consultation type</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>with {doctor.name}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 28 }}>
              {CONSULT_OPTIONS.map(opt => (
                <ConsultOptionCard key={opt.id} opt={opt} selected={selectedOption === opt.id} onSelect={setSelectedOption} />
              ))}
            </div>
            {selectedOption && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn-primary" onClick={() => setStep("confirm")} style={{ fontSize: 16, padding: "16px 48px" }}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Doctor selection */
          <div>
            {/* Search & filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
              <input
                value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                placeholder="Search doctors, specialties..."
                className="input" style={{ flex: 1, minWidth: 240, maxWidth: 400 }}
              />
              <button
                onClick={() => setFilter(f => ({ ...f, online: !f.online }))}
                style={{
                  padding: "12px 20px", border: `1.5px solid ${filter.online ? "var(--teal-500)" : "var(--border)"}`,
                  borderRadius: 10, background: filter.online ? "rgba(20,184,166,0.08)" : "transparent",
                  cursor: "pointer", fontSize: 14, color: filter.online ? "var(--teal-700)" : "var(--text-muted)",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: filter.online ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {filter.online ? "● Online only" : "● Show online only"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredDoctors.map(doc => (
                <DoctorCard
                  key={doc.id} doctor={doc}
                  selected={selectedDoctor === doc.id}
                  onSelect={setSelectedDoctor}
                />
              ))}
            </div>

            {selectedDoctor && (
              <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
                <button className="btn-primary" onClick={() => setStep("option")} style={{ fontSize: 16, padding: "16px 52px" }}>
                  Continue with {doctor?.name.split(" ")[1]} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showPayment && doctor && option && (
        <PaymentModal
          doctor={doctor} option={option}
          onSuccess={() => { setShowPayment(false); setStep("chat"); }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConfidenceRing from "../components/ConfidenceRing";
import DiseaseTabs from "../components/Diseasetabs";
import HeatmapViewer from "../components/Heatmapviewer";

const MOCK_RESULT = {
  disease: "Melanocytic Nevi",
  confidence: 94.2,
  severity: "Low",
  urgency: "Monitor",
  heatmapAvailable: true,
  allClasses: [
    { label: "Melanocytic Nevi", score: 94.2 },
    { label: "Benign Keratosis", score: 2.8 },
    { label: "Dermatofibroma", score: 1.1 },
    { label: "Basal Cell Carcinoma", score: 0.9 },
    { label: "Vascular Lesion", score: 0.5 },
    { label: "Actinic Keratosis", score: 0.3 },
    { label: "Melanoma", score: 0.2 },
  ],
};

const SEVERITY_CONFIG = {
  Low:      { color: "#10b981", bg: "#d1fae5", icon: "✅", label: "Low Risk" },
  Moderate: { color: "#f59e0b", bg: "#fef3c7", icon: "⚠️", label: "Moderate" },
  High:     { color: "#f43f5e", bg: "#ffe4ea", icon: "🚨", label: "High Risk" },
  "Very High": { color: "#7c3aed", bg: "#ede9fe", icon: "☣️", label: "Very High" },
};

function UploadZone({ onFileSelect, file, preview }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFileSelect(f);
  }, [onFileSelect]);

  const handleChange = (e) => { if (e.target.files[0]) onFileSelect(e.target.files[0]); };

  if (preview) {
    return (
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#000", aspectRatio: "4/3", maxHeight: 320 }}>
        <img src={preview} alt="Upload preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
        <button
          onClick={() => onFileSelect(null)}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.6)", color: "#fff",
            border: "none", borderRadius: "50%", width: 32, height: 32,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >×</button>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          padding: "24px 16px 12px",
          color: "#fff", fontSize: 13,
        }}>
          {file?.name} · {file ? (file.size / 1024).toFixed(1) + " KB" : ""}
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "var(--teal-500)" : "var(--border)"}`,
        borderRadius: 20,
        padding: "60px 32px",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "rgba(20,184,166,0.05)" : "var(--bg-card)",
        transition: "all 0.25s ease",
        transform: dragging ? "scale(1.01)" : "scale(1)",
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔬</div>
      <h3 style={{ fontSize: 20, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>
        Drop your skin image here
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
        JPEG, PNG, HEIC up to 10MB · Your image never leaves your device until analyzed
      </p>
      <span className="btn-primary" style={{ pointerEvents: "none", fontSize: 14, padding: "11px 24px" }}>
        Browse Files
      </span>
      <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {["📸 Camera capture", "🔒 End-to-end encrypted", "⚡ Results in <3s"].map(t => (
          <span key={t} style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--teal-50, rgba(20,184,166,0.06))", padding: "4px 12px", borderRadius: 100 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function AnalysisLoadingScreen() {
  const steps = ["Preprocessing image...", "Running AI model...", "Generating Grad-CAM heatmap...", "Calculating severity...", "Preparing your report..."];
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + 2));
    }, 60);
    const sv = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 600);
    return () => { clearInterval(iv); clearInterval(sv); };
  }, []);

  return (
    <div style={{
      textAlign: "center", padding: "60px 32px",
      background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)",
    }}>
      {/* Animated DNA/cell graphic */}
      <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 32px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            position: "absolute", inset: i * 10,
            borderRadius: "50%",
            border: `2px solid rgba(20,184,166,${0.8 - i * 0.25})`,
            animation: `spin ${2 + i}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
          }} />
        ))}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36,
        }}>🧬</div>
      </div>

      <h3 style={{ fontSize: 22, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>Analyzing your image</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>{steps[step]}</p>

      {/* Progress bar */}
      <div style={{ background: "var(--border)", borderRadius: 100, height: 8, maxWidth: 320, margin: "0 auto 12px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 100,
          background: "linear-gradient(90deg, var(--teal-600), var(--teal-400))",
          width: `${pct}%`, transition: "width 0.12s ease",
          boxShadow: "0 0 8px rgba(20,184,166,0.5)",
        }} />
      </div>
      <p style={{ fontSize: 13, color: "var(--teal-600)", fontFamily: "'DM Mono', monospace" }}>{pct}%</p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i <= step ? "var(--teal-500)" : "var(--border)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function ConfidenceBar({ label, score, isTop }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: isTop ? "var(--text)" : "var(--text-muted)", fontWeight: isTop ? 600 : 400 }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: isTop ? "var(--teal-600)" : "var(--text-muted)", fontWeight: isTop ? 600 : 400 }}>{score.toFixed(1)}%</span>
      </div>
      <div style={{ background: "var(--border)", borderRadius: 100, height: isTop ? 8 : 6, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 100,
          background: isTop ? "linear-gradient(90deg, var(--teal-600), var(--teal-400))" : "var(--teal-200, rgba(20,184,166,0.3))",
          width: `${score}%`, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

function UrgencySlider({ baseUrgency, onUrgencyChange }) {
  const [symptoms, setSymptoms] = useState({ itchy: false, bleeding: false, growing: false, painful: false, discolored: false });
  const SYMPTOM_WEIGHT = { itchy: 1, bleeding: 3, growing: 2, painful: 1, discolored: 2 };

  const totalWeight = Object.entries(symptoms).reduce((acc, [k, v]) => acc + (v ? SYMPTOM_WEIGHT[k] : 0), 0);
  const levels = ["Low", "Moderate", "High", "Very High"];
  const baseIdx = levels.indexOf(baseUrgency);
  const newIdx = Math.min(3, baseIdx + (totalWeight >= 5 ? 2 : totalWeight >= 2 ? 1 : 0));
  const urgency = levels[newIdx];

  const toggle = (k) => {
    const next = { ...symptoms, [k]: !symptoms[k] };
    setSymptoms(next);
    const w = Object.entries(next).reduce((a, [key, v]) => a + (v ? SYMPTOM_WEIGHT[key] : 0), 0);
    const idx = Math.min(3, baseIdx + (w >= 5 ? 2 : w >= 2 ? 1 : 0));
    onUrgencyChange?.(levels[idx]);
  };

  const cfg = SEVERITY_CONFIG[urgency];

  return (
    <div style={{ padding: 24, borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>🩺 Dynamic Urgency Calculator</h4>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Check any symptoms you're experiencing to recalculate urgency:</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {Object.keys(symptoms).map(k => (
          <button key={k} onClick={() => toggle(k)} style={{
            padding: "7px 14px", borderRadius: 100, border: `1.5px solid ${symptoms[k] ? "var(--teal-500)" : "var(--border)"}`,
            background: symptoms[k] ? "rgba(20,184,166,0.1)" : "transparent",
            color: symptoms[k] ? "var(--teal-700)" : "var(--text-muted)",
            cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s", fontWeight: symptoms[k] ? 600 : 400,
          }}>
            {symptoms[k] ? "✓ " : ""}{k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 18px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.color}30`, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 24 }}>{cfg.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: cfg.color, fontSize: 15 }}>Urgency: {urgency}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {urgency === "Low" && "No immediate action needed. Monitor regularly."}
            {urgency === "Moderate" && "Schedule a dermatology appointment within 2-4 weeks."}
            {urgency === "High" && "See a dermatologist within the next week."}
            {urgency === "Very High" && "Seek medical attention today — urgent evaluation needed."}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsPanel({ result, imageUrl, navigate }) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [urgency, setUrgency] = useState(result.severity);
  const sevCfg = SEVERITY_CONFIG[result.severity];

  const handleDownloadReport = () => {
    // Triggers browser print dialog — in production use jsPDF
    window.print();
  };

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>
      {/* Header */}
      <div style={{
        padding: "28px 32px",
        background: "linear-gradient(135deg, var(--teal-700), var(--teal-600))",
        borderRadius: "20px 20px 0 0",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>AI Analysis Complete</div>
          <h2 style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: 28 }}>{result.disease}</h2>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 12 }}>
              {sevCfg.icon} {result.severity} Risk
            </span>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", padding: "3px 10px", borderRadius: 100, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
              {result.confidence}% confidence
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleDownloadReport}
            style={{ padding: "10px 18px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
          >📄 Download PDF</button>
          <button
            onClick={() => navigate("consultation")}
            style={{ padding: "10px 18px", background: "#fff", color: "var(--teal-700)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
          >🩺 Consult Doctor →</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 20px 20px", padding: 32 }}>
        {/* Top grid: image + confidence */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }} className="results-top-grid">
          {/* Heatmap viewer */}
          <HeatmapViewer imageUrl={imageUrl} showHeatmap={showHeatmap} onToggle={() => setShowHeatmap(h => !h)} />

          {/* Confidence section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Ring + score */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px", borderRadius: 16, background: "rgba(20,184,166,0.04)", border: "1px solid rgba(20,184,166,0.12)" }}>
              <ConfidenceRing value={result.confidence} size={96} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, marginBottom: 4 }}>AI Confidence</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Based on HAM10000 dataset.<br />
                  <span style={{ color: "var(--teal-600)", fontWeight: 600 }}>Model accuracy: 94.2%</span>
                </div>
              </div>
            </div>

            {/* All class bars */}
            <div style={{ padding: "20px", borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--text-muted)" }}>All 7 classes</div>
              {result.allClasses.map((c, i) => (
                <ConfidenceBar key={c.label} label={c.label} score={c.score} isTop={i === 0} />
              ))}
            </div>
          </div>
        </div>

        {/* Urgency slider */}
        <div style={{ marginBottom: 28 }}>
          <UrgencySlider baseUrgency={result.severity} onUrgencyChange={setUrgency} />
        </div>

        {/* Disease tabs */}
        <DiseaseTabs disease={result.disease} />
      </div>

      <style>{`
        @media (max-width: 768px) { .results-top-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

export default function AnalysisPage({ navigate }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (f) => {
    if (!f) { setFile(null); setPreview(null); setResult(null); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate API call to /api/predict
    await new Promise(r => setTimeout(r, 3200));
    setAnalyzing(false);
    setResult(MOCK_RESULT);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar navigate={navigate} activePage="analysis" />

      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "100px clamp(16px,4vw,40px) 60px",
      }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>AI-Powered · Grad-CAM · 7 Conditions</span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 12 }}>Skin Analysis</h1>
          <p style={{ fontSize: 17, color: "var(--text-muted)", maxWidth: 520 }}>
            Upload a clear photo of your skin concern. Our AI analyzes it in seconds and provides a detailed clinical report.
          </p>
        </div>

        {/* Upload area */}
        {!result && (
          <div style={{ marginBottom: 28 }}>
            <UploadZone onFileSelect={handleFileSelect} file={file} preview={preview} />

            {preview && !analyzing && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <button className="btn-primary" onClick={handleAnalyze} style={{ fontSize: 16, padding: "16px 48px" }}>
                  🔬 Analyze Now
                </button>
              </div>
            )}

            {analyzing && (
              <div style={{ marginTop: 24 }}>
                <AnalysisLoadingScreen />
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => { setResult(null); setFile(null); setPreview(null); }}
                style={{ background: "none", border: "none", color: "var(--teal-600)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}
              >
                ← Upload another image
              </button>
            </div>
            <ResultsPanel result={result} imageUrl={preview} navigate={navigate} />
          </>
        )}

        {/* Tips row */}
        {!result && !analyzing && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 32 }}>
            {[
              { icon: "💡", title: "Good lighting", desc: "Natural light gives best results. Avoid flash glare." },
              { icon: "📐", title: "Close-up shot", desc: "Fill 70%+ of frame with the area of concern." },
              { icon: "🎯", title: "Stay still", desc: "Blurry images reduce AI accuracy significantly." },
            ].map(tip => (
              <div key={tip.title} style={{
                padding: "20px 24px", borderRadius: 16,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
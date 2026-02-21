import { useState } from "react";

const DISEASE_DB = {
  "Melanocytic Nevi": {
    overview: {
      description: "Melanocytic nevi — commonly called moles — are benign proliferations of melanocytes, the pigment-producing cells in your skin. Nearly all adults have between 10 and 40 moles. The vast majority are completely harmless and only require periodic self-monitoring.",
      symptoms: ["Round or oval shape with smooth edges", "Uniform tan, brown, or dark brown color", "Well-defined, sharp borders", "Usually less than 6mm in diameter (pencil eraser size)", "May be flat (junctional) or slightly raised (compound)"],
    },
    cancerRisk: {
      level: "Very Low",
      stats: [
        { label: "Malignant transformation risk", value: "<0.001% per year" },
        { label: "5-year survival if caught early", value: "99%+" },
        { label: "Average moles per adult", value: "10–40" },
      ],
      warningSigns: ["Asymmetry — one half unlike the other", "Border irregularity — ragged or notched", "Color variation — multiple shades in one mole", "Diameter >6mm (growing)", "Evolution — any change in size, shape, color"],
      prevention: ["Apply SPF 30+ broad-spectrum sunscreen daily", "Avoid tanning beds completely", "Wear UV-protective clothing & hats outdoors", "Seek shade between 10am–4pm (peak UV hours)"],
    },
    firstAid: [
      { period: "Daily", action: "Apply broad-spectrum SPF 30+ sunscreen to all exposed skin, even on cloudy days." },
      { period: "Monthly", action: "Perform a full-body skin self-exam using a mirror. Look for any ABCDE changes." },
      { period: "Quarterly", action: "Photograph your moles in consistent lighting to track changes over time." },
      { period: "Annually", action: "Visit a board-certified dermatologist for professional dermatoscopy." },
    ],
    treatment: {
      options: [
        { type: "Watch & Wait", desc: "Most nevi require no treatment — just regular monitoring.", icon: "👁" },
        { type: "Surgical Excision", desc: "Recommended if suspicious changes develop or for cosmetic removal.", icon: "🔪" },
        { type: "Laser Treatment", desc: "Available for flat nevi, though may not fully remove deeper cells.", icon: "⚡" },
      ],
      disclaimer: "This is general information only. Do not attempt to treat or remove moles yourself. Always consult a licensed dermatologist.",
    },
  },
  default: {
    overview: { description: "Consult your dermatologist for detailed information about this condition.", symptoms: ["Varies by condition"] },
    cancerRisk: { level: "Unknown", stats: [], warningLines: [], prevention: [] },
    firstAid: [{ period: "Immediate", action: "Consult a dermatologist for personalized advice." }],
    treatment: { options: [], disclaimer: "Consult a medical professional for treatment options." },
  },
};

const TABS = [
  { id: "overview",   label: "Overview",    icon: "📋" },
  { id: "cancer",     label: "Cancer Risk", icon: "🔬" },
  { id: "symptoms",   label: "Symptoms",    icon: "🩺" },
  { id: "firstaid",   label: "First Aid",   icon: "🚑" },
  { id: "treatment",  label: "Treatment",   icon: "💊" },
  { id: "progress",   label: "Progress",    icon: "📈" },
];

function OverviewTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text)", marginBottom: 24 }}>{data.description}</p>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" }}>Common Signs</h4>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {data.symptoms.map((s, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--text)", alignItems: "flex-start" }}>
            <span style={{ color: "var(--teal-500)", flexShrink: 0, marginTop: 2 }}>●</span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CancerRiskTab({ data }) {
  const [age, setAge] = useState(35);
  const [sunExposure, setSunExposure] = useState(5);
  const [familyHistory, setFamilyHistory] = useState(false);
  const score = Math.min(100, Math.round((age / 80) * 20 + sunExposure * 5 + (familyHistory ? 25 : 0)));
  const riskLabel = score < 25 ? "Low" : score < 50 ? "Moderate" : score < 75 ? "High" : "Very High";
  const riskColor = score < 25 ? "#10b981" : score < 50 ? "#f59e0b" : score < 75 ? "#f43f5e" : "#7c3aed";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Risk level badge */}
      <div style={{
        padding: "16px 20px", borderRadius: 14,
        background: data.level === "Very Low" ? "#d1fae5" : "#fef3c7",
        border: `1px solid ${data.level === "Very Low" ? "#10b981" : "#f59e0b"}30`,
      }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Baseline Cancer Risk</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: data.level === "Very Low" ? "#065f46" : "#92400e", fontFamily: "'Cormorant Garamond', serif" }}>{data.level}</div>
      </div>

      {/* Stats grid */}
      {data.stats?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {data.stats.map((s, i) => (
            <div key={i} style={{ padding: "16px", borderRadius: 12, background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.12)", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", color: "var(--teal-600)" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Personal risk calculator */}
      <div style={{ padding: 20, borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🧮 Personal Risk Calculator</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              Age <strong style={{ color: "var(--text)" }}>{age} years</strong>
            </label>
            <input type="range" min={18} max={80} value={age} onChange={e => setAge(+e.target.value)} style={{ width: "100%", accentColor: "var(--teal-500)" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              Sun exposure (hrs/day) <strong style={{ color: "var(--text)" }}>{sunExposure}h</strong>
            </label>
            <input type="range" min={0} max={10} value={sunExposure} onChange={e => setSunExposure(+e.target.value)} style={{ width: "100%", accentColor: "var(--teal-500)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input type="checkbox" id="fh" checked={familyHistory} onChange={e => setFamilyHistory(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--teal-500)" }} />
            <label htmlFor="fh" style={{ fontSize: 13, color: "var(--text)", cursor: "pointer" }}>Family history of melanoma</label>
          </div>
          {/* Score bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Your personalized risk score</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: riskColor }}>{riskLabel}</span>
            </div>
            <div style={{ height: 10, borderRadius: 100, background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${score}%`, borderRadius: 100, background: riskColor, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Warning signs */}
      {data.warningLines?.length > 0 && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--rose-500, #f43f5e)" }}>⚠️ ABCDE Warning Signs</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.warningLines.map((w, i) => (
              <li key={i} style={{ fontSize: 14, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#f43f5e", flexShrink: 0, marginTop: 2 }}>▲</span>{w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SymptomsTab({ data }) {
  const [checked, setChecked] = useState({});
  const symptoms = data.symptoms || [];
  const matchCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
        Check any symptoms you're experiencing. This helps personalize your urgency level.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {symptoms.map((s, i) => (
          <label key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
            padding: "12px 16px", borderRadius: 12,
            background: checked[i] ? "rgba(20,184,166,0.06)" : "var(--bg-card)",
            border: `1.5px solid ${checked[i] ? "var(--teal-400)" : "var(--border)"}`,
            transition: "all 0.2s",
          }}>
            <input
              type="checkbox" checked={!!checked[i]}
              onChange={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{ marginTop: 2, accentColor: "var(--teal-500)", width: 16, height: 16, flexShrink: 0 }}
            />
            <span style={{ fontSize: 14, color: "var(--text)" }}>{s}</span>
          </label>
        ))}
      </div>
      {matchCount > 0 && (
        <div style={{
          padding: "14px 18px", borderRadius: 12,
          background: matchCount >= 3 ? "#ffe4ea" : "rgba(20,184,166,0.08)",
          border: `1px solid ${matchCount >= 3 ? "#f43f5e40" : "rgba(20,184,166,0.2)"}`,
          fontSize: 14, color: matchCount >= 3 ? "#be123c" : "var(--teal-700)",
        }}>
          {matchCount >= 3
            ? `🚨 ${matchCount} symptoms matched — consider seeing a dermatologist soon.`
            : `✅ ${matchCount} symptom${matchCount > 1 ? "s" : ""} matched. Continue monitoring.`}
        </div>
      )}
    </div>
  );
}

function FirstAidTab({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {data.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 20, paddingBottom: i < data.length - 1 ? 24 : 0 }}>
          {/* Timeline line */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--teal-600), var(--teal-400))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
              fontFamily: "'DM Mono', monospace",
            }}>
              {i + 1}
            </div>
            {i < data.length - 1 && (
              <div style={{ flex: 1, width: 2, background: "var(--border)", marginTop: 4, marginBottom: 4, minHeight: 24 }} />
            )}
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 12, color: "var(--teal-600)", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.period}</div>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7 }}>{step.action}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TreatmentTab({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.options.map((opt, i) => (
        <div key={i} style={{
          padding: "18px 20px", borderRadius: 14,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          display: "flex", gap: 16, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>{opt.icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{opt.type}</div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{opt.desc}</p>
          </div>
        </div>
      ))}
      <div style={{
        padding: "14px 18px", borderRadius: 12,
        background: "#fef9ec", border: "1px solid #f59e0b40",
        fontSize: 13, color: "#92400e",
      }}>
        ⚠️ {data.disclaimer}
      </div>
    </div>
  );
}

function ProgressTab() {
  const [entries, setEntries] = useState([
    { date: "2025-03-01", size: 5.2, severity: "Low", note: "First scan" },
    { date: "2025-06-15", size: 5.4, severity: "Low", note: "Slight growth" },
    { date: "2025-09-20", size: 5.3, severity: "Low", note: "Stable" },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
        Upload follow-up images to track changes over time. Our AI compares lesion size and severity automatically.
      </p>

      {/* Mini timeline chart */}
      <div style={{ padding: 20, borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Size Trend (mm)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 80 }}>
          {entries.map((e, i) => {
            const maxSize = Math.max(...entries.map(x => x.size));
            const h = (e.size / maxSize) * 70;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 11, color: "var(--teal-600)", fontFamily: "'DM Mono', monospace" }}>{e.size}mm</div>
                <div style={{
                  width: "100%", height: h, borderRadius: "4px 4px 0 0",
                  background: "linear-gradient(to top, var(--teal-600), var(--teal-400))",
                  transition: "height 0.6s ease",
                }} />
                <div style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>{e.date.slice(5)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Entries list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.map((e, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "12px 16px",
            borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 20 }}>📸</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{e.date}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{e.note} · {e.size}mm</div>
            </div>
            <span className="badge badge-green" style={{ fontSize: 11 }}>{e.severity}</span>
          </div>
        ))}
      </div>

      {/* Upload button */}
      <button className="btn-outline" style={{ alignSelf: "flex-start" }}>
        + Upload Follow-up Image
      </button>
    </div>
  );
}

export default function DiseaseTabs({ disease }) {
  const [activeTab, setActiveTab] = useState("overview");
  const data = DISEASE_DB[disease] || DISEASE_DB.default;

  return (
    <div style={{
      borderRadius: 20, background: "var(--bg-card)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      {/* Tab header */}
      <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--border)", background: "rgba(20,184,166,0.02)" }}>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: "1px" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? "var(--teal-600)" : "var(--text-muted)",
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--teal-500)" : "transparent"}`,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: 28, animation: "fadeIn 0.25s ease" }} key={activeTab}>
        {activeTab === "overview"   && <OverviewTab data={data.overview} />}
        {activeTab === "cancer"     && <CancerRiskTab data={data.cancerRisk} />}
        {activeTab === "symptoms"   && <SymptomsTab data={data.overview} />}
        {activeTab === "firstaid"   && <FirstAidTab data={data.firstAid} />}
        {activeTab === "treatment"  && <TreatmentTab data={data.treatment} />}
        {activeTab === "progress"   && <ProgressTab />}
      </div>
    </div>
  );
}
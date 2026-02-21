import { useState } from "react";

const QUESTIONS = [
  { id: "location",  label: "Where is the skin concern?", type: "select",
    options: ["Face", "Neck", "Arms", "Legs", "Torso", "Back", "Scalp", "Other"] },
  { id: "duration",  label: "How long have you had this?", type: "select",
    options: ["< 1 week", "1–4 weeks", "1–3 months", "3–12 months", "Over 1 year"] },
  { id: "symptoms",  label: "Which symptoms are present?", type: "multi",
    options: ["Itching", "Pain/Burning", "Bleeding", "Oozing", "Growing", "Color changing", "None"] },
  { id: "context",   label: "Any recent changes in your life?", type: "multi",
    options: ["New product/soap", "Sun exposure increase", "Stress", "New medication", "Travel abroad", "None"] },
];

export default function SymptomChecker({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];

  const selectAnswer = (val) => {
    if (q.type === "multi") {
      const curr = answers[q.id] || [];
      const next = curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val];
      setAnswers(a => ({ ...a, [q.id]: next }));
    } else {
      setAnswers(a => ({ ...a, [q.id]: val }));
    }
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
    else { setDone(true); onComplete?.(answers); }
  };

  const isSelected = (val) => {
    if (q.type === "multi") return (answers[q.id] || []).includes(val);
    return answers[q.id] === val;
  };

  const canContinue = q.type === "multi" ? (answers[q.id]?.length > 0) : !!answers[q.id];

  if (done) {
    const hasSerious = (answers.symptoms || []).some(s => ["Bleeding", "Growing", "Color changing"].includes(s));
    return (
      <div style={{
        padding: 28, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{hasSerious ? "⚠️" : "✅"}</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 8 }}>
          {hasSerious ? "Consider seeing a doctor soon" : "Low urgency noted"}
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.7 }}>
          {hasSerious
            ? "Based on your symptoms (bleeding, growth, or color change), we recommend a dermatology consultation within the week."
            : "Your symptoms suggest a lower urgency concern. Continue monitoring and use our AI analysis for a detailed assessment."}
        </p>
        <button className="btn-primary" onClick={() => { setDone(false); setStep(0); setAnswers({}); }}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, borderRadius: 20, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 100,
            background: i <= step ? "var(--teal-500)" : "var(--border)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Question {step + 1} of {QUESTIONS.length}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, marginBottom: 20 }}>{q.label}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {q.options.map(opt => (
          <button key={opt} onClick={() => selectAnswer(opt)} style={{
            padding: "12px 16px", borderRadius: 12, textAlign: "left",
            border: `1.5px solid ${isSelected(opt) ? "var(--teal-500)" : "var(--border)"}`,
            background: isSelected(opt) ? "rgba(20,184,166,0.07)" : "transparent",
            cursor: "pointer", fontSize: 14, color: "var(--text)",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: q.type === "multi" ? 18 : 18, height: 18,
              borderRadius: q.type === "multi" ? 4 : "50%",
              border: `2px solid ${isSelected(opt) ? "var(--teal-500)" : "var(--border)"}`,
              background: isSelected(opt) ? "var(--teal-500)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
            }}>
              {isSelected(opt) && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            {opt}
          </button>
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={next}
        disabled={!canContinue}
        style={{ width: "100%", justifyContent: "center", opacity: canContinue ? 1 : 0.5, cursor: canContinue ? "pointer" : "not-allowed" }}
      >
        {step === QUESTIONS.length - 1 ? "See Results" : "Next →"}
      </button>
    </div>
  );
}
import { useState } from "react";

const COLORMAPS = [
  { id: "red-hot", label: "🔴 Red-Hot", gradient: "linear-gradient(90deg, #000, #8b0000, #ff0000, #ff8c00, #ffd700, #fff)" },
  { id: "jet",     label: "🌈 Jet",     gradient: "linear-gradient(90deg, #00007f, #0000ff, #007fff, #00ffff, #7fff00, #ffff00, #ff7f00, #ff0000, #7f0000)" },
  { id: "inferno", label: "🌋 Inferno", gradient: "linear-gradient(90deg, #000004, #1b0c41, #4a0c4e, #781c6d, #a52c60, #cf4446, #ed6925, #fb9b06, #f7d13d, #fcffa4)" },
  { id: "viridis", label: "🌿 Viridis", gradient: "linear-gradient(90deg, #440154, #3b528b, #21918c, #5ec962, #fde725)" },
];

export default function HeatmapViewer({ imageUrl, showHeatmap, onToggle }) {
  const [opacity, setOpacity] = useState(70);
  const [colormap, setColormap] = useState("red-hot");
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [colormapOpen, setColormapOpen] = useState(false);

  const selectedCM = COLORMAPS.find(c => c.id === colormap);

  const handleMouseDown = (e) => { setDragging(true); setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const handleMouseMove = (e) => { if (!dragging) return; setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y }); };
  const handleMouseUp = () => setDragging(false);
  const resetView = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Image container */}
      <div style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "#111",
        aspectRatio: "4/3",
        cursor: zoom > 1 ? "grab" : "default",
        userSelect: "none",
      }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => { e.preventDefault(); setZoom(z => Math.max(1, Math.min(4, z - e.deltaY * 0.001))); }}
      >
        {/* Original image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Skin analysis"
            draggable={false}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              transition: dragging ? "none" : "transform 0.2s",
            }}
          />
        )}
        {/* Heatmap overlay */}
        {showHeatmap && (
          <div style={{
            position: "absolute", inset: 0,
            background: selectedCM.gradient,
            mixBlendMode: "overlay",
            opacity: opacity / 100,
            transition: "opacity 0.2s",
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          }} />
        )}
        {/* Corner labels */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
          color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 6,
        }}>
          {showHeatmap ? `Grad-CAM · ${selectedCM.label.split(" ")[1]} colormap` : "Original Image"}
        </div>
        {zoom > 1 && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 6,
          }}>
            {zoom.toFixed(1)}×
          </div>
        )}
        {/* AI detection hotspot (mock) */}
        {showHeatmap && (
          <div style={{
            position: "absolute",
            top: "30%", left: "35%",
            width: 80, height: 80,
            borderRadius: "50%",
            border: "2px dashed rgba(255,100,100,0.8)",
            boxShadow: "0 0 20px rgba(255,100,100,0.4)",
            animation: "pulse-ring 2s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        {/* Toggle heatmap */}
        <button
          onClick={onToggle}
          style={{
            padding: "8px 16px", border: "none", borderRadius: 10,
            background: showHeatmap ? "var(--teal-600)" : "var(--border)",
            color: showHeatmap ? "#fff" : "var(--text)",
            cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500, transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {showHeatmap ? "🔥 Heatmap ON" : "🔥 Heatmap OFF"}
        </button>

        {/* Opacity slider */}
        {showHeatmap && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Opacity</span>
            <input
              type="range" min={10} max={100} value={opacity}
              onChange={e => setOpacity(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--teal-500)" }}
            />
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "var(--text-muted)", width: 32 }}>{opacity}%</span>
          </div>
        )}

        {/* Colormap picker */}
        {showHeatmap && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setColormapOpen(o => !o)}
              style={{
                padding: "8px 14px", border: "1px solid var(--border)", borderRadius: 10,
                background: "var(--bg-card)", color: "var(--text)",
                cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <div style={{ width: 24, height: 8, borderRadius: 4, background: selectedCM.gradient }} />
              {selectedCM.label.split(" ").slice(1).join(" ")} ▾
            </button>
            {colormapOpen && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 8px)", left: 0,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 8, minWidth: 170, zIndex: 50,
                boxShadow: "var(--shadow-md)",
              }}>
                {COLORMAPS.map(cm => (
                  <button key={cm.id} onClick={() => { setColormap(cm.id); setColormapOpen(false); }}
                    style={{
                      width: "100%", padding: "8px 12px", border: "none",
                      background: colormap === cm.id ? "rgba(20,184,166,0.08)" : "transparent",
                      borderRadius: 8, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)",
                    }}>
                    <div style={{ width: 40, height: 10, borderRadius: 4, background: cm.gradient, flexShrink: 0 }} />
                    {cm.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Zoom controls */}
        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {[["−", () => setZoom(z => Math.max(1, z - 0.5))], ["⊞", resetView], ["+", () => setZoom(z => Math.min(4, z + 0.5))]].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{
              width: 32, height: 32, border: "1px solid var(--border)",
              borderRadius: 8, background: "var(--bg-card)", cursor: "pointer",
              fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Mono', monospace", color: "var(--text)",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Export hint */}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{
          flex: 1, padding: "8px 0", border: "1px solid var(--border)", borderRadius: 10,
          background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
        }}>📥 Export Heatmap PNG</button>
        <button style={{
          flex: 1, padding: "8px 0", border: "1px solid var(--border)", borderRadius: 10,
          background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
        }}>🖊 Annotate</button>
      </div>
    </div>
  );
}
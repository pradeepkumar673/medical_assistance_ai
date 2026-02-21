/**
 * SkinHealth AI — Root App Component
 * ────────────────────────────────────
 * SETUP INSTRUCTIONS:
 *
 * 1. In your main.jsx / index.js add:
 *      import './styles/globals.css'
 *
 * 2. Add to index.html <head>:
 *    <link rel="preconnect" href="https://fonts.googleapis.com">
 *    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * 3. File structure:
 *    src/
 *    ├── App.jsx
 *    ├── styles/globals.css
 *    ├── pages/
 *    │   ├── LandingPage.jsx
 *    │   ├── Dashboard.jsx
 *    │   ├── AnalysisPage.jsx
 *    │   └── ConsultationPage.jsx
 *    └── components/
 *        ├── Navbar.jsx
 *        ├── ConfidenceRing.jsx
 *        ├── DiseaseTabs.jsx
 *        ├── HeatmapViewer.jsx
 *        └── SymptomChecker.jsx
 */

import { useState } from "react";
import LandingPage      from "./pages/LandingPage";
import Dashboard        from "./pages/Dashboard";
import AnalysisPage     from "./pages/AnalysisPage";
import ConsultationPage from "./pages/ConsultationPage";

export default function App() {
  const [page, setPage] = useState("landing");
  const [pageData, setPageData] = useState(null);

  const navigate = (p, data = null) => {
    setPage(p);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {page === "landing"      && <LandingPage      navigate={navigate} />}
      {page === "dashboard"    && <Dashboard         navigate={navigate} />}
      {page === "analysis"     && <AnalysisPage      navigate={navigate} data={pageData} />}
      {page === "consultation" && <ConsultationPage  navigate={navigate} data={pageData} />}
    </>
  );
}
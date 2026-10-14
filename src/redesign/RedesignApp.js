import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./redesign.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Signal from "./lib/signalImage";
import * as veil from "./lib/veil";
import { TOK, readTokens } from "./lib/env";
import { startCursor } from "./lib/cursor";
import { useVersion } from "../version/VersionContext";

const THEME_KEY = "ee-theme";
const readTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};
const applyTheme = (t) => {
  if (t === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
  readTokens();
  Signal.all.forEach((s) => s.retheme());
};

// Route changes play the Bayer veil: cover, swap the page, scroll to top, uncover.
function TransitionRoutes() {
  const location = useLocation();
  const [shown, setShown] = useState(location);

  useEffect(() => {
    if (location.key === shown.key) return undefined;
    if (location.pathname === shown.pathname) {
      setShown(location); // hash / search only
      return undefined;
    }
    let live = true;
    veil.cover(TOK.bg).then(() => {
      if (!live) return;
      setShown(location);
      window.scrollTo(0, 0);
      requestAnimationFrame(() => veil.uncover(TOK.bg));
    });
    return () => { live = false; };
  }, [location, shown]);

  return (
    <Routes location={shown}>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function RedesignApp() {
  const { setVersion } = useVersion();
  const [theme, setTheme] = useState(readTheme);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const stop = startCursor();
    return () => {
      stop();
      veil.remove();
      delete document.documentElement.dataset.theme; // the classic site has its own palette
    };
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = theme === "light" ? "dark" : "light";
    const nextBg = next === "light" ? TOK.paper : TOK.ink;
    await veil.cover(nextBg, 280);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked */ }
    applyTheme(next);
    setTheme(next);
    await veil.uncover(nextBg, 460);
  }, [theme]);

  const toClassic = useCallback(() => setVersion("classic"), [setVersion]);

  return (
    <div className="rd">
      <Nav theme={theme} onToggleTheme={toggleTheme} onClassic={toClassic} />
      <main id="main" tabIndex={-1}>
        <TransitionRoutes />
      </main>
      <Footer onClassic={toClassic} />
    </div>
  );
}

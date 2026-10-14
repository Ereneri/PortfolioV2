import { createContext, useCallback, useContext, useState } from "react";

// Which version of the site to show: the redesign ("new") or the original ("classic").
// An explicit choice always wins. With no choice, devices that ask for reduced motion get
// the classic site and everyone else gets the redesign. ?ui=new|classic records a choice
// (handy for links and testing).
const KEY = "ee-version";
const VersionContext = createContext({ version: "new", setVersion: () => {} });

function initialVersion() {
  try {
    const ui = new URLSearchParams(window.location.search).get("ui");
    if (ui === "new" || ui === "classic") {
      localStorage.setItem(KEY, ui);
      return ui;
    }
    const saved = localStorage.getItem(KEY);
    if (saved === "new" || saved === "classic") return saved;
  } catch {
    // storage blocked: fall through to the device preference
  }
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "classic" : "new";
}

export function VersionProvider({ children }) {
  const [version, setState] = useState(initialVersion);
  const setVersion = useCallback((v) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      // storage blocked: the switch still works for this visit
    }
    setState(v);
    window.scrollTo(0, 0);
  }, []);
  return <VersionContext.Provider value={{ version, setVersion }}>{children}</VersionContext.Provider>;
}

export const useVersion = () => useContext(VersionContext);

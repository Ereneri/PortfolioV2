import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CircleHalf, ClockCounterClockwise, List, X } from "@phosphor-icons/react";
import { BrandGlyph } from "./Bits";

const LINKS = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["About", "/about"],
];

export default function Nav({ theme, onToggleTheme, onClassic }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const menu = useRef(null);
  const { pathname } = useLocation();

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // mobile menu: focus moves in, main goes inert, Escape closes and focus returns
  useEffect(() => {
    const main = document.getElementById("main");
    if (!open) {
      main?.removeAttribute("inert");
      return undefined;
    }
    main?.setAttribute("inert", "");
    menu.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
    };
  }, [open]);

  const light = theme === "light";
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <div className="wrap nav-in">
          <Link className="brand" to="/" data-cursor="Home">
            <BrandGlyph theme={theme} />
            <span>Ereneri<span className="dim">.dev</span></span>
          </Link>
          <div className="nav-right">
            <nav aria-label="Main">
              <ul className="nav-links">
                {LINKS.map(([name, to]) => (
                  <li key={to}>
                    <NavLink className="nav-link" to={to} end={to === "/"}>{name}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <button type="button" className="ver-btn" onClick={onClassic} data-cursor="Switch">
              <ClockCounterClockwise aria-hidden="true" />
              Classic<span className="sr-only"> site</span>
            </button>
            <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label="Light theme" aria-pressed={light} data-cursor="Invert">
              <CircleHalf aria-hidden="true" />
            </button>
            <button
              ref={btn}
              type="button"
              className="icon-btn menu-btn"
              aria-expanded={open}
              aria-controls="mnav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
      <nav ref={menu} className="mnav" id="mnav" aria-label="Mobile" hidden={!open}>
        {LINKS.map(([name, to]) => (
          <NavLink key={to} to={to} end={to === "/"}>{name}</NavLink>
        ))}
        <button type="button" className="mnav-classic" onClick={onClassic}>Classic site</button>
      </nav>
    </>
  );
}

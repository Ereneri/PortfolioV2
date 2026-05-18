import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  CommandLineIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  const navLinks = [
    { name: "Home", href: "/", Icon: HomeIcon },
    { name: "Projects", href: "/projects", Icon: CommandLineIcon },
    { name: "About", href: "/about", Icon: UserIcon },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on route change (handled by onClick on each link)
  const getLinkClass = ({ isActive }) =>
    [
      "no-underline px-3 py-1.5 rounded-md transition-colors duration-150",
      "text-sm font-medium flex items-center gap-1.5",
      isActive
        ? "primary-text bg-white/10 nav-active-bar"
        : "text-white/80 hover:text-white hover:bg-white/10",
    ].join(" ");

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header
        ref={navRef}
        className="w-full sticky top-0 z-50 code-font bg-secondary border-b border-white/10 backdrop-blur-sm"
      >
        <nav
          className="max-w-[1100px] mx-auto flex flex-col px-4 py-3 gap-0"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Top row */}
          <div className="flex items-center justify-between w-full">
            <NavLink
              to="/"
              className="text-white text-base font-semibold no-underline tracking-tight"
              onClick={() => setOpen(false)}
            >
              ereneri<span className="primary-text">.dev</span>
            </NavLink>

            {/* Desktop nav links */}
            <ul className="hidden md:flex list-none gap-1 m-0 p-0">
              {navLinks.map(({ name, href, Icon }) => (
                <li key={name}>
                  <NavLink to={href} end={href === "/"} className={getLinkClass}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger / close */}
            <button
              className="md:hidden p-1.5 rounded-md text-white hover:bg-white/10 transition-colors"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((s) => !s)}
            >
              {open ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile dropdown */}
          <ul
            id="mobile-menu"
            className={[
              "flex flex-col list-none gap-1 m-0 p-0 w-full md:hidden",
              "overflow-hidden transition-all duration-200 ease-in-out",
              open ? "max-h-64 opacity-100 pt-2" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            {navLinks.map(({ name, href, Icon }) => (
              <li key={name}>
                <NavLink
                  to={href}
                  end={href === "/"}
                  onClick={() => setOpen(false)}
                  className={getLinkClass}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}

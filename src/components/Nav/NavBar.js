import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, CommandLineIcon, HomeIcon, UserIcon } from "@heroicons/react/16/solid";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/", Icon: HomeIcon },
    { name: "Projects", href: "/projects", Icon: CommandLineIcon },
    { name: "About", href: "/about", Icon: UserIcon },
  ];

  const getLinkClass = ({ isActive }) =>
    `no-underline px-2 py-1 rounded-md transition-colors duration-150 text-lg flex items-center ${
      isActive
        ? "primary-text bg-white/10"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <header className="w-full sticky top-0 z-50 code-font bg-secondary">
      <nav
        className="max-w-[1100px] mx-auto flex flex-col p-4 gap-2"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Top row: brand on left, links/hamburger on right */}
        <div className="flex items-center justify-between w-full">
          <NavLink to="/" className="text-white text-lg font-semibold no-underline">
            ereneri<span className="primary-text">.dev</span>
          </NavLink>

          {/* Desktop nav links */}
          <ul className="hidden md:flex list-none gap-4 m-0 p-0">
            {navLinks.map(({ name, href, Icon }) => (
              <li key={name}>
                <NavLink
                  to={href}
                  end={href === "/"}
                  className={getLinkClass}
                >
                  <Icon className="w-5 h-5 inline-block mr-1 stroke-2" />
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden bg-transparent border-none cursor-pointer"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((s) => !s)}
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mobile dropdown */}
        <ul
          className={`
            flex flex-col list-none gap-4 m-0 p-0 w-full md:hidden
            overflow-hidden transition-all duration-300 ease-in-out
            ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {navLinks.map(({ name, href, Icon }) => (
            <li key={name}>
              <NavLink
                to={href}
                end={href === "/"}
                onClick={() => setOpen(false)}
                className={getLinkClass}
              >
                <Icon className="w-5 h-5 inline-block mr-1 stroke-2" />
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

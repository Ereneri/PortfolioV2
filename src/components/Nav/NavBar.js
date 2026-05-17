import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, Bars4Icon, CommandLineIcon, HomeIcon, UserIcon } from "@heroicons/react/16/solid";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/", Icon : HomeIcon},
    { name: "Projects", href: "/projects", Icon: CommandLineIcon },
    { name: "About", href: "/about", Icon : UserIcon  },
  ];

  return (
    <header className="w-full sticky top-0 z-50 code-font bg-secondary">
      <nav
        className="max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-center md:justify-center p-4 gap-2"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile top row: brand on left, hamburger on right */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Link to="/" className="text-white text-lg font-semibold no-underline">
            ereneri<span className="primary-text">.dev</span>
          </Link>
          <button
            className="bg-transparent border-none cursor-pointer"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((s) => !s)}
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
        </div>

        <ul 
          className={`
            flex flex-col list-none gap-4 m-0 p-0 w-full
            md:flex-row md:w-auto
            overflow-hidden transition-all duration-300 ease-in-out
            ${open ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100 md:mt-0'}
          `}
        >

          {navLinks.map(({ name, href, Icon }) => (
            <li key={name}>
              <Link
                to={href}
                onClick={() => {
                  setOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="no-underline text-white px-2 py-1 rounded-md transition-colors duration-150 text-lg hover:bg-white/10 flex items-center"
            >
              <Icon className="w-5 h-5 inline-block mr-1 text-white stroke-2" />
              {name}
            </Link>
          </li>
        ))}
        </ul>
      </nav>
    </header>
  );
}

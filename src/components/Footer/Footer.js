import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, CommandLineIcon, UserIcon } from "@heroicons/react/16/solid";
import githubIcon from "../../assets/github-mark-white.svg";
import linkedinIcon from "../../assets/linkedin.svg";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/", Icon: HomeIcon },
    { name: "Projects", href: "/projects", Icon: CommandLineIcon },
    { name: "About", href: "/about", Icon: UserIcon },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/Ereneri", icon: githubIcon },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/eren-erisgen/", icon: linkedinIcon },
  ];

  const linkClass =
    "flex items-center gap-2 no-underline text-white px-2 py-1 rounded-md transition-colors duration-150 text-lg hover:bg-white/10";

  return (
    <footer className="w-full bg-secondary mt-16">
      <div className="max-w-[1100px] mx-auto p-8">
        <div className="grid grid-cols-2 gap-8 code-font">

          {/* Left — Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-light/40 uppercase tracking-widest">
              Navigation
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-1 list-none m-0 p-0">
                {quickLinks.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <Link
                      to={href}
                      onClick={() => window.scrollTo(0, 0)}
                      className={linkClass}
                    >
                      <Icon className="w-5 h-5" />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right — Social Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-light/40 uppercase tracking-widest">
              Find me on
            </h3>
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              {socialLinks.map(({ name, href, icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <img src={icon} alt={name} className="w-5 h-5" />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-white/20">
          <p className="text-light/40 text-sm code-font">
            © {new Date().getFullYear()} Eren Erisgen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

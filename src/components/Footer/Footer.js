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
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/eren-erisgen/",
      icon: linkedinIcon,
    },
  ];

  const linkClass =
    "inline-flex items-center gap-2 no-underline text-white/60 hover:text-white px-2 py-1 rounded-md transition-colors duration-150 text-sm";

  return (
    <footer className="w-full bg-secondary border-t border-white/10 mt-16">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 code-font">

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Navigation
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
                {quickLinks.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <Link
                      to={href}
                      onClick={() => window.scrollTo(0, 0)}
                      className={linkClass}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Find me on
            </h3>
            <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
              {socialLinks.map(({ name, href, icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <img src={icon} alt="" aria-hidden="true" className="w-4 h-4 shrink-0" />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <p className="text-white/30 text-xs code-font">
            © {new Date().getFullYear()} Eren Erisgen
          </p>
          <p className="text-white/20 text-xs code-font">
            ereneri<span className="text-white/40">.dev</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

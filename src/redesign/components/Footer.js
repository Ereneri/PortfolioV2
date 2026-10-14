import { Link } from "react-router-dom";
import { ArrowUp, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import AsciiWordmark from "./AsciiWordmark";
import { Rule } from "./Bits";

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

export default function Footer({ onClassic }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <Rule at="66.6%" />
        <div className="grid foot-grid">
          <div className="foot-col" style={{ gridColumn: "1 / 4" }}>
            <p className="t-meta">Navigation</p>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          <div className="foot-col" style={{ gridColumn: "5 / 8" }}>
            <p className="t-meta">Find me on</p>
            <ul>
              <li>
                <a href="https://github.com/Ereneri" target="_blank" rel="noopener noreferrer">
                  <GithubLogo aria-hidden="true" />GitHub<NewTab />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/eren-erisgen/" target="_blank" rel="noopener noreferrer">
                  <LinkedinLogo aria-hidden="true" />LinkedIn<NewTab />
                </a>
              </li>
            </ul>
          </div>
          <div className="foot-col foot-top" style={{ gridColumn: "9 / -1" }}>
            <a className="link" href="#main" data-cursor="Top" onClick={() => window.scrollTo({ top: 0 })}>
              Back to top <ArrowUp className="i-up" aria-hidden="true" />
            </a>
          </div>
        </div>
        <AsciiWordmark />
        <div className="foot-base">
          <span className="t-meta">&copy; {new Date().getFullYear()} Eren Erisgen</span>
          <span className="foot-links">
            <button type="button" className="t-meta" onClick={onClassic}>Switch to the classic site</button>
            <a className="t-meta" href="https://github.com/Ereneri/PortifolioV2" target="_blank" rel="noopener noreferrer">
              Source on GitHub<NewTab />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import AsciiTitle from "../components/AsciiTitle";
import Reveal from "../components/Reveal";
import SignalImage from "../components/SignalImage";
import { Status, Ticks } from "../components/Bits";
import { coverProps, projects } from "../lib/data";
import { clean, isDev } from "../lib/env";

const pad = (n) => String(n).padStart(2, "0");
const sourceOf = (p) => (p.githubUrl ? "GitHub" : p.liveUrl ? new URL(p.liveUrl).host : "Private");

// Stack filters: technologies used by two or more projects, most used first.
const freq = {};
projects.forEach((p) => p.technologies.forEach((t) => (freq[t] = (freq[t] || 0) + 1)));
const COMMON = Object.keys(freq).filter((t) => freq[t] > 1).sort((a, b) => freq[b] - freq[a] || a.localeCompare(b));

export default function Projects() {
  const [q, setQ] = useState("");
  const [tech, setTech] = useState(null);
  const [activeId, setActiveId] = useState(projects[0].id);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) =>
      (!term || [p.name, p.description, ...p.technologies].some((s) => s.toLowerCase().includes(term))) &&
      (!tech || p.technologies.includes(tech)),
    );
  }, [q, tech]);

  // keep the preview on a visible project
  const active = shown.find((p) => p.id === activeId) || shown[0] || null;
  const reset = () => { setQ(""); setTech(null); };

  return (
    <>
      <section className="wrap pl-head" aria-labelledby="pl-title">
        <div className="grid">
          <AsciiTitle as="h1" className="pl-title" id="pl-title" text="Projects" max={26} decode="load" delay={150} />
          <p className="t-meta pl-count" aria-live="polite">{pad(shown.length)} / {pad(projects.length)} files</p>
        </div>
        <div className="pl-tools grid">
          <div className="field pl-search">
            <label className="t-meta" htmlFor="q">Search files</label>
            <div className="search">
              <span className="prompt" aria-hidden="true">&gt;</span>
              <input id="q" type="search" autoComplete="off" spellCheck="false" placeholder="Name, description or technology" value={q} onChange={(e) => setQ(e.target.value)} />
              {q && (
                <button type="button" className="clear" aria-label="Clear search" data-cursor="Clear" onClick={() => setQ("")}>
                  <X aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="field pl-filters">
            <span className="sr-only" id="f-label">Filter by stack</span>
            <div className="filters" role="group" aria-labelledby="f-label">
              <button type="button" className="fchip" aria-pressed={!tech} onClick={() => setTech(null)}>All</button>
              {COMMON.map((t) => (
                <button key={t} type="button" className="fchip" aria-pressed={tech === t} onClick={() => setTech(t)}>
                  {t} <span className="n">{freq[t]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap pl-body grid" aria-label="Project index">
        <ul className="pl-list">
          {shown.map((p, i) => {
            const c = coverProps(p);
            return (
              <Reveal as="li" key={p.id} delay={Math.min(i, 6) * 0.05} onPointerEnter={() => setActiveId(p.id)} onFocus={() => setActiveId(p.id)}>
                <Link className={`pl-row${active && active.id === p.id ? " is-active" : ""}`} to={`/projects/${p.id}`} data-cursor="Open file" data-pad="0">
                  <SignalImage {...c} className="pl-thumb cut" decorative cell={2} />
                  <div className="pl-main">
                    <AsciiTitle as="h2" className="pl-name" text={p.name} max={10} maxSm={5} min={6} />
                    <p className="t-body">{clean(p.description)}</p>
                    <p className="t-meta">
                      {isDev(p) ? <Status /> : <span>{p.updatedAt}</span>}
                      <span aria-hidden="true">/</span>
                      <span className="stk">{p.technologies.slice(0, 3).join(", ")}{p.technologies.length > 3 ? ` +${p.technologies.length - 3}` : ""}</span>
                    </p>
                  </div>
                  <ArrowUpRight className="pl-go" aria-hidden="true" />
                </Link>
              </Reveal>
            );
          })}
          {!shown.length && (
            <li className="pl-empty">
              <p className="t-lead">No files match.</p>
              <button type="button" className="link" onClick={reset}>Clear filters <X aria-hidden="true" /></button>
            </li>
          )}
        </ul>

        {/* Live preview: replays the image load-in for the hovered or focused row */}
        {active && (
          <aside className="pl-preview" aria-hidden="true">
            <div className="frame">
              <Ticks />
              <SignalImage key={active.id} {...coverProps(active)} className="media cut" decorative cell={3} revealMs={650} />
            </div>
            <div className="panel pv-read">
              <div className="pf-head"><span>Profile</span><span>{active.id}</span></div>
              <dl>
                <dt>Updated</dt><dd>{active.updatedAt}</dd>
                <dt>Stack</dt>
                <dd>{active.technologies.slice(0, 6).join(", ")}{active.technologies.length > 6 ? ` +${active.technologies.length - 6} more` : ""}</dd>
                <dt>Source</dt><dd>{sourceOf(active)}</dd>
              </dl>
            </div>
          </aside>
        )}
      </section>
    </>
  );
}

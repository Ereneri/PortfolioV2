import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import AsciiTitle from "../components/AsciiTitle";
import Reveal from "../components/Reveal";
import Scramble from "../components/Scramble";
import SignalImage from "../components/SignalImage";
import { Btn, Rule, Ticks } from "../components/Bits";
import { categories, contextOf, profileRows, usedIn, workExperience } from "../lib/data";
import { EASE, clean } from "../lib/env";
import { scramble } from "../lib/scramble";

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

const TILE = { hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } };

function Tile({ t, animateIn, index }) {
  const k = useRef(null);
  useLayoutEffect(() => {
    if (animateIn && k.current) scramble(k.current, t, { duration: 320, delay: index * 22 });
  }, [animateIn, index, t]);

  const uses = usedIn(t);
  const ctx = contextOf(t);
  if (!uses.length && !ctx) {
    return <motion.li variants={TILE} className="tile"><span className="k"><span className="sr-only">{t}</span><span ref={k} aria-hidden="true">{t}</span></span></motion.li>;
  }
  const n = uses.length ? `${uses.length} project${uses.length > 1 ? "s" : ""}` : "";
  const badge = [n, ctx && ctx[0]].filter(Boolean).join(" + ");
  // same profiler as the landing cards: projects (year, name), then where it was used professionally
  const profile = JSON.stringify({
    head: "Stack",
    id: t,
    name: t,
    rows: profileRows(uses, ctx),
    foot: [n && `Used in ${n}`, ctx && `${ctx[0]}: ${ctx[1]}`].filter(Boolean).join(" / "),
  });
  const said = [uses.length && `used in ${uses.map((p) => p.name).join(", ")}`, ctx && `${ctx[0].toLowerCase()}: ${ctx[1]}`].filter(Boolean).join("; ");
  return (
    <motion.li variants={TILE} className="tile" tabIndex={0} data-cursor="Inspect" data-profile={profile}>
      <span className="k"><span className="sr-only">{t}</span><span ref={k} aria-hidden="true">{t}</span></span>
      <span className="uses" aria-hidden="true">{badge}</span>
      <span className="sr-only">, {said}</span>
    </motion.li>
  );
}

function Technologies() {
  const [sel, setSel] = useState(0);
  const [touched, setTouched] = useState(false);
  const tabs = useRef([]);
  const ind = useRef(null);
  const reduce = useReducedMotion();

  // sliding inverted indicator under the selected tab
  useLayoutEffect(() => {
    const t = tabs.current[sel], i = ind.current;
    if (!t || !i) return undefined;
    const place = (anim) => {
      const target = { transform: `translateY(${t.offsetTop}px)`, height: `${t.offsetHeight}px` };
      if (anim && !reduce) animate(i, target, { type: "spring", stiffness: 420, damping: 38 });
      else Object.assign(i.style, target);
    };
    place(touched);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sel, touched, reduce]);

  const choose = (i) => { setSel(i); setTouched(true); };
  const onKey = (e, i) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const abs = { Home: 0, End: categories.length - 1 }[e.key];
    if (d === undefined && abs === undefined) return;
    e.preventDefault();
    const n = abs !== undefined ? abs : (i + d + categories.length) % categories.length;
    tabs.current[n]?.focus();
    choose(n);
  };
  const cat = categories[sel];

  return (
    <div className="grid">
      <div className="tabs" role="tablist" aria-label="Technology categories" aria-orientation="vertical">
        <span className="tab-ind" ref={ind} aria-hidden="true" />
        {categories.map((c, i) => (
          <button
            key={c.category}
            ref={(n) => (tabs.current[i] = n)}
            type="button"
            className="tab"
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === sel}
            aria-controls="tp"
            tabIndex={i === sel ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span>{c.category}</span>
            <span className="n">{String(c.items.length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <div className="tab-panel" id="tp" role="tabpanel" aria-labelledby={`tab-${sel}`} tabIndex={0}>
        <h3 className="t-h3">{cat.category}</h3>
        <motion.ul
          key={cat.category}
          className="tiles"
          initial={touched && !reduce ? "hide" : false}
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.022 } } }}
        >
          {cat.items.map((t, i) => <Tile key={t} t={t} index={i} animateIn={touched} />)}
        </motion.ul>
      </div>
    </div>
  );
}

const spanOf = (o) => `${o.positions[o.positions.length - 1].period.split(" - ")[0]} - ${o.positions[0].period.split(" - ")[1]}`;

export default function About() {
  return (
    <>
      {/* PROFILE: portrait owns the left third; identity and readout start on the 1/3 line */}
      <section className="wrap about-head" aria-labelledby="name">
        <div className="grid">
          <figure className="about-portrait frame">
            <Ticks />
            <SignalImage src="profilepicture.jpeg" className="media cut" label="Portrait of Eren Erisgen at the Golden Gate Bridge" cell={2} focus={[0.5, 0.3]} contrast={1.15} revealMs={1300} />
          </figure>
          <div className="about-id">
            <p className="t-meta">Profile</p>
            <AsciiTitle as="h1" id="name" text="Eren Erisgen" max={17} min={11} decode="load" delay={200} />
            <p className="t-mono">Software Engineer &amp;&amp; Computer Scientist</p>
            <dl className="panel readout">
              <div><dt className="t-meta">Occupation</dt><dd>Software Engineer, The Bernard Group</dd></div>
              <div><dt className="t-meta">Education</dt><dd>B.S. Computer Science, University of Minnesota</dd></div>
              <div><dt className="t-meta">Based in</dt><dd>Minneapolis, Minnesota</dd></div>
              <div><dt className="t-meta">Focus</dt><dd>Cloud infrastructure, event-driven architecture, AI-native workflows</dd></div>
            </dl>
            <div className="about-links">
              <Btn as="a" solid href="https://github.com/Ereneri" target="_blank" rel="noopener noreferrer"><GithubLogo aria-hidden="true" />GitHub<NewTab /></Btn>
              <Btn as="a" href="https://www.linkedin.com/in/eren-erisgen/" target="_blank" rel="noopener noreferrer"><LinkedinLogo aria-hidden="true" />LinkedIn<NewTab /></Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="am">
        <div className="wrap grid split">
          <Reveal className="split-label"><h2 className="t-h2" id="am"><Scramble text="About me" /></h2></Reveal>
          <Reveal className="split-body" delay={0.06}>
            <p className="t-lead" style={{ maxWidth: "46ch" }}>
              As a Software Engineer, I strive daily to build software that meaningfully improves the lives of users.{" "}
              <span style={{ color: "var(--fg-3)" }}>
                My education at the University of Minnesota, Twin Cities equipped me with the skills to solve real-world problems
                effectively, spanning full-stack development to graduate-level algorithms. Through my internship at Thrivent Financial
                and my current role at The Bernard Group, I've been pushed to challenge assumptions, grow professionally, and
                continuously work toward being the best engineer I can be.
              </span>{" "}
              I'm especially interested in cloud infrastructure, event-driven architecture, and AI-native development workflows.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="tech" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="t-h2" id="tech"><Scramble text="Technologies" /></h2>
            <Rule at="18%" />
          </Reveal>
          <Reveal><Technologies /></Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="xp" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="t-h2" id="xp"><Scramble text="Experience" /></h2>
            <Rule at="55%" />
          </Reveal>
          <div className="log">
            {workExperience.map((o) => (
              <Reveal as="article" key={o.company} className="grid org">
                <div className="org-id">
                  <div className="sticky">
                    <div className="frame">
                      <SignalImage src={o.image} label={`${o.company} logo`} cell={2} contrast={1.3} />
                    </div>
                    <h3 className="t-h3">{o.company}</h3>
                    <p className="t-meta">{spanOf(o)}</p>
                  </div>
                </div>
                <div className="org-roles">
                  {o.positions.map((p) => (
                    <section key={p.title + p.period} className="role">
                      <div className="role-head">
                        <h4>{p.title}</h4>
                        <span className="t-meta">{p.period}</span>
                      </div>
                      <ul>{p.responsibilities.map((r) => <li key={r.slice(0, 40)}>{clean(r)}</li>)}</ul>
                    </section>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ed" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="t-h2" id="ed"><Scramble text="Education" /></h2>
            <Rule at="72%" />
          </Reveal>
          <Reveal className="panel edu">
            <div className="edu-id">
              <SignalImage src="umn.jpeg" label="University of Minnesota logo" cell={2} contrast={1.3} />
              <div>
                <h3 className="t-h3" style={{ marginBottom: 10 }}>University of Minnesota, Twin Cities</h3>
                <p>Bachelor of Science in Computer Science</p>
                <p className="t-meta" style={{ marginTop: 8 }}>College of Science and Engineering</p>
              </div>
            </div>
            <div className="edu-gpa"><span className="big">3.94</span><span className="t-meta">GPA<br />of 4.0</span></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

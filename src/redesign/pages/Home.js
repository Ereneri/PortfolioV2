import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import AsciiTitle from "../components/AsciiTitle";
import Reveal from "../components/Reveal";
import Scramble from "../components/Scramble";
import SignalImage from "../components/SignalImage";
import { Btn, Rule, Status, Ticks } from "../components/Bits";
import { coverProps, projects } from "../lib/data";
import { EASE, clean } from "../lib/env";

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;
const SLOTS = ["card--a", "card--b", "card--c"];
const CARD_CELL = [2, 3, 2];
const BUILD_SHOTS = ["caffein8/2026/mobile-catalog.png", "caffein8/2026/mobile-drink-detail.png", "caffein8/2026/mobile-user-profile.png"];

const profileOf = (p) => JSON.stringify({
  id: p.id,
  name: p.name,
  rows: [
    ["Updated", p.updatedAt],
    ["Stack", p.technologies.slice(0, 3).join(", ") + (p.technologies.length > 3 ? ` +${p.technologies.length - 3}` : "")],
    ...(p.githubUrl ? [["Source", "GitHub"]] : p.liveUrl ? [["Live", new URL(p.liveUrl).host]] : []),
  ],
});

function Rise({ delay, children, className }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const current = projects.find((p) => p.currentlyBuilding);
  const featured = projects.filter((p) => p.featured && !p.currentlyBuilding).slice(0, 3);

  return (
    <>
      {/* HERO: copy anchored bottom-left third, skyline fills the right two-thirds */}
      <section className="hero" aria-label="Introduction">
        <div className="wrap hero-grid">
          <div className="hero-media frame">
            <Ticks />
            <SignalImage
              src="profilehero.jpg"
              className="cut"
              label="Minneapolis skyline at dusk"
              rest="gray"
              cell={3}
              cellSm={2}
              focus={[0.5, 0.6]}
              gamma={1.3}
              contrast={1.45}
              bright={0.01}
              sharpen={0.9}
              gContrast={1.3}
              gBright={0.05}
              revealMs={1500}
            />
          </div>
          <div className="hero-copy">
            <Scramble as="p" className="t-meta hero-eyebrow" text="Software Engineer" trigger="mount" delay={200} duration={520} />
            <AsciiTitle as="h1" className="hero-name" text="Eren Erisgen" lines max={30} decode="load" delay={300} />
            <Rise delay={0.85}>
              <p className="hero-sub">Building thoughtful software from Minneapolis, MN.</p>
            </Rise>
            <Rise delay={0.95} className="hero-ctas">
              <Btn as={Link} to="/projects" solid>View projects <ArrowRight aria-hidden="true" /></Btn>
              <Btn as={Link} to="/about">About me</Btn>
            </Rise>
          </div>
        </div>
      </section>

      {/* INTRO: portrait in the left third, statement from the 1/3 line */}
      <section className="section" aria-label="About">
        <div className="wrap grid">
          <Reveal as="figure" className="intro-portrait frame">
            <Ticks />
            <SignalImage src="profilepicture.jpeg" className="media cut" label="Portrait of Eren Erisgen" cell={2} focus={[0.5, 0.3]} contrast={1.15} />
          </Reveal>
          <Reveal className="intro-copy" delay={0.08}>
            <p className="statement">
              Howdy! I'm Eren, a software engineer based in Minneapolis, Minnesota.{" "}
              <span className="mute">Proud graduate from the</span>{" "}
              <a href="https://twin-cities.umn.edu/" target="_blank" rel="noopener noreferrer">University of Minnesota<NewTab /></a>{" "}
              <span className="mute">with a B.S. in Computer Science, currently working as a software engineer at</span>{" "}
              <a href="https://thebernardgroup.com/" target="_blank" rel="noopener noreferrer">The Bernard Group<NewTab /></a>.{" "}
              <span className="mute">I've explored everything from graduate-level algorithms to event-driven architecture and AI-native development workflows.</span>
            </p>
            <Link className="link" to="/about">About me <ArrowRight aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>

      {/* CURRENTLY BUILDING */}
      {current && (
        <section className="section" aria-labelledby="building-h" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal className="sec-head">
              <h2 className="t-h2" id="building-h"><Scramble text="Currently building" /></h2>
              <Rule />
            </Reveal>
            <Reveal as={Link} to={`/projects/${current.id}`} className="panel build" data-cursor="Open file" data-pad="0">
              <div className="build-copy">
                <p className="t-meta"><Status /></p>
                <AsciiTitle as="h3" className="build-name" text={current.name} max={16} />
                <p className="t-body">{clean(current.description)}</p>
                <ul className="build-stack" aria-label="Stack">
                  {current.technologies.slice(0, 6).map((t) => <li key={t} className="chip">{t}</li>)}
                </ul>
                <span className="link build-cta">View project <ArrowRight aria-hidden="true" /></span>
              </div>
              <div className="build-shots">
                {BUILD_SHOTS.map((s, i) => (
                  <div key={s} className="frame">
                    <Ticks />
                    <SignalImage src={s} className="media cut" label={`${current.name} mobile screen ${i + 1}`} cell={2} focus={[0.5, 0]} contrast={1.3} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* FEATURED: A and C stack in cols 1-7, B is the tall one on the 2/3 line */}
      <section className="section" aria-labelledby="featured-h" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="t-h2" id="featured-h"><Scramble text="Featured projects" /></h2>
            <Rule at="40%" />
            <Link className="link" to="/projects" data-cursor="Index">View projects <ArrowRight aria-hidden="true" /></Link>
          </Reveal>
          <div className="grid feat">
            {featured.map((p, i) => (
              <Reveal key={p.id} as={Link} to={`/projects/${p.id}`} className={`card ${SLOTS[i]}`} delay={i * 0.08} data-cursor="Open file" data-profile={profileOf(p)}>
                <div className="frame">
                  <Ticks />
                  <SignalImage {...coverProps(p)} className="media cut" label={`${p.name} preview`} cell={CARD_CELL[i]} />
                </div>
                <div>
                  <div className="card-row">
                    <AsciiTitle as="h3" className="card-title" text={p.name} max={16} maxSm={8} min={7} />
                    <ArrowUpRight aria-hidden="true" />
                  </div>
                  <p className="t-body">{clean(p.description)}</p>
                  <p className="t-meta card-meta">{p.updatedAt} / {p.technologies.slice(0, 3).join(", ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

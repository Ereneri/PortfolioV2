import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, DownloadSimple, GithubLogo } from "@phosphor-icons/react";
import AsciiTitle from "../components/AsciiTitle";
import Lightbox from "../components/Lightbox";
import Reveal from "../components/Reveal";
import Scramble from "../components/Scramble";
import SignalImage from "../components/SignalImage";
import { Btn, Rule, Status, Ticks } from "../components/Bits";
import NotFound from "./NotFound";
import { coverProps, findProject, paragraphs, projects } from "../lib/data";
import { EASE, asset, clean, isDev } from "../lib/env";

const STACK_SHOWN = 6; // long stacks collapse so the dossier never outgrows the title
const MIN_RATIO = { small: 0.62, medium: 1, large: 1.2, full: 1.6 };
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

function Rise({ delay, className, children, as = "div", ...props }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) { const T = as; return <T className={className} {...props}>{children}</T>; }
  return (
    <M className={className} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay, ease: EASE }} {...props}>
      {children}
    </M>
  );
}

function Dossier({ p }) {
  const [all, setAll] = useState(false);
  const firstExtra = useRef(null);
  const extra = p.technologies.length - STACK_SHOWN;
  const techs = all ? p.technologies : p.technologies.slice(0, STACK_SHOWN);
  const expand = () => {
    setAll(true);
    // the button disappears, so keep keyboard focus on the first newly shown item
    requestAnimationFrame(() => firstExtra.current?.focus());
  };
  return (
    <Rise as="aside" delay={0.45} className="panel dossier" aria-label="Project details">
      <div className="dossier-head">
        <SignalImage src={p.image} label={`${p.name} icon`} cell={2} contrast={1.3} />
        <div>
          <p className="t-meta">Project file</p>
          <p className="t-mono">{p.id}</p>
        </div>
      </div>
      <dl>
        <dt className="t-meta">{isDev(p) ? "Status" : "Updated"}</dt>
        <dd>{isDev(p) ? <Status /> : p.updatedAt}</dd>
        <dt className="t-meta">Stack</dt>
        <dd>
          <ul className="chips">
            {techs.map((t, i) => (
              <li key={t} className="chip" ref={i === STACK_SHOWN ? firstExtra : undefined} tabIndex={i === STACK_SHOWN ? -1 : undefined}>{t}</li>
            ))}
            {!all && extra > 0 && (
              <li>
                <button type="button" className="chip chip-more" aria-expanded="false" onClick={expand} data-cursor="Expand">+{extra} more</button>
              </li>
            )}
          </ul>
        </dd>
        {(p.githubUrl || p.liveUrl) && (
          <>
            <dt className="t-meta">Links</dt>
            <dd className="actions">
              {p.githubUrl && (
                <Btn as="a" solid href={p.githubUrl} target="_blank" rel="noopener noreferrer" data-cursor="Visit">
                  <GithubLogo aria-hidden="true" />GitHub<NewTab />
                </Btn>
              )}
              {p.liveUrl && (
                <Btn as="a" href={p.liveUrl} target="_blank" rel="noopener noreferrer" data-cursor="Visit">
                  {new URL(p.liveUrl).host} <ArrowUpRight aria-hidden="true" /><NewTab />
                </Btn>
              )}
            </dd>
          </>
        )}
      </dl>
    </Rise>
  );
}

function Shot({ m, delay, onOpen }) {
  const w = m.width || "medium";
  if (m.type === "image") {
    return (
      <Reveal as="figure" className="shot" data-w={w} delay={delay}>
        <div className="frame">
          <Ticks />
          <SignalImage
            as="button"
            type="button"
            src={m.url}
            className="media cut"
            ratio="natural"
            minRatio={MIN_RATIO[w] || 1}
            inset={0.94}
            cell={3}
            contrast={1.2}
            invert={m.invert}
            pool={m.invert ? "min" : undefined}
            data-cursor="Expand"
            aria-label={`Open image: ${m.caption || "screenshot"}`}
            onClick={onOpen}
          />
        </div>
        <figcaption><span className="t-meta">{m.caption}</span></figcaption>
      </Reveal>
    );
  }
  if (m.type === "video") {
    return (
      <Reveal as="figure" className="shot" data-w={w} delay={delay}>
        <div className="frame">
          <Ticks />
          <div className="media cut">
            <video src={asset(m.url)} controls preload="metadata" playsInline />
          </div>
        </div>
        <figcaption><span className="t-meta">{m.caption}</span><span className="t-meta">Video</span></figcaption>
      </Reveal>
    );
  }
  return (
    <Reveal as="figure" className="shot" data-w="full">
      <div className="frame">
        <Ticks />
        <div className="media cut">
          <iframe src={asset(m.url)} title={m.caption || "PDF document"} loading="lazy" />
        </div>
      </div>
      <figcaption>
        <span className="t-meta">{m.caption}</span>
        <a className="link pdf-dl" href={asset(m.url)} target="_blank" rel="noopener noreferrer" data-cursor="Download">
          Download PDF <DownloadSimple aria-hidden="true" /><NewTab />
        </a>
      </figcaption>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const p = findProject(projectId);
  const [lb, setLb] = useState(null);
  const closeLb = useCallback(() => setLb(null), []);

  // Kafka's diagrams stay inverted (white on dark) like its cover
  const media = useMemo(
    () => (p ? p.media.map((m) => ({ ...m, invert: !!p.cover?.invert && m.type === "image" })) : []),
    [p],
  );
  const images = useMemo(() => media.filter((m) => m.type === "image"), [media]);

  if (!p) return <NotFound />;
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  const hasPdf = media.some((m) => m.type === "pdf");

  return (
    <>
      <section className="wrap proj-head" aria-labelledby="pt">
        <Link className="link back" to="/projects"><ArrowLeft className="i-left" aria-hidden="true" /> Back to projects</Link>
        <div className="grid">
          <div className="proj-title">
            <AsciiTitle as="h1" id="pt" text={p.name} max={26} decode="load" delay={150} />
            <Rise as="p" delay={0.35} className="t-lead">{clean(p.description)}</Rise>
          </div>
          <Dossier p={p} />
        </div>
      </section>

      <section className="section overview" aria-labelledby="ov">
        <div className="wrap grid">
          <div className="overview-label">
            <div className="sticky"><h2 className="t-h2" id="ov"><Scramble text="Overview" /></h2></div>
          </div>
          <Reveal className="overview-body">
            {paragraphs(p.fullDescription).map((t) => <p key={t.slice(0, 32)}>{t}</p>)}
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="md" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="t-h2" id="md"><Scramble text="Media" /></h2>
            <Rule at="30%" />
            <span className="t-meta">{media.length} files</span>
          </Reveal>
          {hasPdf && <p className="t-meta" style={{ marginBottom: 24 }}>PDFs may not render on mobile. Use the download links.</p>}
          {media.length ? (
            <div className="grid gallery">
              {media.map((m, k) => (
                <Shot key={m.url} m={m} delay={(k % 3) * 0.06} onOpen={() => setLb(images.indexOf(m))} />
              ))}
            </div>
          ) : (
            <p className="t-body">No media for this project yet.</p>
          )}
        </div>
      </section>

      <section className="section" aria-label="Next project" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal as={Link} to={`/projects/${next.id}`} className="panel next" data-cursor="Next file" data-pad="0">
            <div className="next-copy">
              <p className="t-meta">Next project</p>
              <div className="row">
                <AsciiTitle text={next.name} max={18} style={{ flex: 1 }} />
                <ArrowRight aria-hidden="true" />
              </div>
              <p className="t-body">{clean(next.description)}</p>
            </div>
            <SignalImage {...coverProps(next)} className="cut" style={{ "--c": "18px" }} label={`${next.name} preview`} cell={3} />
          </Reveal>
        </div>
      </section>

      <Lightbox images={images} index={lb} onIndex={setLb} onClose={closeLb} />
    </>
  );
}

import projectsList from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import profilePicture from "../assets/profilepicture.jpeg";
import caffein8Thumb from "../assets/caffein8.png";

const currentlyBuilding = projectsList.find((p) => p.currentlyBuilding);
const featuredProjects = projectsList.filter((p) => p.featured && !p.currentlyBuilding);

function Home() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col gap-0 md:max-w-[1100px] mx-auto md:px-0 px-4"
    >
      {/* ── Hero ── */}
      <section className="flex flex-col gap-3 pt-8 pb-8 md:pt-16 md:pb-12">
        <p className="code-font text-sm primary-text uppercase tracking-widest">
          Software Engineer &amp;&amp; Computer Scientist
        </p>
        <h1 className="md:text-8xl text-5xl font-extrabold text-light leading-none tracking-tight">
          Eren Erisgen
        </h1>
        <p className="text-base text-white/50 max-w-md">
          Building thoughtful software from Minneapolis, MN.
        </p>
        <div className="flex gap-3 mt-2 flex-wrap">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
          >
            View Projects
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* ── Stats strip ──
      <section className="py-8 grid grid-cols-3 gap-4" aria-label="Quick stats">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="md:text-3xl text-2xl font-extrabold primary-text leading-none">
              {value}
            </span>
            <span className="text-xs text-white/50 uppercase tracking-wide code-font">
              {label}
            </span>
          </div>
        ))}
      </section> */}

      {/* ── About intro ── */}
      <section className="py-8 md:py-12">
        <div className="flex gap-6 md:gap-8 items-center flex-col md:flex-row">
          <div className="w-36 md:w-48 shrink-0">
            <img
              src={profilePicture}
              alt="Eren Erisgen"
              className="rounded-2xl w-full aspect-square object-cover object-top"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-xl md:text-2xl font-bold primary-text uppercase tracking-tight">
              Welcome
            </h2>
            <p className="text-sm md:text-lg text-white/80 leading-relaxed">
              Howdy! I'm Eren, a Software Engineer based in Minneapolis, Minnesota.
              Proud graduate from the{" "}
              <a
                className="primary-text hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                href="https://twin-cities.umn.edu/"
              >
                University of Minnesota
              </a>{" "}
              with a B.S. in Computer Science, currently working as an Associate
              Software Engineer at{" "}
              <a
                className="primary-text hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                href="https://thebernardgroup.com/"
              >
                The Bernard Group
              </a>
              . I've explored everything from graduate-level algorithms to
              event-driven architecture and AI-native development workflows.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm primary-text hover:underline transition-colors w-fit"
            >
              Full background
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Currently Building ── */}
      {currentlyBuilding && (
        <section className="py-8 md:py-12">
          <h2 className="text-2xl font-bold primary-text uppercase tracking-tight mb-6">
            Currently Building
          </h2>
          <Link
            to={`/projects/${currentlyBuilding.id}`}
            className="w-full rounded-xl bg-tertiary flex flex-row md:flex-col text-light transition-all cursor-pointer duration-200 group hover:bg-[var(--clr-hover-surface)] overflow-hidden border border-white/5 hover:border-white/10"
          >
            {/* Thumbnail sidebar on mobile, hidden on desktop (no standalone thumb for this card) */}
            <div className="w-24 shrink-0 md:hidden overflow-hidden">
              <img
                src={caffein8Thumb}
                alt={`${currentlyBuilding.name} thumbnail`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-3 md:p-6 gap-2 md:gap-4 min-w-0">
              {/* Header row */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <img
                  src={caffein8Thumb}
                  alt={`${currentlyBuilding.name} icon`}
                  className="hidden md:block w-10 h-10 rounded-xl object-cover shrink-0"
                  loading="lazy"
                />
                <span className="text-sm md:text-2xl code-font font-bold uppercase tracking-tight truncate">
                  {currentlyBuilding.name}
                </span>
                <span className="flex items-center gap-1.5 bg-[var(--clr-success-a0)]/80 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--clr-success-a20)] animate-pulse inline-block" />
                  <span className="hidden sm:inline">In Development</span>
                  <span className="sm:hidden">In Dev</span>
                </span>
              </div>

              <p className="text-xs md:text-sm text-white/60 leading-relaxed line-clamp-2 md:line-clamp-none">
                {currentlyBuilding.description}
              </p>

              {/* Tech tags — desktop only */}
              {currentlyBuilding.technologies && (
                <div className="hidden md:flex flex-wrap gap-1.5">
                  {currentlyBuilding.technologies.slice(0, 6).map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {currentlyBuilding.technologies.length > 6 && (
                    <span className="tech-tag">
                      +{currentlyBuilding.technologies.length - 6} more
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs uppercase tracking-wide text-white/40 group-hover:text-white/60 transition-colors font-medium">
                  View Project
                </span>
                <ArrowRightIcon className="w-3.5 h-3.5 secondary-text mr-2 group-hover:mr-0 transition-all duration-200" />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Featured Projects ── */}
      <section className="py-8 md:py-12 pb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold primary-text uppercase tracking-tight">
            Featured Projects
          </h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            View all
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="gap-6 grid-cols-1 md:grid-cols-2 grid">
          {featuredProjects.map(({ id, name, description, image, technologies }) => (
            <ProjectCard
              key={id}
              id={id}
              name={name}
              description={description}
              image={image}
              technologies={technologies}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;

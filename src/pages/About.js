import workExperienceData from "../data/workExperience.json";
import technologies from "../data/technologies.json";
import profilePicture from "../assets/profilepicture.jpeg";
import tbgLogo from "../assets/tbg.jpg";
import thriventLogo from "../assets/thrivent.jpeg";
import umnSeal from "../assets/umn.jpeg";
import githubIcon from "../assets/github-mark-white.svg";
import linkedinIcon from "../assets/linkedin.svg";

const companyImages = {
  "tbg.jpg": tbgLogo,
  "thrivent.jpeg": thriventLogo,
};

// Deduplicate items within each technology category
const dedupedTechnologies = technologies.map((cat) => ({
  ...cat,
  items: [...new Set(cat.items)],
}));

function About() {
  return (
    <main id="main-content" className="min-h-screen max-w-[1100px] mx-auto py-6  md:px-0 px-4">

      {/* ── Header ── */}
      <section className="flex flex-row gap-5 items-center pb-6 md:pb-10">
        <img
          src={profilePicture}
          alt="Eren Erisgen"
          className="rounded-2xl w-28 h-28 md:w-32 md:h-32 object-cover object-top shrink-0"
          loading="lazy"
        />
        <div className="text-left">
          <h1 className="md:text-5xl text-3xl font-extrabold text-light tracking-tight">
            Eren Erisgen
          </h1>
          <p className="text-sm secondary-text code-font mt-1">
            Software Engineer &amp;&amp; Computer Scientist
          </p>
          <div className="flex gap-3 mt-3 flex-wrap">
            <a
              href="https://github.com/Ereneri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
            >
              <img src={githubIcon} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/eren-erisgen/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
            >
              <img src={linkedinIcon} alt="" aria-hidden="true" className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── About Me ── */}
      <section className="flex flex-col gap-4 py-6 ">
        <h2 className="text-xl font-bold primary-text uppercase tracking-tight">
          About Me
        </h2>
        <p className="md:text-base text-sm text-white/80 leading-relaxed">
          As a Software Engineer, I strive daily to build software that
          meaningfully improves the lives of users. My education at the
          University of Minnesota, Twin Cities equipped me with the skills to
          solve real-world problems effectively — spanning full-stack
          development to graduate-level algorithms. Through my internship at
          Thrivent Financial and my current role at The Bernard Group, I've been
          pushed to challenge assumptions, grow professionally, and continuously
          work toward being the best engineer I can be. I'm especially
          interested in cloud infrastructure, event-driven architecture, and
          AI-native development workflows.
        </p>
      </section>

      {/* ── Technologies ── */}
      <section className="flex flex-col gap-4 md:gap-6 py-6 ">
        <h2 className="text-xl font-bold primary-text uppercase tracking-tight">
          Technologies
        </h2>
        <div className="gap-6 grid-cols-1 md:grid-cols-2 grid">
          {dedupedTechnologies.map((technology, technologyIndex) => (
            <div
              key={technologyIndex}
              className="flex flex-col gap-3 rounded-xl"
            >
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest code-font">
                {technology.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {technology.items.map((item, itemIndex) => (
                  <span key={itemIndex} className="tech-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Work Experience ── */}
      <section className="flex flex-col gap-4 md:gap-6 py-6">
        <h2 className="text-xl font-bold primary-text uppercase tracking-tight">
          Work Experience
        </h2>
        <div className="flex flex-col gap-6 md:gap-10">
          {workExperienceData.map((company, companyIndex) => (
            <div key={companyIndex} className="flex gap-4">
              {/* Company logo */}
              <div className="shrink-0 md:block hidden">
                <img
                  src={companyImages[company.image]}
                  alt={`${company.company} logo`}
                  className="w-12 h-12 rounded-xl object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg font-bold secondary-text">
                  {company.company}
                </h3>

                {/* Timeline rail */}
                <div className="relative mt-3 flex flex-col">
                  {company.positions.map((position, positionIndex) => (
                    <div key={positionIndex} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Dot — sits on the rail */}
                      <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[var(--clr-primary-a0)] shrink-0 z-10" />
                      {/* Connector line to next dot — only between positions */}
                      {positionIndex < company.positions.length - 1 && (
                        <span
                          className="absolute left-[2.5px] top-[10px] bottom-0 w-px bg-white/15"
                          aria-hidden="true"
                        />
                      )}

                      {/* Position content */}
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <h4 className="text-sm font-semibold text-white code-font leading-snug">
                            {position.title}
                          </h4>
                          <span className="text-xs text-white/40 code-font shrink-0">
                            {position.period}
                          </span>
                        </div>

                        <ul className="flex flex-col gap-1.5 list-disc list-outside ml-4">
                          {position.responsibilities.map((responsibility, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-white/70 leading-relaxed"
                            >
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Education ── */}
      <section className="flex flex-col gap-4 md:gap-6 py-6 ">
        <h2 className="text-xl font-bold primary-text uppercase tracking-tight">
          Education
        </h2>
        <div className="flex gap-4">
          <img
            src={umnSeal}
            alt="University of Minnesota seal"
            className="w-12 h-12 rounded-xl object-cover shrink-0 md:block hidden"
            loading="lazy"
          />
          <div className="flex justify-between w-full md:flex-row flex-col gap-1">
            <div className="text-left">
              <h3 className="text-base font-semibold text-white">
                University of Minnesota, Twin Cities
              </h3>
              <p className="text-sm text-white/60 mt-0.5">
                Bachelor of Science in Computer Science
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                College of Science and Engineering
              </p>
            </div>
            <div className="md:text-right text-left mt-1 md:mt-0">
              <p className="text-sm font-semibold primary-text">GPA: 3.94 / 4.0</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default About;

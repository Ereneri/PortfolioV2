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
    <div className="min-h-screen max-w-[1100px] mx-auto py-8 pt-8 md:px-0 px-4">

      {/* Header */}
      <div className="flex flex-row gap-8 items-center justify-center pb-16">
        <img
          src={profilePicture}
          alt="Profile"
          className="rounded-full w-40"
          loading="lazy"
        />
        <div className="text-left">
          <h1 className="md:text-7xl text-5xl font-extrabold text-light">
            Eren Erisgen
          </h1>
          <p className="text-lg secondary-text code-font mt-1">
            Associate Software Engineer @ The Bernard Group
          </p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://github.com/Ereneri"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-light hover:text-white transition-colors text-sm hover:underline"
            >
              <img src={githubIcon} alt="GitHub" className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/eren-erisgen/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-light hover:text-white transition-colors text-sm hover:underline"
            >
              <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="flex flex-col gap-4 pb-16">
        <h2 className="text-3xl font-bold primary-text uppercase">About Me</h2>
        <p className="md:text-xl text-light md:text-justify text-left">
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
      </div>

      {/* Technologies */}
      <div className="flex flex-col gap-4 pb-16">
        <h2 className="text-3xl font-bold primary-text uppercase">
          Technologies
        </h2>
        <div className="gap-8 grid-cols-1 md:grid-cols-2 grid">
          {dedupedTechnologies.map((technology, technologyIndex) => (
            <div key={technologyIndex} className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-tertiary flex items-center gap-2 uppercase code-font">
                {technology.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {technology.items.map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="bg-primary px-4 py-2 text-sm rounded-lg text-light bg-tertiary cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      <div className="flex flex-col gap-4 pb-16">
        <h2 className="text-3xl font-bold primary-text uppercase">
          Work Experience
        </h2>
        <div className="flex flex-col gap-8">
          {workExperienceData.map((company, companyIndex) => (
            <div key={companyIndex} className="flex justify-between w-full">
              <img
                src={companyImages[company.image]}
                alt={`${company.company} Logo`}
                className="w-16 h-16 mr-4 rounded-xl md:block hidden object-cover"
                loading="lazy"
              />
              <div className="text-left w-full">
                <h3 className="text-2xl font-bold text-light">
                  {company.company}
                </h3>
                {company.positions.map((position, positionIndex) => (
                  <div key={positionIndex} className="relative">
                    <div className="w-full md:justify-between flex md:flex-row flex-col mt-2">
                      <div className="flex items-center gap-4">
                        <span className="w-2 h-2 shrink-0 bg-tertiary rounded-full relative z-10" />
                        <h4 className="text-xl text-secondary code-font">
                          {position.title}
                        </h4>
                      </div>
                      <h4 className="md:text-xl font-base md:ml-0 ml-6 text-light/60">
                        {position.period}
                      </h4>
                    </div>
                    <div
                      className={`pb-4 pl-4 ${
                        positionIndex < company.positions.length - 1
                          ? "relative"
                          : ""
                      }`}
                    >
                      {positionIndex < company.positions.length - 1 && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-0.5 bg-tertiary mb-2"
                          style={{ marginLeft: "3px" }}
                        />
                      )}
                      <ul className="list-disc list-inside md:text-justify text-light ml-2 mt-2">
                        {position.responsibilities.map(
                          (responsibility, idx) => (
                            <li key={idx} className="mb-2 leading-snug">
                              {responsibility}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="flex flex-col gap-4 pb-16">
        <h2 className="text-3xl font-bold primary-text uppercase">Education</h2>
        <div className="flex w-full flex-row">
          <img
            src={umnSeal}
            alt="University of Minnesota Seal"
            className="w-16 h-16 mr-4 rounded-xl md:block hidden object-cover"
            loading="lazy"
          />
          <div className="flex justify-between w-full md:flex-row flex-col">
            <div className="text-left">
              <h3 className="md:text-2xl font-semibold text-light text-xl">
                University of Minnesota, Twin Cities
              </h3>
              <p className="text-lg tertiary-text">
                Bachelor of Science in Computer Science
              </p>
            </div>
            <div className="md:text-right text-left">
              <h3 className="text-xl font-base text-light">GPA: 3.94 / 4.0</h3>
              <p className="text-lg tertiary-text">
                College of Science and Engineering
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default About;

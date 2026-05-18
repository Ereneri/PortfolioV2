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
    <div
      id="home"
      className="min-h-screen flex flex-col gap-8 md:max-w-[1100px] mx-auto py-8 pt-16 md:px-0 px-4"
    >
      <div className="flex flex-col p-4 gap-4 justify-center items-center">
        <h1 className="md:text-9xl font-extrabold text-light leading-none text-7xl">
          Eren Erisgen
        </h1>
        <h2 className="text-2xl secondary-text font-semibold code-font uppercase">
          Software Engineer && Computer Scientist
        </h2>
      </div>

      <div className="mx-auto md:max-w-full py-16">
        <div className="flex gap-8 items-center flex-col md:flex-row">
          <div className="basis-1/3">
            <img
              src={profilePicture}
              alt="Profile"
              className="md:rounded-full rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="basis-2/3 flex flex-col gap-4">
            <h3 className="text-2xl text-left font-bold primary-text uppercase">
              Welcome
            </h3>
            <p className="md:text-xl text-light md:text-justify text-left">
              Howdy! I'm Eren Erisgen, a Software Engineer and Computer Scientist
              based in Minneapolis, Minnesota. Graduate from the{" "}
              <a
                className="primary-text hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                href="https://twin-cities.umn.edu/"
              >
                University of Minnesota
              </a>{" "}
              with a B.S. in Computer Science and currently work as an Associate
              Software Engineer at{" "}
              <a
                className="primary-text hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                href="https://thebernardgroup.com/"
              >
                The Bernard Group
              </a>
              . During my time at university, I explored everything from
              graduate-level algorithms to software engineering and event-driven
              architecture. I love working with Java, C, and JavaScript. On this
              site, you'll find some of my favorite projects and links to the
              source code, they showcase what I've learned both in school and in
              industry.
            </p>
          </div>
        </div>

        {/* Currently Building */}
        {currentlyBuilding && (
          <div className="pt-24">
            <h3 className="text-2xl font-bold primary-text uppercase items-center pb-8">
              Currently Building
            </h3>
            <Link
              to={`/projects/${currentlyBuilding.id}`}
              className="w-full rounded-3xl bg-tertiary gap-0 flex flex-col text-light transition-all cursor-pointer duration-300 group hover:scale-[1.02] hover:bg-[var(--clr-info-a0)] overflow-hidden"
            >
              <div className="p-8 flex flex-col gap-4 flex-1">
                {/* Header row: icon + name + badge */}
                <div className="flex items-center gap-4 flex-wrap">
                  <img
                    src={caffein8Thumb}
                    alt={`${currentlyBuilding.name} icon`}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    loading="lazy"
                  />
                  <span className="text-4xl code-font font-bold uppercase">
                    {currentlyBuilding.name}
                  </span>
                  <span className="flex items-center gap-1.5 bg-[var(--clr-success-a0)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--clr-success-a20)] animate-pulse inline-block" />
                    In Development
                  </span>
                </div>
                <p className="text-base leading-relaxed text-left">
                  {currentlyBuilding.description}
                </p>
              </div>
              {/* View Project footer row — matches ProjectCard */}
              <div className="px-8 pb-8">
                <div className="rounded-xl text-base gap-2 flex justify-between transition-colors duration-300">
                  <span className="uppercase whitespace-nowrap">View Project</span>
                  <ArrowRightIcon className="inline secondary-text w-5 h-5 mr-4 group-hover:mr-0 transition-all duration-300" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Featured Projects */}
        <div>
          <h3 className="text-2xl font-bold primary-text uppercase items-center pt-24 pb-8">
            Featured Projects
          </h3>
          <div className="gap-8 grid-cols-1 md:grid-cols-2 grid">
            {featuredProjects.map(({ id, name, description, image }) => (
              <ProjectCard
                key={id}
                id={id}
                name={name}
                description={description}
                image={image}
              />
            ))}
          </div>
          <div className="pt-8 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-lg primary-text hover:underline transition-colors"
            >
              View all projects
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import projectsList from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";

// Collect all unique technologies across projects, sorted alphabetically
const allTechs = [...new Set(
  projectsList.flatMap((p) => p.technologies ?? [])
)].sort();

function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTech, setActiveTech] = useState(null);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const matchesSearch =
        !searchTerm ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies &&
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesTech =
        !activeTech ||
        (project.technologies && project.technologies.includes(activeTech));

      return matchesSearch && matchesTech;
    });
  }, [searchTerm, activeTech]);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveTech(null);
  };

  return (
    <main id="main-content" className="min-h-screen max-w-[1100px] mx-auto md:py-10 px-4 py-5">
      <div className="flex flex-col gap-5 md:gap-8">

        {/* Header */}
        <div className="flex items-baseline justify-between">
          <h1 className="md:text-5xl text-3xl font-extrabold text-light tracking-tight">
            Projects
          </h1>
          <span className="text-sm text-white/40 code-font">
            {filteredProjects.length} / {projectsList.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, description, or technology…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-lg border-primary bg-transparent focus:outline-none transition-colors text-white text-sm placeholder:text-white/30"
            aria-label="Search projects"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        {filteredProjects.length > 0 ? (
          <div className="gap-6 grid-cols-1 md:grid-cols-2 grid">
            {filteredProjects.map(({ id, name, description, image, technologies }) => (
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
        ) : (
          <div className="col-span-2 flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-white/50 text-base">
              No projects match{" "}
              {activeTech ? (
                <>
                  the <span className="primary-text">{activeTech}</span> filter
                </>
              ) : (
                <>your search</>
              )}
              {searchTerm && activeTech ? " and search" : ""}.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm primary-text hover:underline transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Projects;

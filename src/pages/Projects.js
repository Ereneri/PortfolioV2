import React, { useState, useMemo } from "react";
import projectsList from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";

function Projects() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects based on search term and selected technology
  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies &&
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <div className="min-h-screen max-w-[1100px] mx-auto md:py-8 px-4 py-4">
      <div className="flex flex-col gap-8">
        <h1 className="md:text-6xl text-4xl font-extrabold text-light">
          Projects
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-primary bg-transparent focus:outline-none transition-colors text-light"
            />
          </div>
        </div>

        <div className="gap-8 grid-cols-1 md:grid-cols-2 grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(({ id, name, description }) => (
              <ProjectCard
                key={id}
                id={id}
                name={name}
                description={description}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No projects found matching your criteria. Try adjusting your
              search or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;

import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

import caffein8Thumb from "../assets/caffein8.png";
import kafkaThumb from "../assets/kafka.jpg";
import flappybirdThumb from "../assets/flappybird.jpg";
import thumb2048 from "../assets/2048.png";
import earthThumb from "../assets/Earth.png";
import otdThumb from "../assets/otdThumb.png";
import gameThumb from "../assets/gameThumb.png";

const thumbnailMap = {
  "caffein8.png": caffein8Thumb,
  "kafka.jpg": kafkaThumb,
  "flappybird.jpg": flappybirdThumb,
  "2048.png": thumb2048,
  "Earth.png": earthThumb,
  "otdThumb.png": otdThumb,
  "gameThumb.png": gameThumb,
};

function ProjectCard({ id, name, description, image, technologies }) {
  const thumbnail = thumbnailMap[image] ?? null;
  const visibleTechs = technologies ? technologies.slice(0, 4) : [];
  const extraCount = technologies ? Math.max(0, technologies.length - 4) : 0;

  return (
    <Link
      to={`/projects/${id}`}
      className="w-full rounded-xl bg-tertiary flex flex-row md:flex-col text-light transition-all duration-200 group hover:bg-[var(--clr-hover-surface)] overflow-hidden border border-white/5 hover:border-white/10"
    >
      {/* Thumbnail — sidebar on mobile, full-width header on desktop */}
      {thumbnail && (
        <div className="w-24 shrink-0 md:w-full md:h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt={`${name} thumbnail`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-3 md:p-5 gap-2 md:gap-3 min-w-0">
        <div className="flex flex-col gap-1 md:gap-2">
          <span className="text-sm md:text-xl code-font font-bold uppercase tracking-tight truncate">
            {name}
          </span>
          <span className="text-xs md:text-sm text-white/60 leading-relaxed line-clamp-2 md:line-clamp-3">
            {description}
          </span>
        </div>

        {/* Tech tags — desktop only */}
        {visibleTechs.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1.5">
            {visibleTechs.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="tech-tag">+{extraCount}</span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-wide text-white/40 group-hover:text-white/60 transition-colors font-medium">
            View Project
          </span>
          <ArrowRightIcon className="w-3.5 h-3.5 secondary-text mr-2 group-hover:mr-0 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;

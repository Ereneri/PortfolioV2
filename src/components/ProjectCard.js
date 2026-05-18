import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

// Import all known thumbnails so webpack bundles them correctly
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

function getThumbnail(image) {
  if (!image) return null;
  return thumbnailMap[image] ?? null;
}

function ProjectCard({ id, name, description, image }) {
  const thumbnail = getThumbnail(image);

  return (
    <Link
      to={`/projects/${id}`}
      className="mx-auto w-full rounded-3xl bg-tertiary gap-0 flex flex-col text-light transition-all cursor-pointer duration-300 group hover:scale-[1.02] hover:bg-[var(--clr-info-a0)] overflow-hidden"
    >
      {thumbnail && (
        <div className="w-full h-44 overflow-hidden">
          <img
            src={thumbnail}
            alt={`${name} thumbnail`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-8 flex flex-col gap-4 flex-1 justify-between">
        <div className="text-left flex flex-col gap-4">
          <span className="text-4xl code-font font-bold transition-colors uppercase">
            {name}
          </span>
          <span className="text-base">{description}</span>
        </div>
        <button className="rounded-xl text-base gap-2 flex justify-between transition-colors duration-300">
          <span className="uppercase whitespace-nowrap">View Project</span>
          <ArrowRightIcon className="inline secondary-text w-5 h-5 mr-4 group-hover:mr-0 transition-all duration-300" />
        </button>
      </div>
    </Link>
  );
}

export default ProjectCard;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowDownTrayIcon, ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/16/solid";
import projectsList from "../data/projects.json";
import githubIcon from "../assets/github-mark-white.svg";

// Import all project images
import kafkaImg from "../assets/kafka.jpg";
import flappybirdImg from "../assets/flappybird.jpg";
import img2048 from "../assets/2048.png";
import earthImg from "../assets/Earth.png";
import otdThumbImg from "../assets/otdThumb.png";
import gameThumbImg from "../assets/gameThumb.png";
import caffein8Img from "../assets/caffein8.png";

// Create image map for project thumbnails
const projectImages = {
  "kafka.jpg": kafkaImg,
  "flappybird.jpg": flappybirdImg,
  "2048.png": img2048,
  "Earth.png": earthImg,
  "otdThumb.png": otdThumbImg,
  "gameThumb.png": gameThumbImg,
  "caffein8.png": caffein8Img
};

// Helper function to get image path - for dynamic media, use require
const getImagePath = (path) => {
  try {
    return require(`../assets/${path}`);
  } catch (err) {
    console.error(`Image not found: ${path}`);
    return null;
  }
};

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projectsList.find((p) => p.id === projectId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage("");
  };

  // Handle ESC key and prevent background scrolling
  useEffect(() => {
    if (lightboxOpen) {
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";

      // Handle ESC key
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          closeLightbox();
        }
      };

      document.addEventListener("keydown", handleEscKey);

      // Cleanup function
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [lightboxOpen]);

  // Helper function to get width class based on width property
  const getWidthClass = (width) => {
    switch (width) {
      case "small":
        return "w-full md:flex-[0_0_calc(33.333%-0.67rem)]";
      case "medium":
        return "w-full md:flex-[0_0_calc(50%-0.5rem)]";
      case "large":
        return "w-full md:flex-[0_0_calc(66.666%-0.67rem)]";
      case "full":
        return "w-full";
      default:
        return "w-full md:flex-[0_0_calc(50%-0.5rem)]";
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen max-w-[1100px] mx-auto py-8 px-4">
        <div className="flex flex-col gap-8 items-center justify-center">
          <h1 className="text-6xl font-extrabold text-light">
            Project Not Found
          </h1>
          <Link
            to="/projects"
            className="text-xl primary-text hover:underline flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[1100px] mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <button
          onClick={() => navigate("/projects")}
          className="text-xl primary-text hover:underline flex items-center gap-2 w-fit transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Projects
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 flex-wrap items-center">
            {project.githubUrl && (
              <button
                onClick={() => window.open(project.githubUrl, "_blank")}
                className="cursor-pointer bg-secondary text-light px-4 py-2 rounded-xl font-semibold transition-all uppercase hover:bg-[var(--clr-info-a0)] text-sm flex items-center gap-2"
              >
                <img src={githubIcon} className="w-4 h-4" alt="GitHub" />
                Github
              </button>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary hover:bg-opacity-80 text-light px-6 py-3 rounded-xl font-semibold transition-all uppercase"
              >
                View Live Demo
              </a>
            )}
            <div>
              <span className="text-md text-light">
                Last Updated: <strong>{project.updatedAt}</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <img
              src={projectImages[project.image]}
              alt={`${project.name} Screenshot`}
              className="w-20 h-20 object-cover rounded-xl mr-6"
            />
            <h1 className="md:text-7xl text-4xl font-extrabold text-light code-font uppercase text-left">
              {project.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-primary px-4 py-2 text-sm rounded-xl text-light bg-tertiary cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <p className="md:text-lg text-light leading-relaxed text-left">
              {project.fullDescription}
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-secondary mb-4 uppercase">
              Project Media
            </h2>
            {project.media.find((item) => item.type === "pdf") && (
              <div className="w-full py-4 warning rounded-xl text-left px-6 my-8 text-light font-bold code-font cursor-default md:hidden block">
                  Warning The PDFs may not load on mobile, if so please try the
                  download links below.
              </div>
            )}
            {project.media && project.media.length > 0 ? (
              <div className="flex flex-wrap gap-4 w-full justify-center">
                {project.media.map((item, index) => (
                  <div
                    key={index}
                    className={`${getWidthClass(
                      item.width
                    )} flex flex-col gap-2`}
                  >
                    {item.type === "image" ? (
                      <div className="relative group">
                        <img
                          src={getImagePath(item.url)}
                          alt={item.caption || `Screenshot ${index + 1}`}
                          className="w-full h-auto rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
                          onClick={() => openLightbox(getImagePath(item.url))}
                        />
                        {item.caption && (
                          <p className="text-sm text-light mt-2 italic">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    ) : item.type === "video" ? (
                      <div className="flex flex-col gap-2">
                        <div className="relative group">
                          <video
                            src={getImagePath(item.url)}
                            controls
                            className="w-full h-auto rounded-xl shadow-lg"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                          {item.caption && (
                            <p className="text-sm text-light mt-2 italic">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : item.type === "pdf" ? (
                      <div className="flex flex-col gap-2">
                        <div className="bg-tertiary rounded-xl p-4 shadow-lg">
                          <iframe
                            src={getImagePath(item.url)}
                            className="w-full h-[600px] rounded-lg"
                            title={item.caption || `PDF ${index + 1}`}
                          />
                        </div>
                        {item.caption && (
                          <p className="text-sm text-light mt-2 italic">
                            {item.caption}
                          </p>
                        )}
                        <a
                          href={getImagePath(item.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:underline text-sm flex items-center gap-1"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          Download PDF
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-light text-lg">
                No screenshots available for this project yet.
              </p>
            )}
          </div>

          {/* Lightbox for images */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-4xl hover:text-secondary transition-colors"
                aria-label="Close lightbox"
              >
                &times;
              </button>
              <img
                src={lightboxImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;

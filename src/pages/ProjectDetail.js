import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/16/solid";
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

const projectImages = {
  "kafka.jpg": kafkaImg,
  "flappybird.jpg": flappybirdImg,
  "2048.png": img2048,
  "Earth.png": earthImg,
  "otdThumb.png": otdThumbImg,
  "gameThumb.png": gameThumbImg,
  "caffein8.png": caffein8Img,
};

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
  const project = projectsList.find((p) => p.id === projectId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: "", caption: "" });

  const openLightbox = (src, caption = "") => {
    setLightboxImage({ src, caption });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage({ src: "", caption: "" });
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [lightboxOpen]);

  const getWidthClass = (width) => {
    switch (width) {
      case "small":  return "w-full md:flex-[0_0_calc(33.333%-0.67rem)]";
      case "medium": return "w-full md:flex-[0_0_calc(50%-0.5rem)]";
      case "large":  return "w-full md:flex-[0_0_calc(66.666%-0.67rem)]";
      case "full":   return "w-full";
      default:       return "w-full md:flex-[0_0_calc(50%-0.5rem)]";
    }
  };

  if (!project) {
    return (
      <main id="main-content" className="min-h-screen max-w-[1100px] mx-auto py-8 px-4">
        <div className="flex flex-col gap-6 items-center justify-center pt-24">
          <h1 className="text-6xl font-extrabold text-light code-font">404</h1>
          <p className="text-white/60">Project not found.</p>
          <Link
            to="/projects"
            className="text-sm primary-text hover:underline flex items-center gap-1.5"
          >
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen max-w-[1100px] mx-auto md:py-10 px-4 py-5">
      <div className="flex flex-col gap-5 md:gap-8">

        {/* ── Back button ── */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* ── Project header ── */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Title row */}
          <div className="flex flex-row items-center gap-4">
            {projectImages[project.image] && (
              <img
                src={projectImages[project.image]}
                alt={`${project.name} icon`}
                className="w-14 h-14 object-cover rounded-xl shrink-0"
              />
            )}
            <div>
              <h1 className="md:text-5xl text-3xl font-extrabold text-light code-font uppercase tracking-tight leading-none">
                {project.name}
              </h1>
              <p className="text-xs text-white/40 mt-1 code-font">
                Last updated: {project.updatedAt}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
              >
                <img src={githubIcon} className="w-4 h-4" alt="" aria-hidden="true" />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="md:text-base text-sm text-white/80 leading-relaxed">
            {project.fullDescription}
          </p>
        </div>

        {/* ── Media ── */}
        <div>
          <h2 className="text-xl font-bold primary-text uppercase tracking-tight mb-6">
            Project Media
          </h2>

          {/* Mobile PDF warning */}
          {project.media.some((item) => item.type === "pdf") && (
            <div className="warning rounded-lg mb-6 md:hidden">
              PDFs may not load on mobile — use the download links below if needed.
            </div>
          )}

          {project.media && project.media.length > 0 ? (
            <div className="flex flex-wrap gap-4 w-full">
              {project.media.map((item, index) => (
                <div
                  key={index}
                  className={`${getWidthClass(item.width)} flex flex-col gap-2`}
                >
                  {item.type === "image" ? (
                    <div className="relative group">
                      <img
                        src={getImagePath(item.url)}
                        alt={item.caption || `Screenshot ${index + 1}`}
                        className="w-full h-auto rounded-xl shadow-lg cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
                        loading="lazy"
                        onClick={() =>
                          openLightbox(getImagePath(item.url), item.caption)
                        }
                      />
                      {item.caption && (
                        <p className="text-xs text-white/50 mt-1.5 italic">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  ) : item.type === "video" ? (
                    <div className="flex flex-col gap-2">
                      <video
                        src={getImagePath(item.url)}
                        controls
                        className="w-full h-auto rounded-xl shadow-lg"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                      {item.caption && (
                        <p className="text-xs text-white/50 mt-1.5 italic">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  ) : item.type === "pdf" ? (
                    <div className="flex flex-col gap-2">
                      <div className="bg-tertiary rounded-xl p-3 shadow-lg">
                        <iframe
                          src={getImagePath(item.url)}
                          className="w-full h-[600px] rounded-lg"
                          title={item.caption || `PDF ${index + 1}`}
                        />
                      </div>
                      {item.caption && (
                        <p className="text-xs text-white/50 mt-1.5 italic">
                          {item.caption}
                        </p>
                      )}
                      <a
                        href={getImagePath(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs primary-text hover:underline"
                      >
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm">
              No media available for this project yet.
            </p>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 bg-black/92 z-50 flex flex-col items-center justify-center p-4 gap-3"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl leading-none transition-colors"
            aria-label="Close lightbox"
          >
            &times;
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.caption || "Enlarged view"}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxImage.caption && (
            <p className="text-white/50 text-sm italic text-center">
              {lightboxImage.caption}
            </p>
          )}
        </div>
      )}
    </main>
  );
}

export default ProjectDetail;

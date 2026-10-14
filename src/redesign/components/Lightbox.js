import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { animate } from "motion/react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { EASE, REDUCE, asset } from "../lib/env";

// Full-colour viewer for project screenshots. Modal: everything behind it is inert,
// Tab is trapped, Escape closes, arrows page, focus returns to the thumbnail.
export default function Lightbox({ images, index, onIndex, onClose }) {
  const box = useRef(null);
  const img = useRef(null);
  const closeBtn = useRef(null);
  const open = index !== null;
  const item = open ? images[index] : null;

  useEffect(() => {
    if (!open) return undefined;
    const last = document.activeElement;
    const root = document.getElementById("main");
    root?.setAttribute("inert", "");
    document.querySelector(".nav")?.setAttribute("inert", "");
    document.querySelector(".foot")?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      root?.removeAttribute("inert");
      document.querySelector(".nav")?.removeAttribute("inert");
      document.querySelector(".foot")?.removeAttribute("inert");
      document.body.style.overflow = "";
      if (last && last.focus) last.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
      if (e.key === "Tab") {
        const f = [...box.current.querySelectorAll("button")];
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndex]);

  useEffect(() => {
    if (!open || REDUCE || !img.current) return;
    animate(
      img.current,
      { opacity: [0, 1], clipPath: ["polygon(0% 0%, 7% 0%, 0% 100%, 0% 100%)", "polygon(0% 0%, 107% 0%, 100% 100%, 0% 100%)"] },
      { duration: 0.6, ease: EASE },
    );
  }, [open, index]);

  // portalled next to <main> (inside .rd) so making the page inert doesn't disable the viewer
  const host = document.querySelector(".rd") || document.body;
  return createPortal(
    <div
      ref={box}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      hidden={!open}
      onClick={(e) => { if (!e.target.closest("img, button")) onClose(); }}
    >
      <div className="lb-bar">
        <span className="t-meta lb-cap" aria-live="polite">{item?.caption || ""}</span>
        <div className="lb-nav">
          <button type="button" className="icon-btn" aria-label="Previous image" data-cursor="Prev" onClick={() => onIndex((index - 1 + images.length) % images.length)}>
            <CaretLeft aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn" aria-label="Next image" data-cursor="Next" onClick={() => onIndex((index + 1) % images.length)}>
            <CaretRight aria-hidden="true" />
          </button>
          <button ref={closeBtn} type="button" className="icon-btn" aria-label="Close viewer" data-cursor="Close" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="lb-stage">
        {item && <img ref={img} src={asset(item.url)} alt={item.caption || "Project screenshot"} />}
      </div>
    </div>,
    host,
  );
}

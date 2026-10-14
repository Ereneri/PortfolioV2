import { createElement, forwardRef, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/env";

// Scroll reveal: angled wipe + rise. `as` is a tag name or a component (e.g. Link).
// The huge top margin means anything jumped past (deep links, fast scroll) still reveals.
const FROM = "polygon(0% 0%, 7% 0%, 0% 100%, 0% 100%)";
const TO = "polygon(0% 0%, 107% 0%, 100% 100%, 0% 100%)";
const created = new Map();
const motionOf = (as) => {
  if (typeof as === "string") return motion[as];
  if (!created.has(as)) created.set(as, motion.create(as));
  return created.get(as);
};

const Reveal = forwardRef(function Reveal({ as = "div", delay = 0, children, ...props }, outer) {
  const reduce = useReducedMotion();
  const inner = useRef(null);
  if (reduce) return createElement(as, { ref: outer, ...props }, children);
  const M = motionOf(as);
  const setRef = (n) => {
    inner.current = n;
    if (typeof outer === "function") outer(n);
    else if (outer) outer.current = n;
  };
  return (
    <M
      ref={setRef}
      initial={{ opacity: 0, y: 28, clipPath: FROM }}
      whileInView={{ opacity: 1, y: 0, clipPath: TO }}
      viewport={{ once: true, margin: "100000px 0px -8% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      onAnimationComplete={() => {
        // drop the clip so registration ticks outside the box aren't cut off
        if (inner.current) inner.current.style.clipPath = "none";
      }}
      {...props}
    >
      {children}
    </M>
  );
});

export default Reveal;

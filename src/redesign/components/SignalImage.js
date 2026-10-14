import { useEffect, useRef } from "react";
import Signal from "../lib/signalImage";
import { asset } from "../lib/env";

// React wrapper for the canvas load-in (see lib/signalImage.js for the options).
// Renders a sized box; the canvas is created inside it on mount and torn down on unmount,
// so changing `src` replays the load-in.
export default function SignalImage({
  src,
  as: Tag = "div",
  className = "",
  label,
  decorative = false,
  cell, cellSm, focus, contrast, bright, gamma, sharpen, gContrast, gBright,
  fit, inset, pool, invert, rest, hover, ratio, minRatio, autoReveal, revealMs,
  ...props
}) {
  const ref = useRef(null);
  const url = asset(src);
  const opts = JSON.stringify({
    src: url, cell, cellSm, focus, contrast, bright, gamma, sharpen, gContrast, gBright,
    fit, inset, pool, invert, rest, hover, ratio, minRatio, autoReveal, revealMs,
  });

  useEffect(() => {
    if (!ref.current || !url) return undefined;
    const s = new Signal(ref.current, JSON.parse(opts));
    return () => s.destroy();
  }, [opts, url]);

  const a11y = Tag === "button" ? {} : decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label };
  return <Tag ref={ref} className={`dither ${className}`} data-signal="" {...a11y} {...props} />;
}

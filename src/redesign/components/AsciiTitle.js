import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { art, decodeArt, snapArt, widthOf } from "../lib/ascii";

const fontReady = () =>
  document.fonts ? document.fonts.load('400 16px "JetBrains Mono"').catch(() => {}) : Promise.resolve();

// FIGlet title. The real text stays in the DOM for assistive tech; the art is aria-hidden.
// Sizing: the whole title on one line if that keeps the font at or above `min`, otherwise
// one word per line-wrap; `lines` forces one word per line. `maxSm` caps size under 768px.
// decode: "load" plays the glyph decode once fonts are ready, "view" when scrolled into
// view, "none" skips it.
export default function AsciiTitle({
  as: Tag = "h2",
  text,
  lines = false,
  max = 24,
  maxSm,
  min = 4,
  decode = "view",
  delay = 0,
  className = "",
  ...props
}) {
  const el = useRef(null);
  const box = useRef(null);
  const arts = useMemo(() => text.split(/\s+/).filter(Boolean).map((w) => art(w)), [text]);

  // Build the <pre> blocks imperatively so React never fights the decode animation.
  useLayoutEffect(() => {
    const b = box.current;
    b.replaceChildren(...arts.map((a) => {
      const pre = document.createElement("pre");
      pre.textContent = a;
      return pre;
    }));
    const widths = arts.map(widthOf);
    const longest = Math.max(...widths);
    const oneLine = widths.reduce((t, w) => t + w, 0) + (widths.length - 1) * (1.6 / 0.6);
    const fit = () => {
      const w = el.current?.clientWidth;
      if (!w) return;
      const cap = (window.innerWidth < 768 && maxSm) || max;
      const one = w / (oneLine * 0.6), each = w / (longest * 0.6);
      const size = snapArt(b, Math.max(min, Math.min(cap, lines || one < min ? each : one)));
      // safety net: if the art still renders wider than its box (rounding, late font swap), shrink it
      const over = b.scrollWidth / w;
      if (over > 1.002) snapArt(b, size / over);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.current);
    fontReady().then(fit);
    document.fonts?.addEventListener("loadingdone", fit);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, [arts, lines, max, maxSm, min]);

  useEffect(() => {
    if (decode === "none") return undefined;
    const token = { cancelled: false };
    let io;
    if (decode === "load") {
      fontReady().then(() => !token.cancelled && decodeArt(box.current, { delay, token }));
    } else {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        decodeArt(box.current, { delay: delay + 100, token });
      }, { threshold: 0.1, rootMargin: "100000px 0px -8% 0px" });
      io.observe(el.current);
    }
    return () => {
      token.cancelled = true;
      io?.disconnect();
    };
  }, [arts, decode, delay]);

  return (
    <Tag ref={el} className={className} data-ascii="" {...props}>
      <span className="sr-only">{text}</span>
      <span ref={box} className={`ascii-art${lines ? " lines" : ""}`} aria-hidden="true" />
    </Tag>
  );
}

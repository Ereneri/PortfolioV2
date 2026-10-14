import { useEffect, useRef } from "react";
import { art, snapArt } from "../lib/ascii";
import { B8, FINE, REDUCE } from "../lib/env";

// Footer wordmark in ANSI Shadow: block glyphs dissolve downward into shade characters
// in Bayer order; the cursor restores them.
const SHADES = [" ", "░", "▒", "▓"];

export default function AsciiWordmark({ text = "ereneri.dev" }) {
  const el = useRef(null);
  const pre = useRef(null);

  useEffect(() => {
    const lines = art(text).split("\n");
    const cols = Math.max(...lines.map((l) => l.length));
    const H = lines.length;
    let fs = 16, pointer = null, raf = 0, near = false;

    const draw = () => {
      raf = 0;
      const cw = fs * 0.6, lh = fs * 1.32, R = 220;
      pre.current.textContent = lines.map((line, y) => {
        let row = "";
        for (let x = 0; x < line.length; x++) {
          const c = line[x];
          if (c === " ") { row += c; continue; }
          const grad = 1.08 - Math.pow(y / (H - 1), 1.15) * 0.95;
          let prox = 0;
          if (pointer) {
            const d = Math.hypot(x * cw - pointer.x, y * lh - pointer.y);
            prox = d < R ? Math.pow(1 - d / R, 1.4) : 0;
          }
          const v = Math.min(1, grad + prox), th = B8[((y & 7) << 3) | (x & 7)];
          if (v > th) row += c;
          else if (c === "█") row += SHADES[Math.max(0, Math.min(3, Math.floor((v / th) * 4)))];
          else row += " ";
        }
        return row;
      }).join("\n");
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const fit = () => {
      if (!el.current) return;
      fs = snapArt(pre.current, el.current.clientWidth / (cols * 0.6));
      draw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.current);
    document.fonts?.ready.then(fit);

    const onMove = (e) => {
      const r = el.current.getBoundingClientRect();
      const isNear = e.clientY > r.top - 200 && e.clientY < r.bottom + 200;
      pointer = isNear ? { x: e.clientX - r.left, y: e.clientY - r.top } : null;
      if (isNear || near) queue();
      near = isNear;
    };
    if (FINE && !REDUCE) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [text]);

  return (
    <div ref={el} className="wordmark" role="img" aria-label={text}>
      <pre ref={pre} className="ascii-word" aria-hidden="true" />
    </div>
  );
}

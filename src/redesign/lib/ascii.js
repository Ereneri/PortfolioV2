import figlet from "figlet";
import ansiShadow from "figlet/importable-fonts/ANSI Shadow.js";
import { REDUCE } from "./env";

// FIGlet titles set in JetBrains Mono. Only ANSI Shadow is bundled.
figlet.parseFont("ANSI Shadow", ansiShadow);

const cache = new Map();
export function art(text, font = "ANSI Shadow") {
  const key = font + "|" + text;
  if (!cache.has(key)) {
    let out;
    try {
      out = figlet.textSync(text.toUpperCase(), { font });
    } catch {
      out = text;
    }
    const lines = out.replace(/[ \t]+$/gm, "").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    cache.set(key, lines.join("\n"));
  }
  return cache.get(key);
}

export const widthOf = (a) => Math.max(...a.split("\n").map((l) => l.length));

// JetBrains Mono cells are 0.6em wide and its block glyph is exactly 1.32em tall.
// Snap the cell to whole device pixels and floor the row height so adjacent blocks
// touch (or overlap by under a pixel) instead of showing anti-aliased seams.
export function snapArt(node, fs) {
  const dpr = window.devicePixelRatio || 1;
  const cw = Math.max(1, Math.floor(fs * 0.6 * dpr)) / dpr;
  const size = cw / 0.6;
  const lh = Math.floor(size * 1.32 * dpr) / dpr + "px";
  // set on each <pre> too: some engines don't pass the size down through the flex wrapper
  for (const n of [node, ...node.querySelectorAll("pre")]) {
    n.style.fontSize = size + "px";
    n.style.lineHeight = lh;
  }
  return size;
}

// Decode: each glyph cycles through block shades, resolving left to right. Spaces never
// change and the face is monospaced, so the silhouette never shifts.
const GLYPHS = "░▒▓█#%/\\<>=+";
export function decodeArt(box, { duration = 900, delay = 0, token } = {}) {
  if (REDUCE || !box || box.dataset.decoding) return Promise.resolve();
  box.dataset.decoding = "1";
  const pres = [...box.querySelectorAll("pre")];
  const finals = pres.map((p) => p.dataset.final ?? (p.dataset.final = p.textContent));
  const W = Math.max(...finals.map(widthOf));
  const plan = finals.map((f) => [...f].map((c, i) => {
    const x = i - f.lastIndexOf("\n", i - 1) - 1;
    return { c, s: (x / W) * 0.62 + Math.random() * 0.2 };
  }));
  const frame = (p) => pres.forEach((pre, k) => {
    let out = "";
    for (const { c, s } of plan[k]) {
      if (c === " " || c === "\n" || p >= s + 0.16) out += c;
      else if (p >= s) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      else out += " ";
    }
    pre.textContent = out;
  });
  const finish = () => {
    pres.forEach((pre, k) => (pre.textContent = finals[k]));
    delete box.dataset.decoding;
  };
  frame(0);
  return new Promise((res) => {
    setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        if (token && token.cancelled) { finish(); return res(); }
        const p = Math.min(1, (now - t0) / duration);
        frame(p);
        if (p < 1) requestAnimationFrame(tick);
        else { finish(); res(); }
      };
      requestAnimationFrame(tick);
    }, delay);
  });
}

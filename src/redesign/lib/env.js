// Shared environment for the redesign: motion/pointer preferences, colour tokens,
// the 8x8 Bayer matrix, and small helpers used by the canvas effects.

const mq = (q) => typeof window !== "undefined" && window.matchMedia && window.matchMedia(q).matches;

export const REDUCE = mq("(prefers-reduced-motion: reduce)");
export const FINE = mq("(hover: hover) and (pointer: fine)");
export const EASE = [0.16, 1, 0.3, 1];

// 8x8 Bayer matrix, normalised to (0, 1)
export const B8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

const hex = (s) => {
  s = s.trim().replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Live colour tokens; refreshed whenever the theme changes.
export const TOK = { ink: [10, 10, 11], paper: [235, 235, 235], dark: true, fg: [235, 235, 235], bg: [10, 10, 11] };
export function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  const ink = cs.getPropertyValue("--ink"), paper = cs.getPropertyValue("--paper");
  if (ink) TOK.ink = hex(ink);
  if (paper) TOK.paper = hex(paper);
  TOK.dark = document.documentElement.dataset.theme !== "light";
  TOK.fg = TOK.dark ? TOK.paper : TOK.ink;
  TOK.bg = TOK.dark ? TOK.ink : TOK.paper;
}

export const make = (tag, cls) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
};

export function cover(iw, ih, w, h, fx = 0.5, fy = 0.5) {
  const s = Math.max(w / iw, h / ih);
  const sw = w / s, sh = h / s;
  return [(iw - sw) * fx, (ih - sh) * fy, sw, sh];
}

const imgCache = new Map();
export function loadImg(src) {
  if (!imgCache.has(src)) {
    imgCache.set(src, new Promise((res, rej) => {
      const i = new Image();
      i.decoding = "async";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = src;
    }));
  }
  return imgCache.get(src);
}

// rAF tween. Pass a token ({ cancelled: false }) to stop it from outside.
export function tween(dur, onUpdate, ease = (t) => 1 - Math.pow(1 - t, 3), token) {
  return new Promise((res) => {
    if (REDUCE) { onUpdate(1); return res(); }
    const t0 = performance.now();
    const f = (now) => {
      if (token && token.cancelled) return res();
      const t = Math.min(1, (now - t0) / dur);
      onUpdate(ease(t));
      if (t < 1) requestAnimationFrame(f);
      else res();
    };
    requestAnimationFrame(f);
  });
}

// House style: no em / en dashes in rendered copy.
export const clean = (s) => String(s ?? "").replace(/\s*—\s*/g, ": ").replace(/–/g, "-");
export const yearOf = (updated) => (String(updated).match(/\d{4}/) || ["Now"])[0];
export const isDev = (p) => /development/i.test(p.updatedAt);

// Resolve a path under src/assets to its bundled URL (same convention as the classic pages).
export function asset(path) {
  try {
    return require(`../../assets/${path}`);
  } catch {
    return null;
  }
}

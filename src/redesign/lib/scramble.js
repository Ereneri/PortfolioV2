import { REDUCE } from "./env";

// Text decode on a plain DOM node: the node's own text cycles through glyphs and settles.
// Callers keep the real text available to assistive tech (see components/Scramble.js);
// this only ever animates aria-hidden nodes.
const GLYPHS = "#%&*+=<>/\\[]{}01XZ";

export function scramble(node, final, { duration = 650, delay = 0, token } = {}) {
  if (!node) return Promise.resolve();
  if (REDUCE || !String(final).trim()) {
    node.textContent = final;
    return Promise.resolve();
  }
  const n = final.length;
  const starts = Array.from({ length: n }, (_, i) => (i / n) * 0.55 + Math.random() * 0.18);
  return new Promise((res) => {
    setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        if (token && token.cancelled) { node.textContent = final; return res(); }
        const p = Math.min(1, (now - t0) / duration);
        let s = "";
        for (let i = 0; i < n; i++) {
          const ch = final[i];
          s += ch === " " || p >= starts[i] + 0.22 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        node.textContent = s;
        if (p < 1) requestAnimationFrame(tick);
        else { node.textContent = final; res(); }
      };
      requestAnimationFrame(tick);
    }, delay);
  });
}

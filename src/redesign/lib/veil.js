import { B8, REDUCE, make, tween } from "./env";

// Veil: a full-screen canvas that covers / uncovers the page in Bayer order, travelling
// diagonally. Used for route changes and the theme switch.
const CELL = 18;
let canvas = null;

function ensure() {
  if (canvas && canvas.isConnected) return canvas;
  canvas = make("canvas", "veil");
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  return canvas;
}

export function draw(p, color) {
  const c = ensure();
  const cw = Math.ceil(window.innerWidth / CELL), ch = Math.ceil(window.innerHeight / CELL);
  if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
  const x = c.getContext("2d"), im = x.createImageData(cw, ch), d = im.data;
  if (p > 0) {
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
      const q = p * 1.6 - ((i / cw + j / ch) / 2) * 0.6; // diagonal bias: top-left to bottom-right
      if (B8[((j & 7) << 3) | (i & 7)] < q) {
        const k = (j * cw + i) * 4;
        d[k] = color[0]; d[k + 1] = color[1]; d[k + 2] = color[2]; d[k + 3] = 255;
      }
    }
  }
  x.putImageData(im, 0, 0);
}

export const cover = (color, ms = 380) => (REDUCE ? Promise.resolve() : tween(ms, (p) => draw(p, color), (t) => t));
export const uncover = (color, ms = 520) => (REDUCE ? (draw(0, color), Promise.resolve()) : tween(ms, (p) => draw(1 - p, color), (t) => t));

export function remove() {
  canvas?.remove();
  canvas = null;
}

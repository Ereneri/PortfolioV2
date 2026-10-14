import { B8, FINE, REDUCE, TOK, cover, loadImg, make, tween } from "./env";

// SignalImage: images load in as a 1-bit Bayer dither with a horizontal-slice glitch,
// then resolve to the clean image (original colour, or grey for `rest: "gray"`).
// Grey images dissolve to colour on hover. Framework-agnostic; see SignalImage.js for
// the React wrapper.
//
// opts: src, cell, cellSm, focus [x, y], contrast, bright, gamma, sharpen, fit ("cover" |
// "contain"), inset, pool ("avg" | "min" keeps hairlines in diagrams), invert (line art
// shown inverted in dark theme), rest ("color" | "gray"), hover (colour reveal), ratio
// ("natural" sizes the box to the image), minRatio, autoReveal, revealMs.
export default class Signal {
  static all = new Set();

  constructor(el, opts) {
    this.el = el;
    this.o = opts;
    this.cell = (window.innerWidth < 768 && opts.cellSm) || opts.cell || 3;
    [this.fx, this.fy] = opts.focus || [0.5, 0.5];
    this.contrast = opts.contrast ?? 1.2;
    this.bright = opts.bright ?? 0;
    this.gamma = opts.gamma ?? 1;
    this.sharpen = opts.sharpen ?? 0;
    this.fit = opts.fit || "cover";
    this.pool = opts.pool || "avg";
    // inverted line art (the Kafka diagrams) rests as inverted grey and never flips back to the white original
    this.rest = opts.rest === "gray" || opts.invert ? "gray" : "color";
    this.gContrast = opts.gContrast ?? 1.08;
    this.gBright = opts.gBright ?? 0;
    this.hover = FINE && !REDUCE && opts.hover !== false && this.rest === "gray" && !opts.invert;
    this.p = REDUCE ? 1 : 0; // load-in progress
    this.cp = 0; // hover colour progress
    this.dirty = true;
    this.token = { cancelled: false };

    this.canvas = make("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    el.append(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.small = make("canvas");
    this.sctx = this.small.getContext("2d", { willReadFrequently: true });
    Signal.all.add(this);

    this.ro = new ResizeObserver(() => this.img && this.layout());
    this.ro.observe(el);

    loadImg(opts.src).then((img) => {
      if (this.dead) return;
      this.img = img;
      if (opts.ratio === "natural") {
        // keep screenshots uncropped; very tall ones are contained in a wider box
        const r = img.naturalWidth / img.naturalHeight, min = opts.minRatio || 0.62;
        el.style.aspectRatio = String(Math.max(r, min));
        if (r < min) this.fit = "contain";
      }
      this.layout(true);
      if (opts.autoReveal !== false) this.whenVisible(() => this.reveal(opts.revealMs));
    }).catch(() => el.classList.add("signal-missing"));

    if (this.hover) {
      this.onEnter = () => { this.hovering = true; if (this.p >= 1) this.colour(1); };
      this.onLeave = () => { this.hovering = false; this.colour(0); };
      el.addEventListener("pointerenter", this.onEnter);
      el.addEventListener("pointerleave", this.onLeave);
    }
  }

  destroy() {
    this.dead = true;
    this.token.cancelled = true;
    this.ro.disconnect();
    this.io?.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.onEnter) {
      this.el.removeEventListener("pointerenter", this.onEnter);
      this.el.removeEventListener("pointerleave", this.onLeave);
    }
    this.canvas.remove();
    Signal.all.delete(this);
  }

  inverted() { return this.rest !== "color" && this.o.invert && TOK.dark; }

  whenVisible(cb) {
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.io.disconnect(); cb(); } }, { threshold: 0.2 });
    this.io.observe(this.el);
  }

  colour(to) {
    const from = this.cp, id = (this.cpRun = (this.cpRun || 0) + 1);
    tween(Math.abs(to - from) * 420 + 1, (t) => {
      if (id === this.cpRun && !this.dead) { this.cp = from + (to - from) * t; this.draw(); }
    }, (t) => t, this.token);
  }

  layout(force) {
    const r = this.el.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (!force && w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    const dpr = (this.dpr = Math.min(window.devicePixelRatio || 1, 2));
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    const cw = (this.cw = Math.ceil(w / this.cell)), ch = (this.ch = Math.ceil(h / this.cell));
    this.small.width = cw; this.small.height = ch;
    const iw = this.img.naturalWidth, ih = this.img.naturalHeight;
    if (this.fit === "contain") {
      const s = Math.min(w / iw, h / ih) * (this.o.inset || 0.84), dw = iw * s, dh = ih * s;
      this.dest = [(w - dw) / 2, (h - dh) / 2, dw, dh];
      this.crop = [0, 0, iw, ih];
    } else {
      this.crop = cover(iw, ih, w, h, this.fx, this.fy);
      this.dest = [0, 0, w, h];
    }
    const [dx, dy, dw, dh] = this.dest, k = cw / w;
    const lum = (a, j) => ((0.2126 * a[j] + 0.7152 * a[j + 1] + 0.0722 * a[j + 2]) / 255) * (a[j + 3] / 255);
    const L = (this.L = new Float32Array(cw * ch));
    if (this.pool === "min") {
      // sample at 3x and keep the darkest sub-pixel so hairline strokes survive the downscale
      const S = 3, t = make("canvas");
      t.width = cw * S; t.height = ch * S;
      const tx = t.getContext("2d", { willReadFrequently: true });
      tx.imageSmoothingQuality = "high";
      tx.drawImage(this.img, ...this.crop, dx * k * S, dy * k * S, dw * k * S, dh * k * S);
      const px = tx.getImageData(0, 0, t.width, t.height).data;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        let m = 1, seen = 0;
        for (let v = 0; v < S; v++) for (let u = 0; u < S; u++) {
          const j = ((y * S + v) * t.width + x * S + u) * 4;
          if (px[j + 3] < 8) continue;
          seen++; m = Math.min(m, lum(px, j));
        }
        L[y * cw + x] = seen ? m : NaN;
      }
    } else {
      this.sctx.clearRect(0, 0, cw, ch);
      this.sctx.imageSmoothingQuality = "high";
      this.sctx.drawImage(this.img, ...this.crop, dx * k, dy * k, dw * k, dh * k);
      const px = this.sctx.getImageData(0, 0, cw, ch).data;
      for (let i = 0; i < cw * ch; i++) L[i] = px[i * 4 + 3] < 8 ? NaN : lum(px, i * 4); // NaN = transparent
    }
    if (this.sharpen) {
      // unsharp mask at cell resolution: recovers small lights and edges lost to averaging
      const src = Float32Array.from(L);
      for (let y = 1; y < ch - 1; y++) for (let x = 1; x < cw - 1; x++) {
        const i = y * cw + x;
        if (Number.isNaN(src[i])) continue;
        let s = 0, n = 0;
        for (let v = -1; v <= 1; v++) for (let u = -1; u <= 1; u++) {
          const q = src[i + v * cw + u];
          if (!Number.isNaN(q)) { s += q; n++; }
        }
        L[i] = src[i] + this.sharpen * (src[i] - s / n);
      }
    }
    for (let i = 0; i < cw * ch; i++) {
      if (Number.isNaN(L[i])) continue;
      const l = Math.pow(Math.max(0, L[i]), this.gamma);
      L[i] = (l - 0.5) * this.contrast + 0.5 + this.bright;
    }
    this.out = this.sctx.createImageData(cw, ch);
    if (this.rest === "gray") this.buildGray();
    if (this.hover || this.rest === "color") this.buildColor();
    this.dirty = true;
    this.draw();
  }

  buildColor() {
    const c = this.color || (this.color = make("canvas"));
    c.width = this.canvas.width; c.height = this.canvas.height;
    const cx = c.getContext("2d");
    cx.imageSmoothingQuality = "high";
    cx.drawImage(this.img, ...this.crop, ...this.dest.map((v) => v * this.dpr));
  }

  // True-tone grey mapped onto the ink..paper range.
  buildGray() {
    const W = this.canvas.width, H = this.canvas.height;
    const g = this.gray || (this.gray = make("canvas"));
    g.width = W; g.height = H;
    const gx = g.getContext("2d", { willReadFrequently: true });
    gx.imageSmoothingQuality = "high";
    gx.clearRect(0, 0, W, H);
    gx.drawImage(this.img, ...this.crop, ...this.dest.map((v) => v * this.dpr));
    const im = gx.getImageData(0, 0, W, H), d = im.data;
    const inv = this.inverted(), a = TOK.ink, b = TOK.paper;
    for (let j = 0; j < d.length; j += 4) {
      if (d[j + 3] < 8) continue;
      let l = ((0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2]) / 255) * (d[j + 3] / 255);
      l = Math.min(1, Math.max(0, (l - 0.5) * this.gContrast + 0.5 + this.gBright));
      if (inv) l = 1 - l;
      d[j] = a[0] + (b[0] - a[0]) * l; d[j + 1] = a[1] + (b[1] - a[1]) * l; d[j + 2] = a[2] + (b[2] - a[2]) * l; d[j + 3] = 255;
    }
    gx.putImageData(im, 0, 0);
  }

  // 1-bit cells that have not decoded yet (Bayer order).
  compose() {
    const { cw, ch, L, out, p } = this;
    const d = out.data, inv = this.inverted(), ink = TOK.ink, paper = TOK.paper;
    for (let y = 0; y < ch; y++) {
      const row = (y & 7) << 3;
      for (let x = 0; x < cw; x++) {
        const i = y * cw + x, j = i * 4, th = B8[row | (x & 7)];
        let v = L[i];
        if (th < p || Number.isNaN(v)) { d[j + 3] = 0; continue; }
        if (inv) v = 1 - v;
        const c = v > th ? paper : ink;
        d[j] = c[0]; d[j + 1] = c[1]; d[j + 2] = c[2]; d[j + 3] = 255;
      }
    }
    this.sctx.putImageData(out, 0, 0);
  }

  // Load-in glitch: horizontal slices jump sideways and some invert; intensity decays as p -> 1.
  glitch(W, H) {
    const now = performance.now();
    if (!this.gl || now - this.glT > 70) {
      this.glT = now;
      this.gl = Array.from({ length: 2 + ((Math.random() * 4) | 0) }, () => ({
        y: Math.random(), h: 0.015 + Math.random() * 0.08, dx: (Math.random() - 0.5) * 0.14, inv: Math.random() < 0.3,
      }));
    }
    const b = this.buf || (this.buf = make("canvas"));
    if (b.width !== W || b.height !== H) { b.width = W; b.height = H; }
    const bx = b.getContext("2d");
    bx.clearRect(0, 0, W, H);
    bx.drawImage(this.canvas, 0, 0);
    const k = Math.pow(1 - this.p, 1.4), ctx = this.ctx;
    for (const s of this.gl) {
      const y = Math.round(s.y * H), h = Math.max(2, Math.round(s.h * H)), dx = Math.round(s.dx * W * k);
      ctx.clearRect(0, y, W, h);
      ctx.drawImage(b, 0, y, W, h, dx, y, W, h);
      if (s.inv && k > 0.25) {
        ctx.save();
        ctx.globalCompositeOperation = "difference";
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, y, W, Math.max(1, Math.round(h * 0.4)));
        ctx.restore();
      }
    }
  }

  draw() {
    if (!this.L || this.dead) return;
    if (this.dirty) { this.compose(); this.dirty = false; }
    const { ctx, dpr, cell } = this, W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);
    const base = this.rest === "color" ? this.color : this.gray;
    if (base) ctx.drawImage(base, 0, 0);
    ctx.imageSmoothingEnabled = false;
    if (this.p < 1) ctx.drawImage(this.small, 0, 0, this.cw * cell * dpr, this.ch * cell * dpr);
    if (this.p > 0 && this.p < 1) this.glitch(W, H);
    if (this.color && this.cp > 0 && this.rest === "gray") {
      // hover: colour dissolves in over the grey, Bayer order
      const m = this.cmask || (this.cmask = make("canvas")), mx = m.getContext("2d");
      if (m.width !== this.cw || m.height !== this.ch) { m.width = this.cw; m.height = this.ch; this.cmData = mx.createImageData(this.cw, this.ch); }
      const md = this.cmData.data;
      for (let y = 0; y < this.ch; y++) for (let x = 0; x < this.cw; x++) md[(y * this.cw + x) * 4 + 3] = B8[((y & 7) << 3) | (x & 7)] < this.cp ? 255 : 0;
      mx.putImageData(this.cmData, 0, 0);
      const o = this.cbuf || (this.cbuf = make("canvas")), ox = o.getContext("2d");
      if (o.width !== W || o.height !== H) { o.width = W; o.height = H; }
      ox.globalCompositeOperation = "source-over";
      ox.clearRect(0, 0, W, H);
      ox.drawImage(this.color, 0, 0);
      ox.globalCompositeOperation = "destination-in";
      ox.imageSmoothingEnabled = false;
      ox.drawImage(m, 0, 0, this.cw * cell * dpr, this.ch * cell * dpr);
      ctx.drawImage(o, 0, 0);
    }
  }

  reveal(ms = 1000) {
    if (REDUCE) { this.p = 1; this.dirty = true; this.draw(); return Promise.resolve(); }
    return tween(ms, (p) => { this.p = p; this.dirty = true; this.draw(); }, (t) => t * t * (3 - 2 * t), this.token)
      .then(() => { if (this.hovering && !this.dead) this.colour(1); });
  }

  retheme() {
    if (!this.L) return;
    if (this.gray) this.buildGray();
    this.dirty = true;
    this.draw();
  }
}

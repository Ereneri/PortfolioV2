import { FINE, REDUCE, make } from "./env";
import { scramble } from "./scramble";

// Reticle cursor: crosshair + four bracket corners that snap to links, buttons, cards and
// images; an action chip ("Open file", "Visit", "Scan"); and the ctOS profiler for elements
// with data-profile. Fine pointers only, never under reduced motion. Also follows keyboard
// focus. Returns a cleanup function.
//
// Targets opt in with attributes: data-cursor (chip label), data-pad (bracket padding),
// data-profile (JSON: { id, name, head?, foot?, rows: [[label, value], ...] }).
const SEL = "[data-cursor], a[href], button, [role='tab'], select";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function startCursor() {
  if (!FINE || REDUCE) return () => {};
  const root = document.documentElement;
  root.classList.add("reticle");

  const x = make("div", "cur-x");
  x.innerHTML = "<i></i><i></i><i></i><i></i>";
  const b = make("div", "cur-b");
  b.innerHTML = '<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>';
  const tag = make("div", "cur-tag");
  const prof = make("div", "profiler");
  const nodes = [x, b, tag, prof];
  nodes.forEach((n) => { n.setAttribute("aria-hidden", "true"); document.body.append(n); });
  const C = b.querySelectorAll(".c");

  let mx = -200, my = -200, lockEl = null, pressed = false, on = false, profOn = false, kb = false, raf = 0;
  const cur = { x: -200, y: -200, w: 24, h: 24, a: 7 }, tgt = { ...cur }, pp = { x: 0, y: 0 };
  const token = { cancelled: false };

  const hideProfile = () => { profOn = false; prof.classList.remove("on"); root.classList.remove("cur-prof"); };

  function setLock(t) {
    if (t === lockEl) return;
    lockEl = t;
    root.classList.toggle("cur-locked", !!t);
    if (t) {
      const label = t.dataset.cursor || (t.matches("[data-signal]") ? "Scan" : t.target === "_blank" ? "Visit" : t.matches("a") ? "Open" : "Select");
      scramble(tag, label, { duration: 240, token });
    }
    const raw = t && t.dataset.profile;
    if (!raw) { if (profOn) hideProfile(); return; }
    const d = JSON.parse(raw);
    prof.innerHTML = `<div class="pf-head"><span>${esc(d.head || "Profile")}</span><span>${esc(d.id)}</span></div>
      <div class="pf-body"><div class="pf-name">${esc(d.name)}</div>
      <dl>${d.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd data-s>${esc(v)}</dd>`).join("")}</dl>
      <div class="pf-foot">${esc(d.foot || "Click to open file")}</div></div>`;
    if (!profOn) { pp.x = mx + 28; pp.y = my + 28; }
    profOn = true;
    prof.classList.add("on");
    root.classList.add("cur-prof");
    prof.querySelectorAll("[data-s]").forEach((n, i) => scramble(n, n.textContent, { duration: 380, delay: 60 + i * 70, token }));
  }

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    mx = e.clientX; my = e.clientY;
    if (kb) { kb = false; root.classList.remove("cur-kb"); }
    if (!on) { on = true; root.classList.add("cur-on"); cur.x = mx - 12; cur.y = my - 12; }
  };
  const onOver = (e) => {
    if (e.target.tagName === "IFRAME") { on = false; root.classList.remove("cur-on"); return; }
    setLock(e.target.closest ? e.target.closest(SEL) || e.target.closest("[data-signal]") : null);
  };
  const onLeave = () => { on = false; root.classList.remove("cur-on"); setLock(null); };
  const onFocus = (e) => {
    if (!e.target.matches || !e.target.matches(":focus-visible")) return;
    kb = true;
    root.classList.add("cur-on", "cur-kb");
    setLock(e.target.closest(SEL) || e.target);
  };
  const onKey = (e) => { if (e.key === "Escape" && profOn) hideProfile(); };
  const onDown = () => (pressed = true);
  const onUp = () => (pressed = false);

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver);
  root.addEventListener("mouseleave", onLeave);
  document.addEventListener("focusin", onFocus);
  window.addEventListener("keydown", onKey);
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);

  const loop = () => {
    if (lockEl && lockEl.isConnected) {
      const r = lockEl.getBoundingClientRect();
      const pad = (lockEl.dataset.pad ? +lockEl.dataset.pad : lockEl.matches("[data-signal]") ? 0 : 7) - (pressed ? 3 : 0);
      tgt.x = r.left - pad; tgt.y = r.top - pad; tgt.w = r.width + pad * 2; tgt.h = r.height + pad * 2;
      tgt.a = Math.max(8, Math.min(18, Math.min(r.width, r.height) / 5));
    } else {
      const s = pressed ? 16 : 24;
      tgt.x = mx - s / 2; tgt.y = my - s / 2; tgt.w = s; tgt.h = s; tgt.a = 7;
    }
    const k = lockEl ? 0.22 : 0.36;
    cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k; cur.w += (tgt.w - cur.w) * k; cur.h += (tgt.h - cur.h) * k; cur.a += (tgt.a - cur.a) * 0.25;
    const a = cur.a;
    x.style.transform = `translate3d(${mx}px,${my}px,0)`;
    const pos = [[cur.x, cur.y], [cur.x + cur.w - a, cur.y], [cur.x, cur.y + cur.h - a], [cur.x + cur.w - a, cur.y + cur.h - a]];
    C.forEach((c, i) => { c.style.width = c.style.height = a + "px"; c.style.transform = `translate3d(${pos[i][0]}px,${pos[i][1]}px,0)`; });
    // keep the action chip on screen even when the locked target runs past the viewport
    const tw = tag.offsetWidth, th = tag.offsetHeight;
    let tx = Math.min(Math.max(8, cur.x), window.innerWidth - tw - 8), ty = cur.y + cur.h + 6;
    if (ty + th > window.innerHeight - 8) ty = Math.min(window.innerHeight - th - 8, Math.max(8, my + 22));
    tag.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    if (profOn) {
      // follow the mouse, or sit beside the focused element when navigating by keyboard
      const pw = prof.offsetWidth, ph = prof.offsetHeight;
      const r = kb && lockEl ? lockEl.getBoundingClientRect() : null;
      const ax = r ? r.right : mx, ay = r ? Math.max(12, r.top) : my, gap = r ? 16 : 28;
      let px = ax + gap, py = ay + (r ? 0 : gap);
      if (px + pw > window.innerWidth - 12) px = (r ? r.left : mx) - gap - pw;
      if (px < 12) px = 12;
      if (py + ph > window.innerHeight - 12) py = window.innerHeight - 12 - ph;
      pp.x += (px - pp.x) * 0.2; pp.y += (py - pp.y) * 0.2;
      prof.style.transform = `translate3d(${pp.x}px,${pp.y}px,0)`;
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    token.cancelled = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    root.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("focusin", onFocus);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    nodes.forEach((n) => n.remove());
    root.classList.remove("reticle", "cur-on", "cur-kb", "cur-locked", "cur-prof");
  };
}

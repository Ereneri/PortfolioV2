import { useEffect, useRef } from "react";
import { B8, TOK } from "../lib/env";

// Small shared pieces of the visual system.

// Registration ticks: L-brackets just outside a frame.
export const Ticks = () => <div className="ticks" aria-hidden="true" />;

// Notched rule: line, 45° step, line. `at` sets where the step sits.
export const Rule = ({ at }) => (
  <div className="rule" style={at ? { "--rule-a": at } : undefined} aria-hidden="true">
    <i />
  </div>
);

// Button with the chamfer + fill-wipe hover. Render as any element/component via `as`.
export function Btn({ as: Tag = "button", solid = false, className = "", children, ...props }) {
  return (
    <Tag className={`btn${solid ? " btn--solid" : ""} ${className}`} {...props}>
      <span className="fill" aria-hidden="true" />
      {children}
    </Tag>
  );
}

// "In development" status with a blinking block caret.
export const Status = ({ children = "In development" }) => (
  <span className="status">
    <span className="caret" aria-hidden="true" />
    {children}
  </span>
);

// 8x8 dithered diagonal used as the brand mark. Redraws when the theme changes.
export function BrandGlyph({ theme }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    c.width = 8;
    c.height = 8;
    const x = c.getContext("2d"), im = x.createImageData(8, 8), fg = TOK.fg;
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
      const v = (i + (7 - j)) / 14, k = (j * 8 + i) * 4;
      im.data[k] = fg[0]; im.data[k + 1] = fg[1]; im.data[k + 2] = fg[2];
      im.data[k + 3] = v > B8[(j << 3) | i] ? 255 : 0;
    }
    x.putImageData(im, 0, 0);
  }, [theme]);
  return <canvas ref={ref} aria-hidden="true" />;
}

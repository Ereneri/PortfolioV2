import { useEffect, useLayoutEffect, useRef } from "react";
import { scramble } from "../lib/scramble";

// Text that decodes in. Screen readers get the final text once (sr-only); only the
// aria-hidden copy animates. trigger: "view" (scrolled into view) or "mount".
export default function Scramble({ as: Tag = "span", text, trigger = "view", delay = 0, duration = 650, className, ...props }) {
  const live = useRef(null);

  useLayoutEffect(() => {
    if (live.current) live.current.textContent = text;
  }, [text]);

  useEffect(() => {
    const node = live.current;
    if (!node) return undefined;
    const token = { cancelled: false };
    let io;
    if (trigger === "mount") {
      scramble(node, text, { delay, duration, token });
    } else {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        scramble(node, text, { delay: delay + 120, duration, token });
      }, { threshold: 0.1, rootMargin: "100000px 0px -8% 0px" });
      io.observe(node);
    }
    return () => {
      token.cancelled = true;
      io?.disconnect();
      node.textContent = text;
    };
  }, [text, trigger, delay, duration]);

  return (
    <Tag className={className} {...props}>
      <span className="sr-only">{text}</span>
      <span ref={live} aria-hidden="true" key={text} />
    </Tag>
  );
}

import projects from "../../data/projects.json";
import technologies from "../../data/technologies.json";
import workExperience from "../../data/workExperience.json";
import techContext from "../../data/techContext.json";
import { clean, yearOf } from "./env";

export { projects, workExperience };

export const findProject = (id) => projects.find((p) => p.id === id);

// Card / preview art: the project's `cover` (falls back to its square icon), with the
// tone settings the inverted Kafka line art needs.
export function coverProps(p) {
  const c = p.cover || { src: p.image };
  return c.invert
    ? { src: c.src, focus: c.focus, invert: true, pool: "min", contrast: 1.6, bright: 0.12 }
    : { src: c.src, focus: c.focus, contrast: 1.25 };
}

// Split long copy into short paragraphs (three sentences each).
export function paragraphs(text) {
  const s = clean(text).split(/(?<=[.!?])\s+(?=[A-Z])/);
  const out = [];
  for (let i = 0; i < s.length; i += 3) out.push(s.slice(i, i + 3).join(" "));
  return out;
}

// Technology categories, de-duplicated case-insensitively.
export const categories = technologies.map((c) => {
  const seen = new Set();
  return {
    ...c,
    items: c.items.filter((t) => {
      const k = t.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }),
  };
});

// Which projects use a technology: exact match, or the technology is a word-boundary
// prefix of the project's entry ("Apache Kafka" -> "Apache Kafka Streams"); never the
// reverse. "C/C++" checks each part.
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
export function usedIn(tech) {
  const keys = tech.split("/").map(norm);
  return projects.filter((p) =>
    p.technologies.some((pt) => {
      const n = norm(pt);
      return keys.some((k) => n === k || (k.length > 3 && n.startsWith(k + " ")));
    }),
  );
}

// Where a technology was used outside the projects ([label, place]), if anywhere.
export function contextOf(tech) {
  const key = Object.keys(techContext.items).find((k) => k.toLowerCase() === tech.toLowerCase());
  return key ? techContext.items[key] : null;
}

export const profileRows = (uses, ctx) => [...uses.map((p) => [yearOf(p.updatedAt), p.name]), ...(ctx ? [ctx] : [])];

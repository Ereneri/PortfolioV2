import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import AsciiTitle from "../components/AsciiTitle";

export default function NotFound() {
  return (
    <section className="wrap section" aria-labelledby="nf">
      <p className="t-meta">Error 404</p>
      <AsciiTitle as="h1" id="nf" text="File not found" max={22} decode="load" style={{ margin: "20px 0 32px" }} />
      <p className="t-body" style={{ marginBottom: 32 }}>That page doesn't exist, or it moved.</p>
      <Link className="link" to="/"><ArrowLeft className="i-left" aria-hidden="true" /> Back to home</Link>
    </section>
  );
}

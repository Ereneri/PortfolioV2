import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "../App.css";
import NavBar from "../components/Nav/NavBar";
import Footer from "../components/Footer/Footer";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

// The original site, unchanged apart from the "New design" switch in its nav and footer.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function ClassicApp() {
  return (
    <>
      <ScrollToTop />
      <div className="App bg-primary">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

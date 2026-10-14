import { Suspense, lazy } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { VersionProvider, useVersion } from "./version/VersionContext";

// Two versions of the site share the same routes. Each is its own chunk, so visitors only
// download the one they see. See version/VersionContext.js for how the default is chosen.
const RedesignApp = lazy(() => import("./redesign/RedesignApp"));
const ClassicApp = lazy(() => import("./classic/ClassicApp"));

function Site() {
  const { version } = useVersion();
  return <Suspense fallback={null}>{version === "classic" ? <ClassicApp /> : <RedesignApp />}</Suspense>;
}

export default function App() {
  return (
    <Router>
      <VersionProvider>
        <Site />
      </VersionProvider>
    </Router>
  );
}

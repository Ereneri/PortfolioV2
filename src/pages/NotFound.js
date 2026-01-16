import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-accent mb-4">404</h1>
        <p className="text-2xl md:text-3xl font-semibold text-secondary mb-6">
          Page Not Found
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

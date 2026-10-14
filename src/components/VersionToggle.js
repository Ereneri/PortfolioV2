import { SparklesIcon } from "@heroicons/react/16/solid";
import { useVersion } from "../version/VersionContext";

// Classic site → redesign. Same route, so visitors land on the same page.
export default function VersionToggle({ className = "", onNavigate }) {
  const { setVersion } = useVersion();
  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.();
        setVersion("new");
      }}
      className={className}
    >
      <SparklesIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
      New design
    </button>
  );
}

import { useTheme } from "../hooks/useTheme.js";

// A small pill button that flips between the dark and light theme.
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="border border-line-strong px-3 py-1.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
    >
      Switch to {next} theme
    </button>
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

import Index from "./pages/index";

// Apply the stored theme before first render to avoid a flash of the wrong theme
const THEME_KEY = "morpli-theme";
const stored = localStorage.getItem(THEME_KEY);
const isDark =
  stored === "dark" ||
  (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
if (isDark) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Index />
    <Analytics />
  </StrictMode>,
);

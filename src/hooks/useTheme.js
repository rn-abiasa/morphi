import { useEffect, useState, useCallback } from "react";

const THEME_KEY = "morpli-theme";
const THEME_VALUES = ["light", "dark", "system"];

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return THEME_VALUES.includes(stored) ? stored : "system";
  });

  const getSystemTheme = useCallback(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  const resolveTheme = useCallback(
    (t) => (t === "system" ? getSystemTheme() : t),
    [getSystemTheme]
  );

  const applyTheme = useCallback(
    (t) => {
      const resolved = resolveTheme(t);
      if (resolved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute(
          "content",
          resolved === "dark" ? "#1d1d1f" : "#fbfbfd"
        );
      }
    },
    [resolveTheme]
  );

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEME_VALUES.indexOf(prev);
      const next = THEME_VALUES[(idx + 1) % THEME_VALUES.length];
      return next;
    });
  }, []);

  const iconForTheme = useCallback(() => {
    const resolved = resolveTheme(theme);
    return resolved === "dark" ? "sun" : "moon";
  }, [theme, resolveTheme]);

  return { theme, setTheme, toggleTheme, iconForTheme };
}

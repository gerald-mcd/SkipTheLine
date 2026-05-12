import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";
const KEY = "stl:theme";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {}
  window.dispatchEvent(new Event("stl:theme-change"));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
    const onChange = () => setTheme(readTheme());
    window.addEventListener("stl:theme-change", onChange);
    return () => window.removeEventListener("stl:theme-change", onChange);
  }, []);

  const toggle = useCallback(() => {
    apply(readTheme() === "dark" ? "light" : "dark");
  }, []);

  const set = useCallback((t: Theme) => apply(t), []);

  return { theme, toggle, setTheme: set };
}
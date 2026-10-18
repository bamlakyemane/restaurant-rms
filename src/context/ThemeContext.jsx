import { useEffect, useState } from "react";
import { storage } from "../services/storage";
import { ThemeContext } from "./theme.context";

const KEY = "theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.read(KEY) ?? "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    storage.write(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

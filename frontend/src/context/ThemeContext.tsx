"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext =
  createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const [theme, setThemeState] =
    useState<Theme>("light");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as Theme) ||
      "light";

    setThemeState(savedTheme);

    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark"
    );
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle(
      "dark",
      newTheme === "dark"
    );
  };

  const toggleTheme = () => {
    setTheme(
      theme === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
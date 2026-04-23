import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { colours, darkColours } from "./colours";

export type Colours = typeof colours;
type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  colours: Colours;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  colours,
  toggleTheme: () => {},
});

// Wraps the app and provides the current colour palette to all children
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Loads saved theme preference on startup
  useEffect(() => {
    AsyncStorage.getItem("app_theme").then((saved) => {
      if (saved === "dark") setTheme("dark");
    });
  }, []);

  // Switches between light and dark and saves the preference
  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    AsyncStorage.setItem("app_theme", next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colours: theme === "dark" ? darkColours : colours, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Returns the current theme, colour palette and toggle function
export function useTheme() {
  return useContext(ThemeContext);
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ColorSchemeName } from 'react-native';

type ThemeContextType = {
  theme: ColorSchemeName;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(systemColorScheme);

  // On mount, check for stored theme
  useEffect(() => {
    (async () => {
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      }
    })();
  }, []);

  // When theme changes, update storage
  useEffect(() => {
    if (!theme) return;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
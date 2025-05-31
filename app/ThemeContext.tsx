import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isThemeReady: boolean; // Add this to track hydration
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Consistent initial value for SSR
  const [isThemeReady, setIsThemeReady] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Only run on client side
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as Theme);
        } else if (colorScheme) {
          setTheme(colorScheme as Theme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      } finally {
        setIsThemeReady(true);
      }
    };

    loadTheme();
  }, [colorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isThemeReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
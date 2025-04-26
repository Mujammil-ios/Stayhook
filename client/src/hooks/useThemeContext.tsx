import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  systemTheme: 'light',
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || defaultTheme;
  });
  
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Effect to detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Effect to apply theme changes to the document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    root.classList.add(effectiveTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, systemTheme]);

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  systemTheme: 'light',
  resolvedTheme: 'light',
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'theme'
}: ThemeProviderProps) => {
  // Get initial theme from localStorage with fallback to defaultTheme
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(storageKey);
        // Validate the theme is one of the allowed values
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          return savedTheme;
        }
      } catch (error) {
        console.error('Error reading theme from localStorage:', error);
      }
    }
    return defaultTheme;
  });
  
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Calculate the resolved theme based on current settings
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Effect to detect system theme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Use a more modern approach for event listener
    try {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (err) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Effect to apply theme changes to the document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Remove both theme classes first
    root.classList.remove('light', 'dark');
    
    // Add the appropriate class based on the resolved theme
    root.classList.add(resolvedTheme);
    
    // Update color scheme meta tag for browser UI
    document
      .querySelector('meta[name="color-scheme"]')
      ?.setAttribute('content', resolvedTheme);
    
    // Save user preference to localStorage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme, systemTheme, resolvedTheme, storageKey]);

  // Set theme function with proper type checking
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        systemTheme,
        resolvedTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
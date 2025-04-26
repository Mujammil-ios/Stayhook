import React from 'react';
import { useTheme } from '@/hooks/useThemeContext';
import { Button } from './button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Current theme: ${theme}`}
    >
      {theme === 'dark' ? (
        <i className="ri-moon-fill text-lg" />
      ) : theme === 'light' ? (
        <i className="ri-sun-fill text-lg" />
      ) : (
        <i className="ri-computer-fill text-lg" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
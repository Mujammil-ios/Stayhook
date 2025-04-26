import { useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme();

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [setTheme, systemTheme]);

  return { theme, setTheme };
};

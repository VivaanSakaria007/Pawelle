import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  direction: Direction;
  toggleDirection: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('pawelle_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [direction, setDirection] = useState<Direction>(() => {
    try {
      const saved = localStorage.getItem('pawelle_dir');
      return saved === 'rtl' ? 'rtl' : 'ltr';
    } catch {
      return 'ltr';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pawelle_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', direction === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('pawelle_dir', direction);
  }, [direction]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDirection = () => {
    setDirection(prev => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, direction, toggleDirection }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

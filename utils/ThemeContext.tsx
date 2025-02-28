import React, { createContext, useState, useContext } from 'react';

// Define a simple theme interface
interface Theme {
  background: string;
  text: string;
}

// Define light and dark themes
const lightTheme: Theme = {
  background: '#f5f5f5',
  text: '#333333',
};

const darkTheme: Theme = {
  background: '#121212',
  text: '#ffffff',
};

// Create the context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

// Create the provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create the hook
export const useTheme = () => useContext(ThemeContext);
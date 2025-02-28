import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#4a4ae0',
  secondary: '#4CAF50',
  accent: '#2196F3',
  border: '#e0e0e0',
  error: '#f44336',
  levelCard: '#1a1a2e',
  levelCardText: '#ffffff',
  quoteBackground: '#1a1a2e',
  quoteText: '#ffffff',
  quoteAuthor: '#aaaaaa',
};

export const darkTheme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  primary: '#6565e7',
  secondary: '#66bb6a',
  accent: '#42a5f5',
  border: '#333333',
  error: '#e57373',
  levelCard: '#2a2a4e',
  levelCardText: '#ffffff',
  quoteBackground: '#2a2a4e',
  quoteText: '#ffffff',
  quoteAuthor: '#cccccc',
};

export type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

const THEME_PREFERENCE_KEY = 'solo_leveling_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme === 'dark') {
          setIsDark(true);
          setTheme(darkTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme);
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
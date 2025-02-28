import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
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
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
  themeMode: 'system',
});

const THEME_PREFERENCE_KEY = 'solo_leveling_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [theme, setTheme] = useState<Theme>(deviceTheme === 'dark' ? darkTheme : lightTheme);
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as 'light' | 'dark' | 'system');
          
          if (savedThemeMode === 'light') {
            setTheme(lightTheme);
          } else if (savedThemeMode === 'dark') {
            setTheme(darkTheme);
          } else {
            // System default
            setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, [deviceTheme]);
  
  // Update theme when device theme changes (if using system preference)
  useEffect(() => {
    if (themeMode === 'system') {
      setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [deviceTheme, themeMode]);
  
  const toggleTheme = () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemePreference(newThemeMode);
  };
  
  const setThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
      setThemeMode(mode);
      
      if (mode === 'system') {
        setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
      } else {
        setTheme(mode === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDark: themeMode === 'dark' || (themeMode === 'system' && deviceTheme === 'dark'),
        toggleTheme,
        setTheme: setThemePreference,
        themeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
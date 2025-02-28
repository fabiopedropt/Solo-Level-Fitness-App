import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import { SubscriptionProvider, useSubscription } from './utils/SubscriptionContext';
import AdBanner from './components/AdBanner';

// Simple screen components
function HomeScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Home Screen</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Welcome to Solo Leveling Training!
      </Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

function StatsScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Stats Screen</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Your training statistics will appear here.
      </Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Profile Screen</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Your profile information will appear here.
      </Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { isPremium, purchaseSubscription, cancelSubscription } = useSubscription();
  
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings Screen</Text>
      
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor="#f4f3f4"
        />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          Premium Status: {isPremium ? 'Active' : 'Inactive'}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        {!isPremium ? (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={purchaseSubscription}
          >
            <Text style={styles.buttonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.error }]}
            onPress={cancelSubscription}
          >
            <Text style={styles.buttonText}>Cancel Premium</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

function AppContent() {
  const { theme, isDark } = useTheme();
  
  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Simple Ad Banner Component
function AdBanner({ onPress }) {
  return (
    <View style={styles.adBanner}>
      <Text style={styles.adText}>This is a simulated advertisement</Text>
      <TouchableOpacity style={styles.adButton} onPress={onPress}>
        <Text style={styles.adButtonText}>Remove Ads</Text>
      </TouchableOpacity>
    </View>
  );
}

// Simple screen components
function HomeScreen() {
  const [isPremium, setIsPremium] = useState(false);
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.text}>Welcome to Solo Leveling Training!</Text>
      {!isPremium && <AdBanner onPress={() => setIsPremium(true)} />}
    </SafeAreaView>
  );
}

function StatsScreen() {
  const [isPremium, setIsPremium] = useState(false);
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Stats Screen</Text>
      <Text style={styles.text}>Your training statistics will appear here.</Text>
      {!isPremium && <AdBanner onPress={() => setIsPremium(true)} />}
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const [isPremium, setIsPremium] = useState(false);
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.text}>Your profile information will appear here.</Text>
      {!isPremium && <AdBanner onPress={() => setIsPremium(true)} />}
    </SafeAreaView>
  );
}

function SettingsScreen() {
  const [isPremium, setIsPremium] = useState(false);
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Settings Screen</Text>
      <Text style={styles.settingLabel}>Premium Status: {isPremium ? 'Active' : 'Inactive'}</Text>
      
      <View style={styles.buttonContainer}>
        {!isPremium ? (
          <TouchableOpacity 
            style={[styles.button, styles.upgradeButton]}
            onPress={() => setIsPremium(true)}
          >
            <Text style={styles.buttonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => setIsPremium(false)}
          >
            <Text style={styles.buttonText}>Cancel Premium</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {!isPremium && <AdBanner onPress={() => setIsPremium(true)} />}
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
            tabBarActiveTintColor: '#4a4ae0',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Stats" component={StatsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
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
  upgradeButton: {
    backgroundColor: '#4a4ae0',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adBanner: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    alignItems: 'center',
    width: '90%',
  },
  adText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  adButton: {
    backgroundColor: '#4a4ae0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  adButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
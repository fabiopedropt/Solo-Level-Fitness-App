import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SubscriptionProvider, useSubscription } from './utils/SubscriptionContext';
import AdBanner from './components/AdBanner';

// Simple screen components
function HomeScreen() {
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Solo Leveling Training</Text>
      <Text style={styles.text}>Welcome to your daily training!</Text>
      
      {!isPremium && <AdBanner />}
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Workout</Text>
        <View style={styles.exerciseRow}>
          <Ionicons name="fitness-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.exerciseText}>100 Push-ups</Text>
        </View>
        <View style={styles.exerciseRow}>
          <Ionicons name="body-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.exerciseText}>100 Squats</Text>
        </View>
        <View style={styles.exerciseRow}>
          <Ionicons name="walk-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.exerciseText}>10km Running</Text>
        </View>
        <View style={styles.exerciseRow}>
          <Ionicons name="bicycle-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.exerciseText}>100 Sit-ups</Text>
        </View>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Training</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function StatsScreen() {
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Statistics</Text>
      <Text style={styles.text}>Your training statistics will appear here.</Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Your profile information will appear here.</Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

function SettingsScreen() {
  const { isPremium, purchaseMonthly, purchaseYearly, cancelSubscription } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <Text style={styles.text}>Status: {isPremium ? 'Premium' : 'Free'}</Text>
        
        {isPremium ? (
          <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={cancelSubscription}>
            <Text style={styles.buttonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={purchaseMonthly}>
              <Text style={styles.buttonText}>Monthly Subscription (2€)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, { marginTop: 8 }]} onPress={purchaseYearly}>
              <Text style={styles.buttonText}>Yearly Subscription (21.6€)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {!isPremium && <AdBanner size="large" />}
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                
                switch (route.name) {
                  case 'Home':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  case 'Stats':
                    iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    break;
                  case 'Profile':
                    iconName = focused ? 'person' : 'person-outline';
                    break;
                  case 'Settings':
                    iconName = focused ? 'settings' : 'settings-outline';
                    break;
                  default:
                    iconName = 'help-outline';
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
      </SubscriptionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a4ae0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icon from '@expo/vector-icons';

export default function SoloLevelingLogo() {
  return (
    <View style={styles.container}>
      <Icon.Ionicons name="fitness" size={60} color="#4a4ae0" />
      <Text style={styles.logoText}>SOLO LEVELING</Text>
      <Text style={styles.tagline}>TRAINING</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#4a4ae0',
    fontWeight: 'bold',
  },
});
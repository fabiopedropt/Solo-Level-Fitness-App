import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icon from '@expo/vector-icons';

export default function IconTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      <View style={styles.iconRow}>
        <Icon.Ionicons name="home" size={30} color="#4a4ae0" />
        <Icon.Ionicons name="home-outline" size={30} color="#4a4ae0" />
        <Icon.Ionicons name="stats-chart" size={30} color="#4a4ae0" />
        <Icon.Ionicons name="stats-chart-outline" size={30} color="#4a4ae0" />
      </View>
      <View style={styles.iconRow}>
        <Icon.Ionicons name="person" size={30} color="#4a4ae0" />
        <Icon.Ionicons name="person-outline" size={30} color="#4a4ae0" />
        <Icon.Ionicons name="settings" size={30} color="#4a4ae0" />
        <Icon.Ionicons name="settings-outline" size={30} color="#4a4ae0" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});
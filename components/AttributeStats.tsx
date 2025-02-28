import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserAttributes } from '../utils/mockData';
import { useTheme } from '../utils/ThemeContext';

interface AttributeStatsProps {
  attributes: UserAttributes;
}

export default function AttributeStats({ attributes }: AttributeStatsProps) {
  const { theme } = useTheme();
  const maxAttribute = Math.max(
    attributes.strength,
    attributes.endurance,
    attributes.agility,
    attributes.willpower
  );
  
  const getAttributeBarWidth = (value: number): string => {
    return `${(value / (maxAttribute * 1.2)) * 100}%`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Hunter Attributes</Text>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Strength</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.strengthBar,
              { width: getAttributeBarWidth(attributes.strength) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {attributes.strength.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Endurance</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.enduranceBar,
              { width: getAttributeBarWidth(attributes.endurance) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {attributes.endurance.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Agility</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.agilityBar,
              { width: getAttributeBarWidth(attributes.agility) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {attributes.agility.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Willpower</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.willpowerBar,
              { width: getAttributeBarWidth(attributes.willpower) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {attributes.willpower.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attributeLabel: {
    width: 80,
    fontSize: 14,
  },
  attributeBarContainer: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  attributeBar: {
    height: '100%',
    borderRadius: 6,
  },
  strengthBar: {
    backgroundColor: '#e53935',
  },
  enduranceBar: {
    backgroundColor: '#43a047',
  },
  agilityBar: {
    backgroundColor: '#1e88e5',
  },
  willpowerBar: {
    backgroundColor: '#8e24aa',
  },
  attributeValue: {
    width: 40,
    fontSize: 14,
    textAlign: 'right',
  },
});
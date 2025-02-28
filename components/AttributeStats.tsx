import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserAttributes } from '../utils/mockData';
import { useTheme } from '../utils/ThemeContext';

interface AttributeStatsProps {
  attributes: UserAttributes;
}

export default function AttributeStats({ attributes }: AttributeStatsProps) {
  const { theme } = useTheme();
  
  // Ensure attributes exist and have valid values
  const safeAttributes = {
    strength: attributes?.strength || 1,
    endurance: attributes?.endurance || 1,
    agility: attributes?.agility || 1,
    willpower: attributes?.willpower || 1
  };
  
  const maxAttribute = Math.max(
    safeAttributes.strength,
    safeAttributes.endurance,
    safeAttributes.agility,
    safeAttributes.willpower
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
              { width: getAttributeBarWidth(safeAttributes.strength) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {safeAttributes.strength.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Endurance</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.enduranceBar,
              { width: getAttributeBarWidth(safeAttributes.endurance) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {safeAttributes.endurance.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Agility</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.agilityBar,
              { width: getAttributeBarWidth(safeAttributes.agility) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {safeAttributes.agility.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.attributeRow}>
        <Text style={[styles.attributeLabel, { color: theme.textSecondary }]}>Willpower</Text>
        <View style={[styles.attributeBarContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.attributeBar, 
              styles.willpowerBar,
              { width: getAttributeBarWidth(safeAttributes.willpower) }
            ]} 
          />
        </View>
        <Text style={[styles.attributeValue, { color: theme.textSecondary }]}>
          {safeAttributes.willpower.toFixed(1)}
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
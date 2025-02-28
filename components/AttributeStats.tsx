import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserAttributes } from '../utils/mockData';
import { Ionicons } from '@expo/vector-icons';

interface AttributeStatsProps {
  attributes: UserAttributes;
}

export default function AttributeStats({ attributes }: AttributeStatsProps) {
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
    <View style={styles.container}>
      <Text style={styles.title}>Hunter Attributes</Text>
      
      <View style={styles.attributeRow}>
        <View style={styles.attributeLabelContainer}>
          <Ionicons name="barbell-outline" size={18} color="#e53935" style={styles.attributeIcon} />
          <Text style={styles.attributeLabel}>Strength</Text>
        </View>
        <View style={styles.attributeBarContainer}>
          <View 
            style={[
              styles.attributeBar, 
              styles.strengthBar,
              { width: getAttributeBarWidth(attributes.strength) }
            ]} 
          />
        </View>
        <Text style={styles.attributeValue}>{attributes.strength.toFixed(1)}</Text>
      </View>
      
      <View style={styles.attributeRow}>
        <View style={styles.attributeLabelContainer}>
          <Ionicons name="heart-outline" size={18} color="#43a047" style={styles.attributeIcon} />
          <Text style={styles.attributeLabel}>Endurance</Text>
        </View>
        <View style={styles.attributeBarContainer}>
          <View 
            style={[
              styles.attributeBar, 
              styles.enduranceBar,
              { width: getAttributeBarWidth(attributes.endurance) }
            ]} 
          />
        </View>
        <Text style={styles.attributeValue}>{attributes.endurance.toFixed(1)}</Text>
      </View>
      
      <View style={styles.attributeRow}>
        <View style={styles.attributeLabelContainer}>
          <Ionicons name="flash-outline" size={18} color="#1e88e5" style={styles.attributeIcon} />
          <Text style={styles.attributeLabel}>Agility</Text>
        </View>
        <View style={styles.attributeBarContainer}>
          <View 
            style={[
              styles.attributeBar, 
              styles.agilityBar,
              { width: getAttributeBarWidth(attributes.agility) }
            ]} 
          />
        </View>
        <Text style={styles.attributeValue}>{attributes.agility.toFixed(1)}</Text>
      </View>
      
      <View style={styles.attributeRow}>
        <View style={styles.attributeLabelContainer}>
          <Ionicons name="flame-outline" size={18} color="#8e24aa" style={styles.attributeIcon} />
          <Text style={styles.attributeLabel}>Willpower</Text>
        </View>
        <View style={styles.attributeBarContainer}>
          <View 
            style={[
              styles.attributeBar, 
              styles.willpowerBar,
              { width: getAttributeBarWidth(attributes.willpower) }
            ]} 
          />
        </View>
        <Text style={styles.attributeValue}>{attributes.willpower.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attributeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  attributeIcon: {
    marginRight: 4,
  },
  attributeLabel: {
    fontSize: 14,
    color: '#555555',
  },
  attributeBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#f0f0f0',
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
    color: '#555555',
    textAlign: 'right',
  },
});
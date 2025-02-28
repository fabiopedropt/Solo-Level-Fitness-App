import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAnalyticsMonths } from '../utils/mockData';
import { useTheme } from '../utils/ThemeContext';

interface MonthlyAnalyticsChartProps {
  monthlyWorkouts: Record<string, number>;
}

export default function MonthlyAnalyticsChart({ monthlyWorkouts }: MonthlyAnalyticsChartProps) {
  const { theme } = useTheme();
  const months = getAnalyticsMonths();
  
  // Ensure we have a valid maxWorkouts value
  const workoutValues = months.map(month => monthlyWorkouts?.[month] || 0);
  const maxWorkouts = Math.max(...workoutValues, 1); // Ensure we don't divide by zero
  
  // Format month for display (e.g., "2023-01" -> "Jan")
  const formatMonth = (monthStr: string): string => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString('default', { month: 'short' });
    } catch (error) {
      console.error('Error formatting month:', error);
      return monthStr;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Monthly Workouts</Text>
      
      <View style={styles.chartContainer}>
        {months.map((month) => {
          const workoutCount = monthlyWorkouts?.[month] || 0;
          const barHeight = (workoutCount / maxWorkouts) * 150; // Max height of 150
          
          return (
            <View key={month} style={styles.barContainer}>
              <Text style={[styles.barValue, { color: theme.textSecondary }]}>{workoutCount}</Text>
              <View 
                style={[
                  styles.bar, 
                  { height: Math.max(barHeight, 5), backgroundColor: theme.primary }
                ]} 
              />
              <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
                {formatMonth(month)}
              </Text>
            </View>
          );
        })}
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
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barValue: {
    fontSize: 12,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
  },
});
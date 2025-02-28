import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { getRandomQuote } from '../utils/mockData';

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ visible, level, onClose }: LevelUpModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
          </View>
          
          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>You are now</Text>
            <Text style={styles.levelValue}>Level {level}</Text>
          </View>
          
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>"{getRandomQuote()}"</Text>
            <Text style={styles.quoteAuthor}>- Sung Jin-Woo</Text>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a4ae0',
  },
  header: {
    marginBottom: 20,
  },
  levelUpText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a4ae0',
    textShadowColor: 'rgba(74, 74, 224, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelLabel: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 8,
  },
  levelValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4a4ae0',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
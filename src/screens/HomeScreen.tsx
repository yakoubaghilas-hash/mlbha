import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useCigarette } from '../context/CigaretteContext';

const HomeScreen: React.FC = () => {
  const { todayData, addCigarette, removeCigarette } = useCigarette();
  const total = todayData.morning + todayData.afternoon + todayData.evening;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Today's Count</Text>
        <View style={styles.counterBox}>
          <Text style={styles.counter}>{total}</Text>
          <Text style={styles.unit}>cigarettes</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => {
              addCigarette('afternoon', 'test', []);
            }}
          >
            <Text style={styles.buttonText}>+ Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => {
              if (total > 0) {
                removeCigarette(0);
              }
            }}
          >
            <Text style={styles.buttonText}>- Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  counterBox: {
    backgroundColor: '#0078D4',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  counter: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  unit: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#22c55e',
  },
  removeButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

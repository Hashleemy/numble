import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';

export function ScoreBoard() {
  const level  = useGameStore((s) => s.level);
  const score  = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const C      = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={[styles.label, { color: C.textSub }]}>Level</Text>
        <Text style={[styles.value, { color: C.text }]}>{level}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.label, { color: C.textSub }]}>Score</Text>
        <Text style={[styles.value, { color: C.text }]}>{score}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.label, { color: C.textSub }]}>Streak</Text>
        <Text style={[styles.value, { color: C.text }]}>{streak}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
});

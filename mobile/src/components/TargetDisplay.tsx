import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';

export function TargetDisplay() {
  const target = useGameStore((s) => s.target);
  const C      = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: C.surface, borderColor: C.border }]}>
      <Text style={[styles.label, { color: C.textSub }]}>Target</Text>
      <Text style={[styles.value, { color: C.accent }]}>{target}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
  },
});

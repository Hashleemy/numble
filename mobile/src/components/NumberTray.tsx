import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { NumberTile } from './NumberTile';

export function NumberTray() {
  const numbers    = useGameStore((s) => s.numbers);
  const expression = useGameStore((s) => s.expression);

  const usedCounts = expression
    .match(/\d+/g)
    ?.map(Number)
    .reduce<Record<number, number>>((acc, n) => {
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

  const remaining = { ...usedCounts };
  const isUsed = numbers.map((n) => {
    if ((remaining[n] ?? 0) > 0) {
      remaining[n]--;
      return true;
    }
    return false;
  });

  return (
    <View style={styles.tray}>
      {numbers.map((value, i) => (
        <NumberTile key={i} value={value} isUsed={isUsed[i]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
});

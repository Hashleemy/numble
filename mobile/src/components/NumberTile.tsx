import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';

interface NumberTileProps {
  value:  number;
  isUsed: boolean;
}

export function NumberTile({ value, isUsed }: NumberTileProps) {
  const appendToExpression = useGameStore((s) => s.appendToExpression);
  const C                  = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        { backgroundColor: C.tileBg, borderColor: isUsed ? C.border : C.tileBorder },
        isUsed && styles.used,
      ]}
      onPress={() => appendToExpression(String(value))}
      disabled={isUsed}
      activeOpacity={0.65}
      accessibilityLabel={`Number ${value}`}
    >
      <Text style={[styles.text, { color: isUsed ? C.textMuted : C.tileColor }]}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  used: {
    opacity: 0.3,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
  },
});

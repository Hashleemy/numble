import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';

const OPERATORS = ['+', '-', '*', '/', '(', ')'];

export function OperatorPad() {
  const appendToExpression = useGameStore((s) => s.appendToExpression);
  const gameStatus         = useGameStore((s) => s.gameStatus);
  const C                  = useTheme();

  const playing = gameStatus === 'playing';

  return (
    <View style={styles.grid}>
      {OPERATORS.map((op) => (
        <TouchableOpacity
          key={op}
          style={[
            styles.btn,
            { backgroundColor: C.surfaceAlt, borderColor: C.border },
            !playing && styles.disabled,
          ]}
          onPress={() => appendToExpression(op)}
          disabled={!playing}
          activeOpacity={0.65}
          accessibilityLabel={op}
        >
          <Text style={[styles.btnText, { color: C.accent }, !playing && { color: C.textMuted }]}>
            {op}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  btn: {
    width: 56,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
});

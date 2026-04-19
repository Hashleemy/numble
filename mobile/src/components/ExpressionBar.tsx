import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';

export function ExpressionBar() {
  const expression     = useGameStore((s) => s.expression);
  const backspace      = useGameStore((s) => s.backspace);
  const clearExpression = useGameStore((s) => s.clearExpression);
  const submitExpression = useGameStore((s) => s.submitExpression);
  const gameStatus     = useGameStore((s) => s.gameStatus);
  const C              = useTheme();

  const playing  = gameStatus === 'playing';
  const hasInput = expression.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: C.surface, borderColor: C.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.displayInner}
        style={styles.display}
      >
        {expression ? (
          <Text style={[styles.expr, { color: C.text }]}>{expression}</Text>
        ) : (
          <Text style={[styles.placeholder, { color: C.textMuted }]}>Build your expression…</Text>
        )}
      </ScrollView>

      <View style={[styles.actions, { borderTopColor: C.border }]}>
        <TouchableOpacity
          style={[styles.btn, { borderColor: C.border }, (!playing || !hasInput) && styles.disabled]}
          onPress={backspace}
          disabled={!playing || !hasInput}
        >
          <Text style={[styles.btnText, { color: (!playing || !hasInput) ? C.textMuted : C.text }]}>⌫</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { borderColor: C.border }, (!playing || !hasInput) && styles.disabled]}
          onPress={clearExpression}
          disabled={!playing || !hasInput}
        >
          <Text style={[styles.btnText, { color: (!playing || !hasInput) ? C.textMuted : C.text }]}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.submitBtn, { backgroundColor: C.accent, borderColor: C.border }, (!playing || !hasInput) && styles.disabled]}
          onPress={submitExpression}
          disabled={!playing || !hasInput}
        >
          <Text style={[styles.btnText, { color: C.accentText }]}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  display: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  displayInner: {
    alignItems: 'center',
  },
  expr: {
    fontSize: 22,
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  submitBtn: {
    flex: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.35,
  },
});

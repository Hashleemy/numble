import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore, TIMER_SECONDS } from '../store/settingsStore';
import { ROUND_TIME_SECONDS } from '@numble/shared';
import { useTheme } from '../hooks/useTheme';

export function Timer() {
  const timeRemaining   = useGameStore((s) => s.timeRemaining);
  const totalTime       = useGameStore((s) => s.totalTime);
  const gameStatus      = useGameStore((s) => s.gameStatus);
  const timerDifficulty = useSettingsStore((s) => s.timerDifficulty);
  const C               = useTheme();

  const max    = TIMER_SECONDS[timerDifficulty] || ROUND_TIME_SECONDS;
  const pct    = (timeRemaining / (totalTime || max)) * 100;
  const urgent = timeRemaining <= 10 && gameStatus === 'playing';

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: C.border }]}>
        <View
          style={[
            styles.bar,
            { width: `${pct}%` as `${number}%`, backgroundColor: urgent ? C.urgent : C.accent },
          ]}
        />
      </View>
      <Text style={[styles.label, { color: urgent ? C.urgent : C.textSub }]}>
        {timeRemaining}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
});

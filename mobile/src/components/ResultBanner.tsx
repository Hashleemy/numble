import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
}

export function ResultBanner({ navigation }: Props) {
  const gameStatus     = useGameStore((s) => s.gameStatus);
  const lastScoreDelta = useGameStore((s) => s.lastScoreDelta);
  const streak         = useGameStore((s) => s.streak);
  const nextPuzzle     = useGameStore((s) => s.nextPuzzle);
  const C              = useTheme();

  if (gameStatus !== 'solved' && gameStatus !== 'failed') return null;

  const solved = gameStatus === 'solved';

  function handleNext() {
    nextPuzzle();
  }

  function handleEnd() {
    navigation.navigate('GameOver');
  }

  return (
    <Modal transparent animationType="fade" visible={true} onRequestClose={handleEnd}>
      <View style={styles.overlay}>
        <View style={[styles.banner, { backgroundColor: C.surface, borderColor: solved ? C.success : C.error }]}>
          <Text style={[styles.title, { color: solved ? C.success : C.error }]}>
            {solved ? 'Correct!' : "Time's up!"}
          </Text>
          {solved && (
            <Text style={[styles.scoreDelta, { color: C.accent }]}>+{lastScoreDelta} points</Text>
          )}
          <Text style={[styles.streak, { color: C.textSub }]}>Streak: {streak}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: C.accent }]}
              onPress={handleNext}
            >
              <Text style={[styles.btnText, { color: C.accentText }]}>Next Puzzle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.endBtn, { borderColor: C.border }]}
              onPress={handleEnd}
            >
              <Text style={[styles.endBtnText, { color: C.textSub }]}>End Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  banner: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 28,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  scoreDelta: {
    fontSize: 22,
    fontWeight: '700',
  },
  streak: {
    fontSize: 15,
    fontWeight: '500',
  },
  actions: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  endBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  endBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

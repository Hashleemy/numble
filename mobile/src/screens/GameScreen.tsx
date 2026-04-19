import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useTimer } from '../hooks/useTimer';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import { ScoreBoard } from '../components/ScoreBoard';
import { Timer } from '../components/Timer';
import { TargetDisplay } from '../components/TargetDisplay';
import { ExpressionBar } from '../components/ExpressionBar';
import { NumberTray } from '../components/NumberTray';
import { OperatorPad } from '../components/OperatorPad';
import { ResultBanner } from '../components/ResultBanner';
import { SettingsModal } from '../components/SettingsModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export function GameScreen({ navigation }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const startGame  = useGameStore((s) => s.startGame);
  const score      = useGameStore((s) => s.score);
  const streak     = useGameStore((s) => s.streak);
  const timeTaken  = useGameStore((s) => s.timeTaken);
  const saveResult = useAuthStore((s) => s.saveResult);
  const C          = useTheme();

  useTimer();

  useEffect(() => {
    if (gameStatus === 'idle') startGame();
  }, [gameStatus, startGame]);

  // Persist result to Supabase when round ends
  useEffect(() => {
    if (gameStatus === 'solved' || gameStatus === 'failed') {
      void saveResult({ solved: gameStatus === 'solved', timeTaken, score, streak });
    }
  }, [gameStatus]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <ScrollView
        contentContainerStyle={styles.board}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ScoreBoard />
          <View style={styles.headerBtns}>
            <TouchableOpacity
              style={[styles.iconBtn, { borderColor: C.border }]}
              onPress={() => setShowSettings(true)}
              accessibilityLabel="Settings"
            >
              <Text style={[styles.iconBtnText, { color: C.text }]}>⚙</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { borderColor: C.border }]}
              onPress={() => navigation.replace('Landing')}
              accessibilityLabel="Exit"
            >
              <Text style={[styles.iconBtnText, { color: C.text }]}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timer */}
        <Timer />

        {/* Target */}
        <TargetDisplay />

        {/* Expression */}
        <ExpressionBar />

        {/* Numbers */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Your Numbers</Text>
          <NumberTray />
        </View>

        {/* Operators */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Operators</Text>
          <OperatorPad />
        </View>
      </ScrollView>

      {(gameStatus === 'solved' || gameStatus === 'failed') && (
        <ResultBanner navigation={navigation} />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  board: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 16,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

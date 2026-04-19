import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

export function GameOverScreen({ navigation }: Props) {
  const gameStatus     = useGameStore((s) => s.gameStatus);
  const lastScoreDelta = useGameStore((s) => s.lastScoreDelta);
  const score          = useGameStore((s) => s.score);
  const timeTaken      = useGameStore((s) => s.timeTaken);
  const lastExpression = useGameStore((s) => s.lastExpression);
  const streak         = useGameStore((s) => s.streak);
  const nextPuzzle     = useGameStore((s) => s.nextPuzzle);
  const profile        = useAuthStore((s) => s.profile);
  const C              = useTheme();

  // Guard: if no game played, go home
  React.useEffect(() => {
    if (gameStatus === 'idle' || gameStatus === 'playing') {
      navigation.replace('Landing');
    }
  }, [gameStatus, navigation]);

  if (gameStatus === 'idle' || gameStatus === 'playing') return null;

  const solved    = gameStatus === 'solved';
  const isNewBest = profile ? score >= profile.high_score && score > 0 : false;
  const avgTime   = profile && profile.games_won > 0
    ? Math.round(profile.total_solve_time / profile.games_won)
    : null;

  function handlePlayAgain() {
    nextPuzzle();
    navigation.replace('Game');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          {/* Result badge */}
          <View style={[styles.badge, { backgroundColor: solved ? C.success : C.error }]}>
            <Text style={styles.badgeText}>
              {solved ? '✓ Correct!' : '✕ Time\'s Up'}
            </Text>
          </View>

          {isNewBest && (
            <Text style={[styles.newBest, { color: C.accent }]}>🏆 New Personal Best!</Text>
          )}

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
              <Text style={[styles.statValue, { color: C.text }]}>{score}</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>Total Score</Text>
            </View>
            {solved && (
              <View style={[styles.statBox, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
                <Text style={[styles.statValue, { color: C.accent }]}>+{lastScoreDelta}</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>This Round</Text>
              </View>
            )}
            <View style={[styles.statBox, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
              <Text style={[styles.statValue, { color: C.text }]}>{timeTaken}s</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>Time Taken</Text>
            </View>
            {avgTime !== null && (
              <View style={[styles.statBox, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
                <Text style={[styles.statValue, { color: C.text }]}>{avgTime}s</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>Avg. Solve Time</Text>
              </View>
            )}
            <View style={[styles.statBox, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
              <Text style={[styles.statValue, { color: C.text }]}>{streak}</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>Streak</Text>
            </View>
          </View>

          {/* Expression used */}
          {solved && lastExpression ? (
            <View style={[styles.exprWrap, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
              <Text style={[styles.exprLabel, { color: C.textMuted }]}>Your expression</Text>
              <Text style={[styles.expr, { color: C.text }]}>{lastExpression}</Text>
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.playAgainBtn, { backgroundColor: C.accent }]}
              onPress={handlePlayAgain}
            >
              <Text style={[styles.playAgainText, { color: C.accentText }]}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.homeBtn, { borderColor: C.border }]}
              onPress={() => navigation.replace('Landing')}
            >
              <Text style={[styles.homeBtnText, { color: C.textSub }]}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  newBest: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    minWidth: 90,
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  exprWrap: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    alignItems: 'center',
  },
  exprLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expr: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  playAgainBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: '700',
  },
  homeBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

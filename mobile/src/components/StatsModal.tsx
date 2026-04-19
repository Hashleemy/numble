import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';

interface Props {
  onClose: () => void;
}

export function StatsModal({ onClose }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const C       = useTheme();

  const winRate = profile && profile.games_played > 0
    ? Math.round((profile.games_won / profile.games_played) * 100)
    : 0;

  const avgTime = profile && profile.games_won > 0
    ? Math.round(profile.total_solve_time / profile.games_won)
    : 0;

  const stats = [
    { label: 'High Score',      value: String(profile?.high_score ?? 0) },
    { label: 'Games Played',    value: String(profile?.games_played ?? 0) },
    { label: 'Win Rate',        value: `${winRate}%` },
    { label: 'Longest Streak',  value: String(profile?.longest_streak ?? 0) },
    { label: 'Avg. Solve Time', value: profile && profile.games_won > 0 ? `${avgTime}s` : '—' },
  ];

  return (
    <Modal transparent animationType="fade" visible={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={[styles.panel, { backgroundColor: C.surface, borderColor: C.border }]}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: C.text }]}>Your Stats</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <Text style={[styles.closeBtn, { color: C.textSub }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {stats.map((s) => (
              <View key={s.label} style={[styles.stat, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
                <Text style={[styles.statValue, { color: C.accent }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 20,
    padding: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stat: {
    minWidth: '44%',
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});

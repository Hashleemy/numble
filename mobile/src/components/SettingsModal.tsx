import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Switch } from 'react-native';
import { useSettingsStore, type TimerDifficulty } from '../store/settingsStore';
import { useTheme } from '../hooks/useTheme';

interface Props {
  onClose: () => void;
}

const DIFFICULTIES: TimerDifficulty[] = ['easy', 'normal', 'hard'];

export function SettingsModal({ onClose }: Props) {
  const soundEnabled    = useSettingsStore((s) => s.soundEnabled);
  const timerDifficulty = useSettingsStore((s) => s.timerDifficulty);
  const darkMode        = useSettingsStore((s) => s.darkMode);
  const toggleSound     = useSettingsStore((s) => s.toggleSound);
  const setDifficulty   = useSettingsStore((s) => s.setDifficulty);
  const toggleDarkMode  = useSettingsStore((s) => s.toggleDarkMode);
  const C               = useTheme();

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: C.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: C.text }]}>Settings</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <Text style={[styles.closeBtn, { color: C.textSub }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sound */}
          <View style={[styles.row, { borderBottomColor: C.border }]}>
            <Text style={[styles.rowLabel, { color: C.text }]}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ true: C.accent }}
            />
          </View>

          {/* Dark Mode */}
          <View style={[styles.row, { borderBottomColor: C.border }]}>
            <Text style={[styles.rowLabel, { color: C.text }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ true: C.accent }}
            />
          </View>

          {/* Timer Difficulty */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: C.textSub }]}>Timer Difficulty</Text>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.diffBtn,
                    { borderColor: C.border },
                    timerDifficulty === d && { backgroundColor: C.accent, borderColor: C.accent },
                  ]}
                  onPress={() => setDifficulty(d)}
                >
                  <Text
                    style={[
                      styles.diffBtnText,
                      { color: C.textSub },
                      timerDifficulty === d && { color: C.accentText },
                    ]}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 20,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    paddingTop: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  diffBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

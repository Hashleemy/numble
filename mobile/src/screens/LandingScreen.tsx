import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { useTheme } from '../hooks/useTheme';
import { SettingsModal } from '../components/SettingsModal';
import { StatsModal } from '../components/StatsModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export function LandingScreen({ navigation }: Props) {
  const user      = useAuthStore((s) => s.user);
  const signOut   = useAuthStore((s) => s.signOut);
  const resetGame = useGameStore((s) => s.resetGame);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats,    setShowStats]    = useState(false);
  const C = useTheme();

  function handlePlay() {
    resetGame();
    navigation.navigate('Game');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <View style={styles.page}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity
            style={[styles.navBtn, { borderColor: C.border }]}
            onPress={() => setShowSettings(true)}
            accessibilityLabel="Settings"
          >
            <Text style={[styles.navBtnText, { color: C.text }]}>⚙</Text>
          </TouchableOpacity>
          <View style={styles.navRight}>
            {user ? (
              <>
                <TouchableOpacity
                  style={[styles.navBtn, { borderColor: C.border }]}
                  onPress={() => setShowStats(true)}
                >
                  <Text style={[styles.navBtnText, { color: C.text }]}>My Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navBtn, { borderColor: C.border }]}
                  onPress={signOut}
                >
                  <Text style={[styles.navBtnText, { color: C.text }]}>Sign out</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.navBtn, { borderColor: C.border }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.navBtnText, { color: C.text }]}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Text style={[styles.logoText, { color: C.text }]}>
              <Text style={{ color: C.accent }}>N</Text>umble
            </Text>
          </View>

          <Text style={[styles.tagline, { color: C.textSub }]}>
            Use 6 numbers to reach the target{'\n'}with  +  −  ×  ÷
          </Text>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: C.accent }]}
            onPress={handlePlay}
            activeOpacity={0.85}
          >
            <Text style={[styles.playBtnText, { color: C.accentText }]}>Play Now</Text>
          </TouchableOpacity>

          {!user && (
            <Text style={[styles.saveNote, { color: C.textMuted }]}>
              <Text
                style={[styles.inlineLink, { color: C.accent }]}
                onPress={() => navigation.navigate('Login')}
              >
                Sign in
              </Text>{' '}
              to save your progress and compete across devices
            </Text>
          )}
        </View>
      </View>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showStats && user && <StatsModal onClose={() => setShowStats(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  page: {
    flex: 1,
    padding: 16,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navRight: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  logoWrap: {
    marginBottom: 8,
  },
  logoText: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
  },
  playBtn: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    marginTop: 8,
  },
  playBtnText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  saveNote: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  inlineLink: {
    fontWeight: '600',
  },
});

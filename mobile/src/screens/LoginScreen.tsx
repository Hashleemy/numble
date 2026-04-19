import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import { checkPasswordStrength, isStrongEnough } from '../utils/passwordStrength';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const MAX_ATTEMPTS    = 5;
const LOCKOUT_SECONDS = 30;

const STRENGTH_COLORS: Record<string, string> = {
  weak:   '#f44336',
  fair:   '#ff9800',
  good:   '#2196f3',
  strong: '#4caf50',
};

export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const C      = useTheme();

  const [mode,     setMode]     = useState<'login' | 'signup'>('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [pwTouched,    setPwTouched]    = useState(false);

  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const attemptCount = useRef(0);
  const lockoutTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSignup   = mode === 'signup';
  const strength   = useMemo(() => checkPasswordStrength(password), [password]);
  const passwordOk = isStrongEnough(strength);
  const confirmOk  = confirm === password;

  function switchMode(next: 'login' | 'signup') {
    setMode(next);
    setError(null);
    setPassword('');
    setConfirm('');
    setPwTouched(false);
    setShowPassword(false);
    setShowConfirm(false);
    setSuccess(false);
  }

  function startLockout() {
    if (lockoutTimer.current) clearInterval(lockoutTimer.current);
    setLockoutRemaining(LOCKOUT_SECONDS);
    lockoutTimer.current = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(lockoutTimer.current!);
          lockoutTimer.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSubmit() {
    Keyboard.dismiss();
    setError(null);
    if (lockoutRemaining > 0) return;

    if (isSignup) {
      if (!passwordOk) {
        setError('Please choose a stronger password before continuing.');
        return;
      }
      if (!confirmOk) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const err = isSignup
      ? await signUp(normalizedEmail, password)
      : await signIn(normalizedEmail, password);
    setLoading(false);

    if (err) {
      attemptCount.current += 1;
      if (attemptCount.current >= MAX_ATTEMPTS) {
        attemptCount.current = 0;
        startLockout();
      }
      setError(err);
    } else if (isSignup) {
      setSuccess(true);
    } else {
      attemptCount.current = 0;
      navigation.replace('Landing');
    }
  }

  const isSubmitDisabled =
    loading ||
    lockoutRemaining > 0 ||
    (isSignup && (!passwordOk || !confirmOk));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Back"
          >
            <Text style={[styles.backText, { color: C.accent }]}>← Back</Text>
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            {/* Tabs */}
            <View style={[styles.tabs, { backgroundColor: C.surfaceAlt, borderColor: C.border }]}>
              {(['login', 'signup'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.tab, mode === m && { backgroundColor: C.surface, borderColor: C.border }]}
                  onPress={() => switchMode(m)}
                >
                  <Text style={[styles.tabText, { color: mode === m ? C.text : C.textMuted }]}>
                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Success state */}
            {success ? (
              <View style={styles.successBox}>
                <Text style={[styles.successText, { color: C.success }]}>
                  Check your email to confirm your account, then{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('login')}>
                  <Text style={[styles.link, { color: C.accent }]}>sign in</Text>
                </TouchableOpacity>
                <Text style={[styles.successText, { color: C.success }]}>.</Text>
              </View>
            ) : (
              <View style={styles.form}>
                {/* Email */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: C.textSub }]}>Email</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: C.surfaceAlt, borderColor: C.border, color: C.text }]}
                    placeholder="you@example.com"
                    placeholderTextColor={C.textMuted}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Password */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: C.textSub }]}>Password</Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex, { backgroundColor: C.surfaceAlt, borderColor: C.border, color: C.text }]}
                      placeholder="••••••••"
                      placeholderTextColor={C.textMuted}
                      secureTextEntry={!showPassword}
                      autoComplete={isSignup ? 'new-password' : 'current-password'}
                      value={password}
                      onChangeText={(v) => { setPassword(v); setPwTouched(true); }}
                    />
                    <TouchableOpacity
                      style={[styles.eyeBtn, { borderColor: C.border, backgroundColor: C.surfaceAlt }]}
                      onPress={() => setShowPassword((v) => !v)}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Text style={[styles.eyeText, { color: C.textSub }]}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Strength meter — signup only */}
                  {isSignup && pwTouched && password.length > 0 && (
                    <View style={styles.strengthWrap}>
                      <View style={styles.strengthBarRow}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.strengthSegment,
                              { backgroundColor: i < strength.score ? STRENGTH_COLORS[strength.level] : C.border },
                            ]}
                          />
                        ))}
                        <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[strength.level] }]}>
                          {strength.label}
                        </Text>
                      </View>
                      <View style={styles.checkList}>
                        {strength.checks.map((c) => (
                          <Text key={c.label} style={[styles.checkItem, { color: c.pass ? C.success : C.textMuted }]}>
                            {c.pass ? '✓' : '○'}  {c.label}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Confirm password — signup only */}
                {isSignup && (
                  <View style={styles.field}>
                    <Text style={[styles.label, { color: C.textSub }]}>Confirm Password</Text>
                    <View style={styles.passwordRow}>
                      <TextInput
                        style={[styles.input, styles.inputFlex, { backgroundColor: C.surfaceAlt, borderColor: C.border, color: C.text }]}
                        placeholder="••••••••"
                        placeholderTextColor={C.textMuted}
                        secureTextEntry={!showConfirm}
                        autoComplete="new-password"
                        value={confirm}
                        onChangeText={setConfirm}
                      />
                      <TouchableOpacity
                        style={[styles.eyeBtn, { borderColor: C.border, backgroundColor: C.surfaceAlt }]}
                        onPress={() => setShowConfirm((v) => !v)}
                        accessibilityLabel={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        <Text style={[styles.eyeText, { color: C.textSub }]}>
                          {showConfirm ? 'Hide' : 'Show'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {confirm.length > 0 && (
                      <Text style={[styles.matchNote, { color: confirmOk ? C.success : C.error }]}>
                        {confirmOk ? '✓ Passwords match' : '✕ Passwords do not match'}
                      </Text>
                    )}
                  </View>
                )}

                {/* Lockout */}
                {lockoutRemaining > 0 && (
                  <Text style={[styles.lockoutText, { color: C.urgent }]}>
                    Too many failed attempts. Try again in {lockoutRemaining}s.
                  </Text>
                )}

                {/* Error */}
                {error && (
                  <View style={[styles.errorBox, { backgroundColor: C.error + '22', borderColor: C.error }]}>
                    <Text style={[styles.errorText, { color: C.error }]}>{error}</Text>
                  </View>
                )}

                {/* Submit */}
                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: C.accent }, isSubmitDisabled && styles.submitDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitDisabled}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color={C.accentText} />
                    : <Text style={[styles.submitText, { color: C.accentText }]}>
                        {isSignup ? 'Create Account' : 'Sign In'}
                      </Text>
                  }
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    padding: 4,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  form: {
    padding: 20,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  inputFlex: {
    flex: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  eyeBtn: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  strengthWrap: {
    gap: 6,
    marginTop: 4,
  },
  strengthBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    minWidth: 44,
  },
  checkList: {
    gap: 3,
  },
  checkItem: {
    fontSize: 12,
    fontWeight: '500',
  },
  matchNote: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  lockoutText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitDisabled: {
    opacity: 0.45,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
  },
  successBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
  },
});

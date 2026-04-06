import { useState, useMemo, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumbleLogo } from '../components/NumbleLogo';
import { useAuthStore } from '../store/authStore';
import { checkPasswordStrength, isStrongEnough } from '../utils/passwordStrength';
import styles from './LoginPage.module.css';

const MAX_ATTEMPTS    = 5;
const LOCKOUT_SECONDS = 30;

export function LoginPage() {
  const navigate = useNavigate();
  const signIn   = useAuthStore((s) => s.signIn);
  const signUp   = useAuthStore((s) => s.signUp);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    const err = isSignup
      ? await signUp(email.trim().toLowerCase(), password)
      : await signIn(email.trim().toLowerCase(), password);
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
      navigate('/');
    }
  }

  const isSubmitDisabled =
    loading ||
    lockoutRemaining > 0 ||
    (isSignup && (!passwordOk || !confirmOk));

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <NumbleLogo />
        </div>

        {success ? (
          <div className={styles.successMsg}>
            <p>
              Check your email to confirm your account, then{' '}
              <button
                className={styles.link}
                onClick={() => { setSuccess(false); switchMode('login'); }}
              >
                sign in
              </button>.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${mode === 'login'  ? styles.activeTab : ''}`}
                onClick={() => switchMode('login')}
              >
                Sign In
              </button>
              <button
                className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
                onClick={() => switchMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  spellCheck={false}
                />
              </div>

              {/* Password */}
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="password">Password</label>
                <div className={styles.passwordWrap}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.input} ${styles.inputWithEye}`}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwTouched(true); }}
                    placeholder="••••••••"
                    required
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {/* Strength meter — signup only */}
                {isSignup && pwTouched && password.length > 0 && (
                  <div className={styles.strengthMeter}>
                    <div className={styles.strengthBarRow}>
                      <div className={styles.strengthBar}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`${styles.strengthSegment} ${
                              i < strength.score ? `${styles.active} ${styles[strength.level]}` : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`${styles.strengthLabel} ${styles[strength.level]}`}>
                        {strength.label}
                      </span>
                    </div>
                    <ul className={styles.requirements}>
                      {strength.checks.map((c) => (
                        <li key={c.label} className={`${styles.req} ${c.pass ? styles.pass : ''}`}>
                          <span className={styles.reqIcon}>{c.pass ? '✓' : '○'}</span>
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm password — signup only */}
              {isSignup && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="confirm">Confirm Password</label>
                  <div className={styles.passwordWrap}>
                    <input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className={`${styles.input} ${styles.inputWithEye}`}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {confirm.length > 0 && (
                    <p className={`${styles.matchNote} ${confirmOk ? styles.match : styles.mismatch}`}>
                      {confirmOk ? '✓ Passwords match' : '✕ Passwords do not match'}
                    </p>
                  )}
                </div>
              )}

              {lockoutRemaining > 0 && (
                <p className={styles.lockout}>
                  Too many failed attempts. Try again in {lockoutRemaining}s.
                </p>
              )}

              {error && <p className={styles.error}>{error}</p>}

              <button className={styles.submitBtn} type="submit" disabled={isSubmitDisabled}>
                {loading
                  ? 'Please wait…'
                  : isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </>
        )}

        <button className={styles.backLink} onClick={() => navigate('/')}>
          ← Back to home
        </button>
      </div>
    </div>
  );
}

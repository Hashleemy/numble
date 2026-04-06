import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumbleLogo } from '../components/NumbleLogo';
import { SettingsModal } from '../components/SettingsModal';
import { StatsModal } from '../components/StatsModal';
import { useAuthStore } from '../store/authStore';
import styles from './LandingPage.module.css';

const MATH_SYMBOLS = ['+', '÷', '×', '−', '=', '(', ')', '∑', '√', 'π', '²', '∞'];

export function LandingPage() {
  const navigate    = useNavigate();
  const user        = useAuthStore((s) => s.user);
  const signOut     = useAuthStore((s) => s.signOut);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats,    setShowStats]    = useState(false);

  return (
    <div className={styles.page}>
      {/* Decorative floating math symbols */}
      <div className={styles.symbols} aria-hidden="true">
        {MATH_SYMBOLS.map((sym, i) => (
          <span
            key={i}
            className={styles.symbol}
            style={{
              left:            `${(i * 8.3) % 95}%`,
              top:             `${(i * 13 + 7) % 88}%`,
              animationDelay:  `${i * 0.7}s`,
              fontSize:        `${1.2 + (i % 3) * 0.6}rem`,
            }}
          >
            {sym}
          </span>
        ))}
      </div>

      {/* Top nav */}
      <nav className={styles.nav}>
        <button className={styles.navBtn} onClick={() => setShowSettings(true)} aria-label="Settings">
          ⚙
        </button>
        <div className={styles.navRight}>
          {user ? (
            <>
              <button className={styles.navBtn} onClick={() => setShowStats(true)}>
                My Stats
              </button>
              <button className={styles.navBtn} onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <button className={styles.navBtn} onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className={styles.hero}>
        <NumbleLogo />
        <p className={styles.tagline}>
          Use 6 numbers to reach the target<br />with +&nbsp;&nbsp;−&nbsp;&nbsp;×&nbsp;&nbsp;÷
        </p>
        <button className={styles.playBtn} onClick={() => navigate('/play')}>
          Play Now
        </button>
        {!user && (
          <p className={styles.saveNote}>
            <button className={styles.inlineLink} onClick={() => navigate('/login')}>
              Sign in
            </button>{' '}
            to save your progress and compete across devices
          </p>
        )}
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showStats    && user && <StatsModal onClose={() => setShowStats(false)} />}
    </div>
  );
}

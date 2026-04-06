import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import styles from './StatsModal.module.css';

interface Props {
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function StatsModal({ onClose }: Props) {
  const profile      = useAuthStore((s) => s.profile);
  const sessions     = useAuthStore((s) => s.sessions);
  const loadSessions = useAuthStore((s) => s.loadSessions);

  useEffect(() => {
    loadSessions();
  }, []);

  const winRate = profile && profile.games_played > 0
    ? Math.round((profile.games_won / profile.games_played) * 100)
    : 0;

  const avgTime = profile && profile.games_won > 0
    ? Math.round(profile.total_solve_time / profile.games_won)
    : 0;

  const aggregateStats = [
    { label: 'High Score',      value: String(profile?.high_score ?? 0) },
    { label: 'Games Played',    value: String(profile?.games_played ?? 0) },
    { label: 'Win Rate',        value: `${winRate}%` },
    { label: 'Longest Streak',  value: String(profile?.longest_streak ?? 0) },
    { label: 'Avg. Solve Time', value: profile?.games_won ? `${avgTime}s` : '—' },
  ];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Stats</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Aggregate stats */}
        <div className={styles.grid}>
          {aggregateStats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Session history */}
        <div className={styles.history}>
          <h3 className={styles.historyTitle}>Session History</h3>
          {sessions.length === 0 ? (
            <p className={styles.emptyHistory}>No sessions recorded yet. Play a game to start tracking!</p>
          ) : (
            <>
              <div className={styles.sessionHeader}>
                <span>Date</span>
                <span>Score</span>
                <span>W / P</span>
                <span>Lvl</span>
                <span>Streak</span>
              </div>
              <ul className={styles.sessionList}>
                {sessions.map((s) => (
                  <li key={s.id} className={styles.sessionRow}>
                    <span className={styles.sessionDate}>
                      <span className={styles.sessionDateMain}>{formatDate(s.played_at)}</span>
                      <span className={styles.sessionTime}>{formatTime(s.played_at)}</span>
                    </span>
                    <span className={styles.sessionStat}>{s.total_score}</span>
                    <span className={styles.sessionStat}>
                      <span className={styles.sessionWon}>{s.rounds_won}</span>
                      <span className={styles.sessionSlash}>/</span>
                      {s.rounds_played}
                    </span>
                    <span className={styles.sessionStat}>{s.max_level}</span>
                    <span className={styles.sessionStat}>{s.max_streak}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

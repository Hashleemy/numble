import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import styles from './GameOverPage.module.css';

export function GameOverPage() {
  const navigate = useNavigate();
  const saved    = useRef(false);

  const nextPuzzle      = useGameStore((s) => s.nextPuzzle);
  const gameStatus      = useGameStore((s) => s.gameStatus);
  const lastScoreDelta  = useGameStore((s) => s.lastScoreDelta);
  const score           = useGameStore((s) => s.score);
  const timeTaken       = useGameStore((s) => s.timeTaken);
  const lastExpression  = useGameStore((s) => s.lastExpression);
  const level               = useGameStore((s) => s.level);
  const sessionRoundsPlayed = useGameStore((s) => s.sessionRoundsPlayed);
  const sessionRoundsWon    = useGameStore((s) => s.sessionRoundsWon);
  const sessionMaxStreak    = useGameStore((s) => s.sessionMaxStreak);

  const profile      = useAuthStore((s) => s.profile);
  const saveSession  = useAuthStore((s) => s.saveSession);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    saveSession({
      total_score:   score,
      rounds_played: sessionRoundsPlayed,
      rounds_won:    sessionRoundsWon,
      max_level:     level,
      max_streak:    sessionMaxStreak,
    });
  }, []);

  if (gameStatus === 'idle' || gameStatus === 'playing') {
    navigate('/');
    return null;
  }

  const solved    = gameStatus === 'solved';
  const isNewBest = profile ? score >= profile.high_score && score > 0 : false;

  const avgTime = profile && profile.games_won > 0
    ? Math.round(profile.total_solve_time / profile.games_won)
    : null;

  function handlePlayAgain() {
    nextPuzzle();
    navigate('/play');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={`${styles.resultBadge} ${solved ? styles.solvedBadge : styles.failedBadge}`}>
          {solved ? '✓ Correct!' : '✕ Time\'s Up'}
        </div>

        {isNewBest && (
          <div className={styles.newBest}>🏆 New Personal Best!</div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{score}</span>
            <span className={styles.statLabel}>Total Score</span>
          </div>
          {solved && (
            <div className={styles.statBox}>
              <span className={styles.statValue}>+{lastScoreDelta}</span>
              <span className={styles.statLabel}>This Round</span>
            </div>
          )}
          <div className={styles.statBox}>
            <span className={styles.statValue}>{timeTaken}s</span>
            <span className={styles.statLabel}>Time Taken</span>
          </div>
          {avgTime !== null && (
            <div className={styles.statBox}>
              <span className={styles.statValue}>{avgTime}s</span>
              <span className={styles.statLabel}>Avg. Solve Time</span>
            </div>
          )}
          <div className={styles.statBox}>
            <span className={styles.statValue}>{sessionMaxStreak}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
        </div>

        {solved && lastExpression && (
          <div className={styles.expressionWrap}>
            <span className={styles.expressionLabel}>Your expression</span>
            <code className={styles.expression}>{lastExpression}</code>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.playAgainBtn} onClick={handlePlayAgain}>
            Play Again
          </button>
          <button className={styles.homeBtn} onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

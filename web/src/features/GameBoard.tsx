import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTimer } from '../hooks/useTimer';
import { useDragExpression } from '../hooks/useDragExpression';
import { NumberTray } from '../components/NumberTray';
import { OperatorPad } from '../components/OperatorPad';
import { ExpressionBar } from '../components/ExpressionBar';
import { TargetDisplay } from '../components/TargetDisplay';
import { Timer } from '../components/Timer';
import { ScoreBoard } from '../components/ScoreBoard';
import { ResultBanner } from '../components/ResultBanner';
import { SettingsModal } from '../components/SettingsModal';
import styles from './GameBoard.module.css';

interface Props {
  onExit: () => void;
}

export function GameBoard({ onExit }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const { onDragEnd } = useDragExpression();

  useTimer();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className={styles.board}>
        <div className={styles.header}>
          <ScoreBoard />
          <div style={{ display: 'flex', gap: 6 }}>
            <button className={styles.settingsBtn} onClick={() => setShowSettings(true)} aria-label="Settings">⚙</button>
            <button className={styles.settingsBtn} onClick={onExit} aria-label="Exit">✕</button>
          </div>
        </div>
        <Timer />
        <TargetDisplay />
        <ExpressionBar />
        <NumberTray />
        <OperatorPad />
        <ResultBanner />
      </div>
      <DragOverlay />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </DndContext>
  );
}

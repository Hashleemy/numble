import { useDraggable } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { playClick } from '../lib/sounds';
import styles from './NumberTile.module.css';

interface NumberTileProps {
  id: string;
  value: number;
  isUsed: boolean;
}

export function NumberTile({ id, value, isUsed }: NumberTileProps) {
  const appendToExpression = useGameStore((s) => s.appendToExpression);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { value },
    disabled: isUsed,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  function handleClick() {
    if (!isDragging) {
      if (soundEnabled) playClick();
      appendToExpression(String(value));
    }
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={`${styles.tile} ${isUsed ? styles.used : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      aria-label={`Number ${value}`}
      disabled={isUsed}
    >
      {value}
    </button>
  );
}

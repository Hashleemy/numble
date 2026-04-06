import { type DragEndEvent } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';

export function useDragExpression() {
  const appendToExpression = useGameStore((s) => s.appendToExpression);

  function onDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (!over) return;
    const value = active.data.current?.value as number | undefined;
    if (value !== undefined) {
      appendToExpression(String(value));
    }
  }

  return { onDragEnd };
}

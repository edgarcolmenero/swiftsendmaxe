import type { KeyboardEventHandler } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { ProcessStep } from '@entities/processStep';

export function useProcessSteps(steps: ProcessStep[]) {
  const ordered = useMemo(() => [...steps].sort((a, b) => a.order - b.order), [steps]);
  const [activeId, setActiveId] = useState(() => ordered[0]?.id ?? '');

  const activeIndex = ordered.findIndex((step) => step.id === activeId);
  const progress = ordered.length > 1 ? Math.round((activeIndex / (ordered.length - 1)) * 100) : 100;

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, ordered.length - 1));
      setActiveId(ordered[clamped]?.id ?? activeId);
    },
    [activeId, ordered],
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>( 
    (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          goToIndex(activeIndex + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          goToIndex(activeIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          goToIndex(0);
          break;
        case 'End':
          event.preventDefault();
          goToIndex(ordered.length - 1);
          break;
        default:
          break;
      }
    },
    [activeIndex, goToIndex, ordered.length],
  );

  return {
    steps: ordered,
    activeId,
    activeIndex,
    progress,
    setActiveId,
    handleKeyDown,
  };
}

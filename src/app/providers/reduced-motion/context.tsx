import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ReducedMotionValue {
  prefersReducedMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionValue>({ prefersReducedMotion: false });

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    query.addEventListener('change', handler);
    return () => {
      query.removeEventListener('change', handler);
    };
  }, []);

  const value = useMemo(() => ({ prefersReducedMotion }), [prefersReducedMotion]);

  return <ReducedMotionContext.Provider value={value}>{children}</ReducedMotionContext.Provider>;
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

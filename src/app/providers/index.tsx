import type { ReactNode } from 'react';
import { ReducedMotionProvider } from './reduced-motion';
import { ThemeProvider } from './theme';
import { UrlStateProvider } from './url-state';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UrlStateProvider>
      <ReducedMotionProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReducedMotionProvider>
    </UrlStateProvider>
  );
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import './styles/index.css';
import { AppProviders } from './providers';

export function bootstrap(page: ReactNode, containerId = 'root') {
  document.documentElement.classList.remove('no-js');
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Mount container "${containerId}" not found`);
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <AppProviders>{page}</AppProviders>
    </StrictMode>,
  );
}

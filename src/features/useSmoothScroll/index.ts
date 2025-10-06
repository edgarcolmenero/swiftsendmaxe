import { useCallback } from 'react';
import { useReducedMotion } from '@app/providers/reduced-motion';
import { useUrlState } from '@app/providers/url-state';

const HEADER_VAR = '--ss-header-height';

const getHeaderOffset = () => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(HEADER_VAR).trim();
  const parsed = Number.parseFloat(value.replace('px', ''));
  return Number.isFinite(parsed) ? parsed : 84;
};

export function useSmoothScroll() {
  const { prefersReducedMotion } = useReducedMotion();
  const { setHash } = useUrlState();

  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const href = event.currentTarget.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        return;
      }

      const targetId = href.slice(1);
      const element = document.getElementById(targetId);
      if (!element) {
        return;
      }

      event.preventDefault();
      const offset = getHeaderOffset();
      const rect = element.getBoundingClientRect();
      const targetPosition = rect.top + window.scrollY - offset + 1;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetPosition);
      } else {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }

      setHash(targetId, { replace: true });
    },
    [prefersReducedMotion, setHash],
  );
}
